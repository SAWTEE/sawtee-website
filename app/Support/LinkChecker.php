<?php

namespace App\Support;

use DOMDocument;
use DOMXPath;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

/**
 * Crawl the public frontend (never /admin) and report broken links / missing files.
 */
class LinkChecker
{
    public const CACHE_KEY = 'admin.link_checker.last_report';

    /**
     * JSON prop keys that commonly hold navigational or asset URLs.
     *
     * @var list<string>
     */
    private const INERTIA_URL_KEYS = [
        'url',
        'href',
        'src',
        'link',
        'permalink',
        'path',
        'file',
        'pdf',
        'download',
        'image',
        'original_url',
        'preview_url',
        'thumbnail_url',
        'media_url',
    ];

    /**
     * Prop keys that are noisy for link discovery (route tables, auth, etc.).
     *
     * @var list<string>
     */
    private const INERTIA_SKIP_KEYS = [
        'ziggy',
        'errors',
        'auth',
        'flash',
        'csrf',
        'csrf_token',
        'session',
    ];

    public function __construct(private SitemapCache $sitemap) {}

    /**
     * @return array{
     *   started_at: string,
     *   finished_at: string,
     *   base_url: string,
     *   pages_crawled: int,
     *   links_checked: int,
     *   ok: int,
     *   broken: list<array{url: string, status: int|string, source: string, type: string}>,
     *   skipped_external: int,
     *   errors: list<string>,
     *   truncated: bool
     * }
     */
    public function crawl(
        ?string $baseUrl = null,
        int $maxPages = 200,
        int $maxLinks = 2000,
        bool $checkExternal = false,
    ): array {
        $baseUrl = rtrim($baseUrl ?: (string) config('app.url'), '/');
        $baseHost = parse_url($baseUrl, PHP_URL_HOST);

        $startedAt = now()->toIso8601String();
        $queue = $this->seedQueue($baseUrl, $baseHost, $maxPages);
        $visitedPages = [];
        $checkedLinks = [];
        $broken = [];
        $ok = 0;
        $skippedExternal = 0;
        $errors = [];
        $truncated = false;

        while ($queue !== [] && count($visitedPages) < $maxPages) {
            $pageUrl = array_shift($queue);
            $normalizedPage = $this->normalizeUrl($pageUrl, $baseUrl);

            if ($normalizedPage === null || isset($visitedPages[$normalizedPage])) {
                continue;
            }

            if ($this->isAdminPath($normalizedPage)) {
                continue;
            }

            if (! $this->isSameHost($normalizedPage, $baseHost)) {
                continue;
            }

            $visitedPages[$normalizedPage] = true;

            try {
                $response = Http::timeout(8)
                    ->withHeaders(['User-Agent' => 'SAWTEE-LinkChecker/1.0'])
                    ->withOptions(['allow_redirects' => true])
                    ->get($normalizedPage);
            } catch (ConnectionException $e) {
                $broken[] = [
                    'url' => $normalizedPage,
                    'status' => 'connection_error',
                    'source' => 'crawl',
                    'type' => 'page',
                ];
                $errors[] = $normalizedPage.': '.$e->getMessage();

                continue;
            } catch (Throwable $e) {
                report($e);
                $errors[] = $normalizedPage.': '.$e->getMessage();

                continue;
            }

            $status = $response->status();
            if ($status >= 400) {
                $broken[] = [
                    'url' => $normalizedPage,
                    'status' => $status,
                    'source' => 'crawl',
                    'type' => 'page',
                ];

                continue;
            }

            $contentType = strtolower((string) $response->header('Content-Type'));
            if (! str_contains($contentType, 'text/html') && ! str_contains($contentType, 'application/xhtml')) {
                $ok++;

                continue;
            }

            $html = $response->body();
            $links = $this->extractLinks($html, $normalizedPage);

            foreach ($links as $link) {
                if (count($checkedLinks) >= $maxLinks) {
                    $truncated = true;
                    break 2;
                }

                $absolute = $this->normalizeUrl($link['href'], $normalizedPage);
                if ($absolute === null) {
                    continue;
                }

                if ($this->isAdminPath($absolute)) {
                    continue;
                }

                $key = $absolute.'|'.$link['type'];
                if (isset($checkedLinks[$key])) {
                    continue;
                }
                $checkedLinks[$key] = true;

                $sameHost = $this->isSameHost($absolute, $baseHost);

                if (! $sameHost) {
                    $skippedExternal++;
                    if (! $checkExternal) {
                        continue;
                    }
                }

                $result = $this->checkTarget($absolute, $baseHost);

                if ($result['ok']) {
                    $ok++;
                } else {
                    $broken[] = [
                        'url' => $absolute,
                        'status' => $result['status'],
                        'source' => $normalizedPage,
                        'type' => $link['type'],
                    ];
                }

                // Only enqueue same-host HTML-like navigational links for crawling.
                if (
                    $sameHost
                    && $link['type'] === 'anchor'
                    && $result['ok']
                    && $this->looksLikeHtmlPath($absolute)
                    && ! isset($visitedPages[$absolute])
                    && count($visitedPages) + count($queue) < $maxPages * 2
                ) {
                    $queue[] = $absolute;
                }
            }
        }

        if (count($visitedPages) >= $maxPages || count($checkedLinks) >= $maxLinks) {
            $truncated = true;
        }

        $report = [
            'started_at' => $startedAt,
            'finished_at' => now()->toIso8601String(),
            'base_url' => $baseUrl,
            'pages_crawled' => count($visitedPages),
            'links_checked' => count($checkedLinks),
            'ok' => $ok,
            'broken' => $broken,
            'skipped_external' => $skippedExternal,
            'errors' => array_slice($errors, 0, 20),
            'truncated' => $truncated,
        ];

        Cache::put(self::CACHE_KEY, $report, now()->addDays(7));

        return $report;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function lastReport(): ?array
    {
        $report = Cache::get(self::CACHE_KEY);

        return is_array($report) ? $report : null;
    }

    /**
     * @return list<string>
     */
    private function seedQueue(string $baseUrl, ?string $baseHost, int $maxPages): array
    {
        $seeds = [$baseUrl.'/', $baseUrl];

        try {
            foreach ($this->sitemap->locs() as $loc) {
                // Rebase sitemap locs onto the crawl origin so APP_URL scheme/host
                // differences (http vs https) do not skip or miss pages.
                $path = parse_url($loc, PHP_URL_PATH);
                if (! is_string($path) || $path === '') {
                    $path = '/';
                }
                $query = parse_url($loc, PHP_URL_QUERY);
                $relative = $path.($query ? '?'.$query : '');

                $normalized = $this->normalizeUrl($relative, $baseUrl);
                if (
                    $normalized === null
                    || $this->isAdminPath($normalized)
                    || ! $this->isSameHost($normalized, $baseHost)
                ) {
                    continue;
                }

                $seeds[] = $normalized;
            }
        } catch (Throwable $e) {
            report($e);
        }

        $seeds = array_values(array_unique($seeds));

        // Keep the seed list bounded; crawl loop still enforces maxPages.
        return array_slice($seeds, 0, max($maxPages * 2, 50));
    }

    /**
     * @return list<array{href: string, type: string}>
     */
    private function extractLinks(string $html, string $pageUrl): array
    {
        $links = [];

        if ($html === '') {
            return $links;
        }

        $previous = libxml_use_internal_errors(true);
        $dom = new DOMDocument;
        $loaded = $dom->loadHTML($html, LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NONET);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if ($loaded) {
            $xpath = new DOMXPath($dom);

            $queries = [
                'anchor' => '//a[@href]',
                'image' => '//img[@src]',
                'script' => '//script[@src]',
                'stylesheet' => '//link[@href]',
                'iframe' => '//iframe[@src]',
                'source' => '//source[@src]',
                'video' => '//video[@src]',
                'audio' => '//audio[@src]',
            ];

            foreach ($queries as $type => $query) {
                foreach ($xpath->query($query) ?: [] as $node) {
                    $attr = $type === 'anchor' || $type === 'stylesheet' ? 'href' : 'src';
                    $value = trim((string) $node->getAttribute($attr));

                    if ($value === '' || str_starts_with($value, '#')) {
                        continue;
                    }

                    if ($type === 'stylesheet') {
                        $rel = strtolower((string) $node->getAttribute('rel'));
                        if ($rel !== '' && ! str_contains($rel, 'stylesheet') && ! str_contains($rel, 'icon')) {
                            continue;
                        }
                    }

                    if (preg_match('#^(mailto:|tel:|fax:|javascript:|data:)#i', $value)) {
                        continue;
                    }

                    $links[] = ['href' => $value, 'type' => $type];
                }
            }
        }

        // Also catch common absolute/relative file URLs in inline content attributes.
        if (preg_match_all('#(?:href|src)=["\']([^"\']+)["\']#i', $html, $matches)) {
            foreach ($matches[1] as $value) {
                $value = trim($value);
                if ($value === '' || str_starts_with($value, '#')) {
                    continue;
                }
                if (preg_match('#^(mailto:|tel:|fax:|javascript:|data:)#i', $value)) {
                    continue;
                }
                $links[] = ['href' => $value, 'type' => 'attribute'];
            }
        }

        foreach ($this->extractInertiaLinks($html) as $link) {
            $links[] = $link;
        }

        return $links;
    }

    /**
     * @return list<array{href: string, type: string}>
     */
    private function extractInertiaLinks(string $html): array
    {
        $json = $this->inertiaPageJson($html);
        if ($json === null) {
            return [];
        }

        $data = json_decode($json, true);
        if (! is_array($data)) {
            return [];
        }

        $props = $data['props'] ?? $data;
        if (! is_array($props)) {
            return [];
        }

        $links = [];
        $this->collectUrlsFromInertiaValue($props, null, $links);

        return $links;
    }

    private function inertiaPageJson(string $html): ?string
    {
        if (
            preg_match('/<script[^>]*\bdata-page\b[^>]*type=["\']application\/json["\'][^>]*>(.*?)<\/script>/is', $html, $matches)
            || preg_match('/<script[^>]*type=["\']application\/json["\'][^>]*\bdata-page\b[^>]*>(.*?)<\/script>/is', $html, $matches)
        ) {
            return $matches[1];
        }

        // Legacy Inertia: JSON embedded in a data-page attribute.
        if (preg_match('/\bdata-page=(["\'])(.+?)\1/s', $html, $matches)) {
            $decoded = html_entity_decode($matches[2], ENT_QUOTES | ENT_HTML5);
            if (str_starts_with(ltrim($decoded), '{')) {
                return $decoded;
            }
        }

        return null;
    }

    /**
     * @param  list<array{href: string, type: string}>  $links
     */
    private function collectUrlsFromInertiaValue(mixed $value, ?string $key, array &$links): void
    {
        if (is_array($value)) {
            foreach ($value as $childKey => $child) {
                $nextKey = is_string($childKey) ? $childKey : $key;

                if (is_string($nextKey) && in_array($nextKey, self::INERTIA_SKIP_KEYS, true)) {
                    continue;
                }

                $this->collectUrlsFromInertiaValue($child, $nextKey, $links);
            }

            return;
        }

        if (! is_string($value) || $value === '') {
            return;
        }

        if (
            is_string($key)
            && in_array($key, self::INERTIA_URL_KEYS, true)
            && ! preg_match('~^(mailto:|tel:|fax:|javascript:|data:|#)~i', $value)
        ) {
            $links[] = [
                'href' => $value,
                'type' => $this->inertiaLinkType($key, $value),
            ];
        }

        if (str_contains($value, 'href=') || str_contains($value, 'src=')) {
            if (preg_match_all('#(href|src)=\\\\?["\']([^"\']+)["\']#i', $value, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $attr = strtolower($match[1]);
                    $href = trim(stripslashes($match[2]));
                    if ($href === '' || str_starts_with($href, '#')) {
                        continue;
                    }
                    if (preg_match('#^(mailto:|tel:|fax:|javascript:|data:)#i', $href)) {
                        continue;
                    }

                    $links[] = [
                        'href' => $href,
                        'type' => $attr === 'src' ? 'image' : 'anchor',
                    ];
                }
            }
        }
    }

    private function inertiaLinkType(string $key, string $value): string
    {
        $key = strtolower($key);
        $path = strtolower(parse_url($value, PHP_URL_PATH) ?: $value);

        if (in_array($key, ['src', 'image', 'original_url', 'preview_url', 'thumbnail_url', 'media_url'], true)) {
            return 'image';
        }

        if (preg_match('#\.(jpe?g|png|gif|webp|svg|ico)$#i', $path)) {
            return 'image';
        }

        if (in_array($key, ['file', 'pdf', 'download'], true) || preg_match('#\.(pdf|docx?|pptx?|zip)$#i', $path)) {
            return 'attribute';
        }

        return 'anchor';
    }

    /**
     * @return array{ok: bool, status: int|string}
     */
    private function checkTarget(string $url, ?string $baseHost): array
    {
        // Fast path: local public files (PDFs, media-library, storage, etc.)
        if ($this->isSameHost($url, $baseHost)) {
            $local = $this->checkLocalPublicFile($url);
            if ($local !== null) {
                return $local;
            }
        }

        try {
            $response = Http::timeout(8)
                ->withHeaders(['User-Agent' => 'SAWTEE-LinkChecker/1.0'])
                ->withOptions(['allow_redirects' => true])
                ->head($url);

            $status = $response->status();

            // Some servers disallow HEAD.
            if (in_array($status, [405, 501], true)) {
                $response = Http::timeout(8)
                    ->withHeaders(['User-Agent' => 'SAWTEE-LinkChecker/1.0'])
                    ->withOptions(['allow_redirects' => true])
                    ->get($url);
                $status = $response->status();
            }

            return [
                'ok' => $status > 0 && $status < 400,
                'status' => $status,
            ];
        } catch (ConnectionException) {
            return ['ok' => false, 'status' => 'connection_error'];
        } catch (Throwable $e) {
            report($e);

            return ['ok' => false, 'status' => 'error'];
        }
    }

    /**
     * @return array{ok: bool, status: int|string}|null
     */
    private function checkLocalPublicFile(string $url): ?array
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (! is_string($path) || $path === '' || $path === '/') {
            return null;
        }

        $path = rawurldecode($path);

        // Only treat clear static asset paths as filesystem checks.
        $staticPrefixes = [
            '/publications/',
            '/Research_Reports/',
            '/Featured_Events/',
            '/media-library/',
            '/storage/',
            '/build/',
            '/css/',
            '/js/',
            '/images/',
            '/img/',
            '/fonts/',
            '/favicon',
            '/robots.txt',
            '/sitemap.xml',
        ];

        $isStatic = false;
        foreach ($staticPrefixes as $prefix) {
            if (str_starts_with($path, $prefix) || $path === $prefix) {
                $isStatic = true;
                break;
            }
        }

        if (! $isStatic && ! preg_match('#\.(pdf|jpe?g|png|gif|webp|svg|css|js|ico|woff2?|ttf|eot|mp4|webm|mp3|zip|docx?|pptx?)$#i', $path)) {
            return null;
        }

        if (str_starts_with($path, '/storage/')) {
            $relative = substr($path, strlen('/storage/'));
            $full = storage_path('app/public/'.$relative);

            return [
                'ok' => is_file($full),
                'status' => is_file($full) ? 200 : 404,
            ];
        }

        $full = public_path(ltrim($path, '/'));

        if (is_file($full)) {
            return ['ok' => true, 'status' => 200];
        }

        // Directories are not valid download targets for file links.
        if (is_dir($full)) {
            return ['ok' => false, 'status' => 404];
        }

        return ['ok' => false, 'status' => 404];
    }

    private function normalizeUrl(string $url, string $base): ?string
    {
        $url = trim($url);
        if ($url === '' || str_starts_with($url, '#')) {
            return null;
        }

        if (preg_match('#^(mailto:|tel:|fax:|javascript:|data:)#i', $url)) {
            return null;
        }

        // Protocol-relative
        if (str_starts_with($url, '//')) {
            $scheme = parse_url($base, PHP_URL_SCHEME) ?: 'https';
            $url = $scheme.':'.$url;
        }

        if (! preg_match('#^https?://#i', $url)) {
            $url = $this->resolveRelative($url, $base);
        }

        $parts = parse_url($url);
        if ($parts === false || empty($parts['host'])) {
            return null;
        }

        $scheme = $parts['scheme'] ?? 'https';
        $host = $parts['host'];
        $port = isset($parts['port']) ? ':'.$parts['port'] : '';
        $path = $parts['path'] ?? '/';
        // Drop fragments; keep query (may matter for pages).
        $query = isset($parts['query']) ? '?'.$parts['query'] : '';

        // Normalize trailing slash for directories-looking paths without extension.
        if ($path !== '/' && ! str_contains(basename($path), '.') && str_ends_with($path, '/')) {
            $path = rtrim($path, '/');
        }

        return strtolower($scheme).'://'.$host.$port.$path.$query;
    }

    private function resolveRelative(string $relative, string $base): string
    {
        if (str_starts_with($relative, '/')) {
            $origin = parse_url($base);
            $scheme = $origin['scheme'] ?? 'https';
            $host = $origin['host'] ?? '';
            $port = isset($origin['port']) ? ':'.$origin['port'] : '';

            return $scheme.'://'.$host.$port.$relative;
        }

        $basePath = parse_url($base, PHP_URL_PATH) ?: '/';
        if (! str_ends_with($basePath, '/')) {
            $basePath = dirname($basePath);
            if ($basePath === '\\' || $basePath === '.') {
                $basePath = '/';
            }
            $basePath = rtrim($basePath, '/').'/';
        }

        $origin = parse_url($base);
        $scheme = $origin['scheme'] ?? 'https';
        $host = $origin['host'] ?? '';
        $port = isset($origin['port']) ? ':'.$origin['port'] : '';

        $absolutePath = $this->collapsePath($basePath.$relative);

        return $scheme.'://'.$host.$port.$absolutePath;
    }

    private function collapsePath(string $path): string
    {
        $segments = [];
        foreach (explode('/', $path) as $segment) {
            if ($segment === '' || $segment === '.') {
                continue;
            }
            if ($segment === '..') {
                array_pop($segments);

                continue;
            }
            $segments[] = $segment;
        }

        return '/'.implode('/', $segments);
    }

    private function isSameHost(string $url, ?string $baseHost): bool
    {
        if ($baseHost === null || $baseHost === '') {
            return false;
        }

        $host = parse_url($url, PHP_URL_HOST);

        return is_string($host) && strcasecmp($host, $baseHost) === 0;
    }

    private function isAdminPath(string $url): bool
    {
        $path = parse_url($url, PHP_URL_PATH) ?: '/';

        return Str::startsWith($path, '/admin');
    }

    private function looksLikeHtmlPath(string $url): bool
    {
        $path = parse_url($url, PHP_URL_PATH) ?: '/';

        if ($path === '/' || ! str_contains(basename($path), '.')) {
            return true;
        }

        return (bool) preg_match('#\.(html?|php)$#i', $path);
    }
}
