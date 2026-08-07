<?php

use App\Models\Category;
use App\Models\File;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

beforeEach(function () {
    $this->category = Category::query()->create([
        'name' => 'Opinion',
        'type' => 'post',
    ]);
});

test('guests cannot view the posts trash', function () {
    $this->get(route('admin.posts.trash'))
        ->assertRedirect(route('login'));
});

test('guests cannot restore a trashed post', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);
    $post->delete();

    $this->post(route('admin.posts.restore', $post))
        ->assertRedirect(route('login'));

    expect($post->fresh()->trashed())->toBeTrue();
});

test('guests cannot force delete a trashed post', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);
    $post->delete();

    $this->delete(route('admin.posts.force-destroy', $post))
        ->assertRedirect(route('login'));

    $this->assertSoftDeleted($post);
});

test('trash lists only soft deleted posts', function () {
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

    $this->get(route('admin.posts.trash'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Backend/Post/Trash')
            ->has('posts', 1)
            ->where('posts.0.id', $trashed->id)
            ->where('posts.0.title', 'Trashed post')
            ->where('posts', fn ($posts) => collect($posts)->pluck('id')->doesntContain($active->id))
        );
});

test('authenticated users can restore a trashed post', function () {
    $this->actingAs(User::factory()->create());

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Restorable post',
    ]);
    $post->delete();

    $this->post(route('admin.posts.restore', $post))
        ->assertRedirect(route('admin.posts.trash'));

    expect($post->fresh()->trashed())->toBeFalse();

    $this->get(route('admin.posts.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Backend/Post/Index')
            ->where('posts', fn ($posts) => collect($posts)->pluck('id')->contains($post->id))
        );
});

test('authenticated users can batch restore trashed posts', function () {
    $this->actingAs(User::factory()->create());

    $first = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Restore first',
    ]);
    $second = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Restore second',
    ]);
    $first->delete();
    $second->delete();

    $this->post(route('admin.posts.batch-restore'), [
        'ids' => [$first->id, $second->id],
    ])->assertRedirect(route('admin.posts.trash'));

    expect($first->fresh()->trashed())->toBeFalse();
    expect($second->fresh()->trashed())->toBeFalse();
});

test('authenticated users can force delete a trashed post', function () {
    $this->actingAs(User::factory()->create());

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Gone forever',
    ]);
    $postId = $post->id;
    $post->delete();

    $this->delete(route('admin.posts.force-destroy', $post))
        ->assertRedirect(route('admin.posts.trash'));

    expect(Post::withTrashed()->find($postId))->toBeNull();
});

test('force delete removes associated media and content files', function () {
    Storage::fake('public');

    $this->actingAs(User::factory()->create());

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);

    $post->addMedia(UploadedFile::fake()->image('featured.jpg', 400, 300))
        ->toMediaCollection('post-featured-image');

    $mediaId = $post->getFirstMedia('post-featured-image')?->id;
    expect($mediaId)->not->toBeNull();

    $contentPath = storage_path('app/tmp-post-content-'.uniqid('', true).'.pdf');
    file_put_contents($contentPath, 'fake-pdf-content');

    $contentFile = new File([
        'name' => 'content.pdf',
        'path' => $contentPath,
    ]);
    $post->postContentFiles()->save($contentFile);
    $contentFileId = $contentFile->id;

    $post->delete();

    $this->assertSoftDeleted($post);
    expect(Media::query()->find($mediaId))->not->toBeNull();
    expect(File::query()->find($contentFileId))->not->toBeNull();
    expect(is_file($contentPath))->toBeTrue();

    $this->delete(route('admin.posts.force-destroy', $post))
        ->assertRedirect(route('admin.posts.trash'));

    expect(Post::withTrashed()->find($post->id))->toBeNull();
    expect(Media::query()->find($mediaId))->toBeNull();
    expect(File::query()->find($contentFileId))->toBeNull();
    expect(is_file($contentPath))->toBeFalse();
});

test('authenticated users can batch force delete trashed posts', function () {
    $this->actingAs(User::factory()->create());

    $first = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Force first',
    ]);
    $second = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Force second',
    ]);
    $firstId = $first->id;
    $secondId = $second->id;
    $first->delete();
    $second->delete();

    $this->delete(route('admin.posts.batch-force-destroy'), [
        'ids' => [$firstId, $secondId],
    ])->assertRedirect(route('admin.posts.trash'));

    expect(Post::withTrashed()->find($firstId))->toBeNull();
    expect(Post::withTrashed()->find($secondId))->toBeNull();
});

test('batch restore requires at least one trashed post id', function () {
    $this->actingAs(User::factory()->create());

    $this->from(route('admin.posts.trash'))
        ->post(route('admin.posts.batch-restore'), [
            'ids' => [],
        ])
        ->assertSessionHasErrors('ids');
});

test('batch force destroy requires at least one trashed post id', function () {
    $this->actingAs(User::factory()->create());

    $this->from(route('admin.posts.trash'))
        ->delete(route('admin.posts.batch-force-destroy'), [
            'ids' => [],
        ])
        ->assertSessionHasErrors('ids');
});

test('restore and force delete reject non trashed posts', function () {
    $this->actingAs(User::factory()->create());

    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
    ]);

    $this->post(route('admin.posts.restore', $post))->assertNotFound();
    $this->delete(route('admin.posts.force-destroy', $post))->assertNotFound();

    $this->assertModelExists($post);
});
