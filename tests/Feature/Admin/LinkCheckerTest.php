<?php

use App\Models\Page;
use App\Models\User;
use App\Support\LinkChecker;
use App\Support\SitemapCache;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Cache::forget(LinkChecker::CACHE_KEY);
    Cache::forget(SitemapCache::KEY);

    $this->actingAs(User::factory()->create([
        'email_verified_at' => now(),
    ]));
});

test('link checker detects missing local publication files from crawled html', function () {
    config(['app.url' => 'http://sawtee.test']);

    $missing = 'missing-publication-'.uniqid().'.pdf';

    Http::fake([
        'http://sawtee.test' => Http::response(
            '<html><body><a href="/publications/'.$missing.'">PDF</a><a href="/about">About</a></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/' => Http::response(
            '<html><body><a href="/publications/'.$missing.'">PDF</a><a href="/about">About</a></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/about' => Http::response(
            '<html><body><p>About</p></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
    ]);

    $report = app(LinkChecker::class)->crawl(
        baseUrl: 'http://sawtee.test',
        maxPages: 10,
        maxLinks: 50,
    );

    $brokenUrls = array_column($report['broken'], 'url');

    expect($report['pages_crawled'])->toBeGreaterThan(0)
        ->and($brokenUrls)->toContain('http://sawtee.test/publications/'.$missing);
});

test('link checker skips admin paths', function () {
    config(['app.url' => 'http://sawtee.test']);

    Http::fake([
        'http://sawtee.test' => Http::response(
            '<html><body><a href="/admin/dashboard">Admin</a><a href="/ok">OK</a></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/' => Http::response(
            '<html><body><a href="/admin/dashboard">Admin</a><a href="/ok">OK</a></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/ok' => Http::response(
            '<html><body>OK</body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/admin/*' => Http::response('should not crawl', 200),
    ]);

    $report = app(LinkChecker::class)->crawl(
        baseUrl: 'http://sawtee.test',
        maxPages: 10,
        maxLinks: 50,
    );

    $brokenUrls = array_column($report['broken'], 'url');
    $sources = array_column($report['broken'], 'source');

    expect($brokenUrls)->not->toContain('http://sawtee.test/admin/dashboard')
        ->and(collect($sources)->contains(fn ($s) => str_contains((string) $s, '/admin')))->toBeFalse();
});

test('link checker treats existing publication files as ok', function () {
    config(['app.url' => 'http://sawtee.test']);

    File::ensureDirectoryExists(public_path('publications'));
    $name = 'link-checker-ok-'.uniqid().'.pdf';
    $path = public_path('publications/'.$name);
    File::put($path, 'pdf');

    Http::fake([
        'http://sawtee.test' => Http::response(
            '<html><body><a href="/publications/'.$name.'">PDF</a></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/' => Http::response(
            '<html><body><a href="/publications/'.$name.'">PDF</a></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
    ]);

    $report = app(LinkChecker::class)->crawl(
        baseUrl: 'http://sawtee.test',
        maxPages: 5,
        maxLinks: 20,
    );

    File::delete($path);

    $brokenUrls = array_column($report['broken'], 'url');

    expect($brokenUrls)->not->toContain('http://sawtee.test/publications/'.$name)
        ->and($report['ok'])->toBeGreaterThan(0);
});

test('admin link checker page is gated and scan stores a report', function () {
    config(['app.url' => 'http://sawtee.test']);

    Http::fake([
        'http://sawtee.test' => Http::response('<html><body>Home</body></html>', 200, ['Content-Type' => 'text/html']),
        'http://sawtee.test/' => Http::response('<html><body>Home</body></html>', 200, ['Content-Type' => 'text/html']),
    ]);

    $this->get(route('admin.link-checker.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Backend/LinkChecker/Index')
            ->where('report', null)
        );

    $this->from(route('admin.link-checker.index'))
        ->post(route('admin.link-checker.scan'), [
            'max_pages' => 5,
            'max_links' => 20,
            'check_external' => false,
        ])
        ->assertRedirect(route('admin.link-checker.index'))
        ->assertInertiaFlash('success');

    $this->get(route('admin.link-checker.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Backend/LinkChecker/Index')
            ->has('report.pagesCrawled')
            ->has('report.brokenCount')
        );
});

test('guests cannot access link checker', function () {
    auth()->logout();

    $this->get(route('admin.link-checker.index'))->assertRedirect();
    $this->post(route('admin.link-checker.scan'))->assertRedirect();
});

test('link checker seeds crawl queue from sitemap beyond the home page', function () {
    config(['app.url' => 'http://sawtee.test']);

    Page::query()->create([
        'name' => 'About',
        'slug' => 'about',
        'content' => '<p>About</p>',
    ]);

    $homeHtml = '<html><body><div id="app"></div></body></html>';
    $aboutHtml = '<html><body><a href="/publications/missing-from-about.pdf">PDF</a></body></html>';

    Http::fake([
        'http://sawtee.test' => Http::response($homeHtml, 200, ['Content-Type' => 'text/html']),
        'http://sawtee.test/' => Http::response($homeHtml, 200, ['Content-Type' => 'text/html']),
        'http://sawtee.test/about' => Http::response($aboutHtml, 200, ['Content-Type' => 'text/html']),
    ]);

    $report = app(LinkChecker::class)->crawl(
        baseUrl: 'http://sawtee.test',
        maxPages: 10,
        maxLinks: 50,
    );

    $brokenUrls = array_column($report['broken'], 'url');

    expect($report['pages_crawled'])->toBeGreaterThanOrEqual(2)
        ->and($brokenUrls)->toContain('http://sawtee.test/publications/missing-from-about.pdf');
});

test('link checker extracts menu and content urls from inertia page json', function () {
    config(['app.url' => 'http://sawtee.test']);

    $missing = 'inertia-missing-'.uniqid().'.pdf';
    $pagePayload = json_encode([
        'component' => 'Frontend/Pages/Home',
        'props' => [
            'primaryMenu' => [
                ['title' => 'About', 'url' => '/about'],
            ],
            'body' => '<p><a href="/publications/'.$missing.'">PDF</a></p>',
            'ziggy' => [
                'url' => 'http://sawtee.test',
                'routes' => [
                    'admin.dashboard' => ['uri' => 'admin/dashboard'],
                ],
            ],
        ],
    ], JSON_THROW_ON_ERROR);

    $homeHtml = '<html><body><div id="app"></div>'
        .'<script data-page="app" type="application/json">'.$pagePayload.'</script>'
        .'</body></html>';

    Http::fake([
        'http://sawtee.test' => Http::response($homeHtml, 200, ['Content-Type' => 'text/html']),
        'http://sawtee.test/' => Http::response($homeHtml, 200, ['Content-Type' => 'text/html']),
        'http://sawtee.test/about' => Http::response(
            '<html><body><p>About</p></body></html>',
            200,
            ['Content-Type' => 'text/html']
        ),
        'http://sawtee.test/admin/*' => Http::response('should not crawl', 200),
    ]);

    $report = app(LinkChecker::class)->crawl(
        baseUrl: 'http://sawtee.test',
        maxPages: 10,
        maxLinks: 50,
    );

    $brokenUrls = array_column($report['broken'], 'url');
    $checkedSources = array_column($report['broken'], 'source');

    expect($report['pages_crawled'])->toBeGreaterThanOrEqual(2)
        ->and($brokenUrls)->toContain('http://sawtee.test/publications/'.$missing)
        ->and($brokenUrls)->not->toContain('http://sawtee.test/admin/dashboard')
        ->and(collect($checkedSources)->contains(fn ($s) => str_contains((string) $s, '/admin')))->toBeFalse();
});
