<?php

use App\Models\Category;
use App\Models\File;
use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());

    $this->category = Category::query()->create([
        'name' => 'Events',
        'type' => 'post',
    ]);
});

test('updating a post can remove a single content file without deleting siblings', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Post with content files',
        'status' => 'draft',
    ]);

    $keepPath = storage_path('app/tmp-keep-'.uniqid('', true).'.pdf');
    $removePath = storage_path('app/tmp-remove-'.uniqid('', true).'.pdf');
    file_put_contents($keepPath, 'keep');
    file_put_contents($removePath, 'remove');

    $keep = new File(['name' => 'keep.pdf', 'path' => $keepPath]);
    $remove = new File(['name' => 'remove.pdf', 'path' => $removePath]);
    $post->postContentFiles()->saveMany([$keep, $remove]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => $post->title,
        'category_id' => $this->category->id,
        'status' => 'draft',
        'remove_content_file_ids' => [$remove->id],
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    $post->refresh()->load('postContentFiles');

    expect($post->postContentFiles)->toHaveCount(1)
        ->and($post->postContentFiles->first()->id)->toBe($keep->id)
        ->and(File::query()->find($remove->id))->toBeNull()
        ->and(is_file($keepPath))->toBeTrue()
        ->and(is_file($removePath))->toBeFalse();
});

test('clearing files deletes all content files for the post', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Post to clear files',
        'status' => 'draft',
    ]);

    $firstPath = storage_path('app/tmp-clear-a-'.uniqid('', true).'.pdf');
    $secondPath = storage_path('app/tmp-clear-b-'.uniqid('', true).'.pdf');
    file_put_contents($firstPath, 'a');
    file_put_contents($secondPath, 'b');

    $first = new File(['name' => 'a.pdf', 'path' => $firstPath]);
    $second = new File(['name' => 'b.pdf', 'path' => $secondPath]);
    $post->postContentFiles()->saveMany([$first, $second]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => $post->title,
        'category_id' => $this->category->id,
        'status' => 'draft',
        'files' => '',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    $post->refresh()->load('postContentFiles');

    expect($post->postContentFiles)->toHaveCount(0)
        ->and(File::query()->find($first->id))->toBeNull()
        ->and(File::query()->find($second->id))->toBeNull();
});

test('updating a post without file fields leaves content files untouched', function () {
    $post = Post::factory()->create([
        'category_id' => $this->category->id,
        'theme_id' => null,
        'title' => 'Untouched content files',
        'status' => 'draft',
    ]);

    $path = storage_path('app/tmp-untouched-'.uniqid('', true).'.pdf');
    file_put_contents($path, 'untouched');

    $file = new File(['name' => 'untouched.pdf', 'path' => $path]);
    $post->postContentFiles()->save($file);

    $this->patch(route('admin.posts.update', $post), [
        'title' => 'Updated title only',
        'category_id' => $this->category->id,
        'status' => 'draft',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    $post->refresh()->load('postContentFiles');

    expect($post->title)->toBe('Updated title only')
        ->and($post->postContentFiles)->toHaveCount(1)
        ->and($post->postContentFiles->first()->id)->toBe($file->id)
        ->and(is_file($path))->toBeTrue();
});
