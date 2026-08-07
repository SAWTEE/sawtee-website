<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->category = Category::query()->create([
        'name' => 'Opinion',
        'type' => 'post',
    ]);
});

test('guests cannot view the posts index', function () {
    $this->get(route('admin.posts.index'))
        ->assertRedirect(route('login'));
});

test('guests cannot batch delete posts', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);

    $this->delete(route('admin.posts.batch-destroy'), [
        'ids' => [$post->id],
    ])->assertRedirect(route('login'));

    $this->assertModelExists($post);
});

test('guests cannot delete a post', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);

    $this->delete(route('admin.posts.destroy', $post))
        ->assertRedirect(route('login'));

    $this->assertModelExists($post);
});

test('posts index lists draft unpublished and published posts', function () {
    $this->actingAs(User::factory()->create());

    $published = Post::factory()->published()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Published post',
    ]);
    $draft = Post::factory()->draft()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Draft post',
    ]);
    $unpublished = Post::factory()->unpublished()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Unpublished post',
    ]);

    $this->get(route('admin.posts.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Backend/Post/Index')
            ->has('posts', 3)
            ->where('posts', fn ($posts) => collect($posts)->pluck('id')->sort()->values()->all()
                === collect([$published->id, $draft->id, $unpublished->id])->sort()->values()->all())
        );
});

test('soft deleted posts are excluded from the posts index', function () {
    $this->actingAs(User::factory()->create());

    $active = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Active post',
    ]);
    $trashed = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Trashed post',
    ]);
    $trashed->delete();

    $this->assertSoftDeleted($trashed);

    $this->get(route('admin.posts.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Backend/Post/Index')
            ->has('posts', 1)
            ->where('posts.0.id', $active->id)
        );
});

test('authenticated users can soft delete a post', function () {
    $this->actingAs(User::factory()->create());

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);

    $this->delete(route('admin.posts.destroy', $post))
        ->assertRedirect(route('admin.posts.index'));

    $this->assertSoftDeleted($post);
});

test('authenticated users can batch soft delete selected posts', function () {
    $this->actingAs(User::factory()->create());

    $keep = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Keep me',
    ]);
    $first = Post::factory()->draft()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Delete me first',
    ]);
    $second = Post::factory()->unpublished()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Delete me second',
    ]);

    $this->delete(route('admin.posts.batch-destroy'), [
        'ids' => [$first->id, $second->id],
    ])->assertRedirect(route('admin.posts.index'));

    $this->assertSoftDeleted($first);
    $this->assertSoftDeleted($second);
    $this->assertModelExists($keep);
    expect($keep->fresh()->trashed())->toBeFalse();
});

test('batch destroy requires at least one valid post id', function () {
    $this->actingAs(User::factory()->create());

    $this->from(route('admin.posts.index'))
        ->delete(route('admin.posts.batch-destroy'), [
            'ids' => [],
        ])
        ->assertSessionHasErrors('ids');
});

test('a soft deleted post title can be reused', function () {
    $this->actingAs(User::factory()->create());

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Reusable title',
    ]);
    $post->delete();

    $this->post(route('admin.posts.store'), [
        'title' => 'Reusable title',
        'category_id' => $this->category->id,
        'status' => 'draft',
        'content' => 'New content',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.posts.index'));

    expect(Post::query()->where('title', 'Reusable title')->exists())->toBeTrue();
});
