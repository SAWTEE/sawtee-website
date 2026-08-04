<?php

use App\Models\PageView;
use App\Models\User;
use App\Support\Analytics;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Carbon::setTestNow(Carbon::parse('2026-08-15 12:00:00'));
    config([
        'analytics.enabled' => true,
        'analytics.dedupe_minutes' => 30,
        'analytics.hash_salt' => 'test-salt',
    ]);
});

afterEach(function () {
    Carbon::setTestNow();
});

test('public page view is recorded with hashed ip and user agent', function () {
    $this->get('/')
        ->assertOk();

    expect(PageView::query()->count())->toBe(1);

    $view = PageView::query()->first();

    expect($view->path)->toBe('/')
        ->and($view->ip_hash)->not->toBeNull()
        ->and($view->ip_hash)->not->toBe('127.0.0.1')
        ->and($view->user_agent_hash)->not->toBeNull()
        ->and(strlen($view->ip_hash))->toBe(64);
});

test('duplicate page views from the same session are deduped', function () {
    $this->get('/')->assertOk();
    $this->get('/')->assertOk();

    expect(PageView::query()->count())->toBe(1);
});

test('admin routes are not recorded as page views', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk();

    expect(PageView::query()->count())->toBe(0);
});

test('analytics dashboard summary aggregates views and top pages', function () {
    PageView::query()->create([
        'path' => '/',
        'ip_hash' => hash('sha256', 'a'),
        'user_agent_hash' => hash('sha256', 'ua'),
        'created_at' => Carbon::parse('2026-08-15 09:00:00'),
    ]);
    PageView::query()->create([
        'path' => '/',
        'ip_hash' => hash('sha256', 'b'),
        'user_agent_hash' => hash('sha256', 'ua'),
        'created_at' => Carbon::parse('2026-08-14 09:00:00'),
    ]);
    PageView::query()->create([
        'path' => '/about',
        'ip_hash' => hash('sha256', 'c'),
        'user_agent_hash' => hash('sha256', 'ua'),
        'created_at' => Carbon::parse('2026-08-10 09:00:00'),
    ]);
    PageView::query()->create([
        'path' => '/about',
        'ip_hash' => hash('sha256', 'd'),
        'user_agent_hash' => hash('sha256', 'ua'),
        'created_at' => Carbon::parse('2026-07-01 09:00:00'),
    ]);

    $summary = Analytics::dashboardSummary();

    expect($summary['views_today'])->toBe(1)
        ->and($summary['views_this_week'])->toBe(3)
        ->and($summary['views_this_month'])->toBe(3)
        ->and($summary['top_pages'])->toHaveCount(2)
        ->and($summary['top_pages'][0]['path'])->toBe('/')
        ->and($summary['top_pages'][0]['views'])->toBe(2)
        ->and($summary['top_pages'][1]['path'])->toBe('/about')
        ->and($summary['top_pages'][1]['views'])->toBe(1);
});

test('dashboard page includes analytics summary props', function () {
    $user = User::factory()->create();

    PageView::query()->create([
        'path' => '/',
        'ip_hash' => hash('sha256', 'a'),
        'user_agent_hash' => hash('sha256', 'ua'),
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Backend/Dashboard')
            ->has('analytics.views_today')
            ->has('analytics.views_this_week')
            ->has('analytics.views_this_month')
            ->has('analytics.top_pages')
            ->where('analytics.views_today', 1)
        );
});

test('recording is skipped when analytics is disabled', function () {
    config(['analytics.enabled' => false]);

    $this->get('/')->assertOk();

    expect(PageView::query()->count())->toBe(0);
});
