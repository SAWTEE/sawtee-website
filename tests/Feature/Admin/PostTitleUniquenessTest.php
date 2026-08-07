<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());

    $this->category = Category::query()->create([
        'name' => 'Opinion',
        'type' => 'post',
    ]);

    $this->otherCategory = Category::query()->create([
        'name' => 'News',
        'type' => 'post',
    ]);
});

test('updating a post keeps its own title', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'My unique post title',
        'status' => 'draft',
    ]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => 'My unique post title',
        'category_id' => $this->category->id,
        'status' => 'draft',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    expect($post->fresh()->title)->toBe('My unique post title');
});

test('updating a post rejects another live post title in the same category', function () {
    Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Taken title',
    ]);

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Own title',
        'status' => 'draft',
    ]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => 'Taken title',
        'category_id' => $this->category->id,
        'status' => 'draft',
    ])->assertSessionHasErrors([
        'title' => 'A post with this title already exists in this category.',
    ]);

    expect($post->fresh()->title)->toBe('Own title');
});

test('updating a post allows the same title in a different category', function () {
    Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Shared title',
    ]);

    $post = Post::factory()->create([
        'category_id' => $this->otherCategory->id,
        'theme_id' => null,
        'title' => 'Own title',
        'status' => 'draft',
    ]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => 'Shared title',
        'category_id' => $this->otherCategory->id,
        'status' => 'draft',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    expect($post->fresh()->title)->toBe('Shared title');
});

test('creating a post may reuse a soft-deleted post title', function () {
    $trashed = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Reusable trashed title',
    ]);
    $trashed->delete();

    $this->post(route('admin.posts.store'), [
        'title' => 'Reusable trashed title',
        'category_id' => $this->category->id,
        'status' => 'published',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    expect(Post::query()->where('title', 'Reusable trashed title')->count())->toBe(1)
        ->and(Post::onlyTrashed()->where('title', 'Reusable trashed title')->count())->toBe(1);
});

test('creating a post rejects a live post title in the same category', function () {
    Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Existing live title',
    ]);

    $this->post(route('admin.posts.store'), [
        'title' => 'Existing live title',
        'category_id' => $this->category->id,
        'status' => 'published',
    ])->assertSessionHasErrors([
        'title' => 'A post with this title already exists in this category.',
    ]);
});

test('creating a post allows the same title in a different category', function () {
    Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Shared across categories',
    ]);

    $this->post(route('admin.posts.store'), [
        'title' => 'Shared across categories',
        'category_id' => $this->otherCategory->id,
        'status' => 'published',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    expect(Post::query()->where('title', 'Shared across categories')->count())->toBe(2);
});
