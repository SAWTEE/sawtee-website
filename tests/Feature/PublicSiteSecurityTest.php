<?php

use App\Http\Middleware\PreventRequestForgery;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    RateLimiter::clear('search:'.request()->ip());
    RateLimiter::clear('public:'.request()->ip());
});

test('search strips html and control characters from query params', function () {
    $category = Category::query()->create([
        'name' => 'Commentary',
        'slug' => 'commentary',
        'type' => 'post',
    ]);

    Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'title' => 'Trade policy brief',
        'excerpt' => 'Regional trade news',
        'published_at' => '2024-06-15 00:00:00',
    ]);

    $this->get('/search?category=commentary&page=1&query='.urlencode('<script>alert(1)</script>trade'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('query', 'alert(1)trade')
            ->where('filters.category', 'commentary')
            ->where('seo.title', 'Search: alert(1)trade')
        );
});

test('search ignores malformed filter query parameters', function () {
    $this->get('/search?query=trade&category=../etc/passwd&year=not-a-year&theme[]=1&page=abc')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('query', 'trade')
            ->where('filters.category', 'etcpasswd')
            ->where('filters.year', null)
            ->where('filters.theme', null)
        );
});

test('search truncates oversized query strings', function () {
    $long = str_repeat('a', 250);

    $this->get('/search?query='.$long)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('query', str_repeat('a', 200))
        );
});

test('public category routes reject unsafe slug characters', function () {
    $this->get('/category/in-focus<script>')
        ->assertNotFound();

    $this->get('/category/../../etc/passwd')
        ->assertNotFound();
});

test('search pagination links use sanitized query params only', function () {
    $this->get('/search?query='.urlencode('<script>alert(1)</script>trade').'&page=1')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('query', 'alert(1)trade')
            ->where('posts.first_page_url', function (string $url) {
                return ! str_contains(urldecode($url), '<script>')
                    && str_contains($url, 'query=alert%281%29trade');
            })
        );
});

test('search endpoint is rate limited', function () {
    RateLimiter::for('search', function () {
        return Limit::perMinute(1);
    });

    $this->get('/search?query=trade')->assertOk();
    $this->get('/search?query=trade')->assertStatus(429);
});

test('public responses include browser security headers', function () {
    $this->get('/')
        ->assertOk()
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
        ->assertHeaderMissing('X-Powered-By');

    $csp = $this->get('/')->headers->get('Content-Security-Policy');

    expect($csp)->toContain("frame-ancestors 'self'")
        ->and($csp)->toContain("frame-src 'self' https:")
        ->and($csp)->toContain("object-src 'none'")
        ->and($csp)->toContain("default-src 'self'")
        ->and($csp)->not->toContain('sawtee.test:5173');
});

test('local vite hot file is allowlisted in content security policy', function () {
    app()->detectEnvironment(fn () => 'local');
    file_put_contents(public_path('hot'), "https://sawtee.test:5173\n");

    try {
        $csp = $this->get('/')->headers->get('Content-Security-Policy');

        expect($csp)->toContain('https://sawtee.test:5173')
            ->and($csp)->toContain('wss://sawtee.test:5173')
            ->and($csp)->toContain("'unsafe-eval'");
    } finally {
        @unlink(public_path('hot'));
    }
});

test('public pages do not expose admin ziggy routes', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('ziggy.routes.home')
            ->has('ziggy.routes.search')
            ->missing('ziggy.routes.admin.dashboard')
            ->missing('ziggy.routes.admin.posts.destroy')
            ->missing('ziggy.routes.boost.browser-logs')
            ->missing('ziggy.routes.ignition.executeSolution')
        );
});

test('csrf middleware only excludes media uploads', function () {
    $middleware = new PreventRequestForgery(app(), app('encrypter'));
    $except = (new ReflectionClass($middleware))->getProperty('except');

    expect($except->getValue($middleware))->toBe(['/admin/post/uploadmedia']);
});

test('login rejects invalid csrf token without authenticating', function () {
    $this->app->bind(
        PreventRequestForgery::class,
        fn ($app) => new class($app, $app['encrypter']) extends PreventRequestForgery
        {
            protected function runningUnitTests(): bool
            {
                return false;
            }
        }
    );

    $user = User::factory()->create();

    $this->from(route('login'))
        ->withSession(['_token' => 'expected-csrf-token'])
        ->post('/admin/login', [
            '_token' => 'attacker-csrf-token',
            'email' => $user->email,
            'password' => 'password',
        ])
        ->assertRedirect(route('login'));

    $this->assertGuest();
    expect(session('message'))->toBe('Your session expired. Please reload the page and try again.');
});

test('debug endpoints are blocked outside local', function () {
    app()->detectEnvironment(fn () => 'production');

    $this->postJson('/_boost/browser-logs', ['logs' => []])
        ->assertNotFound();

    $this->get('/_ignition/health-check')
        ->assertNotFound();
});
