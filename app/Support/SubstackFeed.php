<?php

namespace App\Support;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class SubstackFeed
{
    public const CACHE_TTL_SECONDS = 1800;

    /**
     * @return list<array{
     *     id: int|string,
     *     title: string,
     *     subtitle: string|null,
     *     url: string,
     *     published_at: string|null,
     *     cover_image: string|null,
     *     reaction_count: int
     * }>
     */
    public function recent(int $limit = 6): array
    {
        $limit = max(1, min($limit, 20));
        $cacheKey = 'substack.feed.v1.'.$limit;

        /** @var list<array{id: int|string, title: string, subtitle: string|null, url: string, published_at: string|null, cover_image: string|null, reaction_count: int}>|null $cached */
        $cached = Cache::get($cacheKey);

        // Only reuse a non-empty cached feed. Empty arrays can linger from
        // earlier failed/empty responses and would hide the sidebar widget.
        if (is_array($cached) && $cached !== []) {
            return $cached;
        }

        $posts = $this->fetchRecent($limit);

        if ($posts === null || $posts === []) {
            return [];
        }

        Cache::put($cacheKey, $posts, self::CACHE_TTL_SECONDS);

        return $posts;
    }

    /**
     * @return list<array{
     *     id: int|string,
     *     title: string,
     *     subtitle: string|null,
     *     url: string,
     *     published_at: string|null,
     *     cover_image: string|null,
     *     reaction_count: int
     * }>|null
     */
    protected function fetchRecent(int $limit): ?array
    {
        $publicationUrl = rtrim((string) config('services.substack.publication_url', 'https://sawteenp.substack.com'), '/');
        $archiveUrl = (string) (config('services.substack.archive_url') ?: "{$publicationUrl}/api/v1/archive");

        if ($archiveUrl === '') {
            return [];
        }

        try {
            $response = Http::timeout(5)
                ->connectTimeout(3)
                ->acceptJson()
                ->retry(2, 150, function (Throwable $exception) {
                    return $exception instanceof ConnectionException;
                })
                ->get($archiveUrl, [
                    'sort' => 'new',
                    'limit' => $limit,
                    'offset' => 0,
                ]);
        } catch (Throwable) {
            return null;
        }

        if (! $response->successful()) {
            return null;
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            return null;
        }

        return collect($payload)
            ->filter(fn ($post) => is_array($post) && filled($post['title'] ?? null))
            ->take($limit)
            ->map(function (array $post) use ($publicationUrl) {
                $slug = (string) ($post['slug'] ?? '');
                $canonical = (string) ($post['canonical_url'] ?? '');

                return [
                    'id' => $post['id'] ?? $slug,
                    'title' => (string) $post['title'],
                    'subtitle' => filled($post['subtitle'] ?? null)
                        ? (string) $post['subtitle']
                        : (filled($post['description'] ?? null) ? (string) $post['description'] : null),
                    'url' => $canonical !== ''
                        ? $canonical
                        : ($slug !== '' ? "{$publicationUrl}/p/{$slug}" : $publicationUrl),
                    'published_at' => filled($post['post_date'] ?? null) ? (string) $post['post_date'] : null,
                    'cover_image' => filled($post['cover_image'] ?? null) ? (string) $post['cover_image'] : null,
                    'reaction_count' => (int) ($post['reaction_count'] ?? 0),
                ];
            })
            ->values()
            ->all();
    }
}
