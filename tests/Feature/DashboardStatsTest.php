<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Carbon::setTestNow(Carbon::parse('2026-08-15 12:00:00'));
});

afterEach(function () {
    Carbon::setTestNow();
});

function createPostCategory(): Category
{
    return Category::query()->create([
        'name' => 'News',
        'slug' => 'news-'.uniqid(),
        'type' => 'post',
        'parent_id' => null,
    ]);
}

function createPostAt(Category $category, Carbon $createdAt): Post
{
    $post = Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
    ]);

    $post->forceFill([
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ])->saveQuietly();

    return $post->refresh();
}

test('dashboard returns correct month-over-month percent and direction for posts', function () {
    $category = createPostCategory();
    $user = User::factory()->create();

    // This month (August 2026): 4 posts
    foreach (range(1, 4) as $day) {
        createPostAt($category, Carbon::parse("2026-08-0{$day} 10:00:00"));
    }

    // Last month (July 2026): 2 posts
    createPostAt($category, Carbon::parse('2026-07-05 10:00:00'));
    createPostAt($category, Carbon::parse('2026-07-20 10:00:00'));

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Backend/Dashboard')
            ->where('postsThisMonth', 4)
            ->where('postsLastMonth', 2)
            ->where('postsIncreasePercent', 100)
            ->where('postsTrend', 'up')
        );
});

test('dashboard reports decrease when fewer posts than last month', function () {
    $category = createPostCategory();
    $user = User::factory()->create();

    createPostAt($category, Carbon::parse('2026-08-01 10:00:00'));
    createPostAt($category, Carbon::parse('2026-07-05 10:00:00'));
    createPostAt($category, Carbon::parse('2026-07-20 10:00:00'));

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('postsThisMonth', 1)
            ->where('postsLastMonth', 2)
            ->where('postsIncreasePercent', -50)
            ->where('postsTrend', 'down')
        );
});

test('dashboard is neutral when this month equals last month', function () {
    $category = createPostCategory();
    $user = User::factory()->create();

    createPostAt($category, Carbon::parse('2026-08-01 10:00:00'));
    createPostAt($category, Carbon::parse('2026-07-05 10:00:00'));

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('postsThisMonth', 1)
            ->where('postsLastMonth', 1)
            ->where('postsIncreasePercent', 0)
            ->where('postsTrend', 'neutral')
        );
});

test('dashboard treats last month zero with current posts as up', function () {
    $category = createPostCategory();
    $user = User::factory()->create();

    createPostAt($category, Carbon::parse('2026-08-01 10:00:00'));
    createPostAt($category, Carbon::parse('2026-08-02 10:00:00'));

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('postsThisMonth', 2)
            ->where('postsLastMonth', 0)
            ->where('postsIncreasePercent', 100)
            ->where('postsTrend', 'up')
        );
});

test('dashboard counts last month correctly across year boundary', function () {
    Carbon::setTestNow(Carbon::parse('2026-01-15 12:00:00'));

    $category = createPostCategory();
    $user = User::factory()->create();

    createPostAt($category, Carbon::parse('2026-01-05 10:00:00'));
    createPostAt($category, Carbon::parse('2025-12-10 10:00:00'));
    createPostAt($category, Carbon::parse('2025-12-20 10:00:00'));

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('postsThisMonth', 1)
            ->where('postsLastMonth', 2)
            ->where('postsIncreasePercent', -50)
            ->where('postsTrend', 'down')
        );
});
