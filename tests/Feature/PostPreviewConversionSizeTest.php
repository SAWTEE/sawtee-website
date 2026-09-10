<?php

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\UploadedFile;

test('post preview conversion is generated at up to 400px on the long edge', function () {
    $category = Category::query()->create([
        'name' => 'News',
        'slug' => 'news-preview-size-'.uniqid(),
        'type' => 'post',
        'parent_id' => null,
    ]);

    $post = Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'published_at' => now(),
    ]);

    $post->addMedia(UploadedFile::fake()->image('wide-event.jpg', 1600, 900))
        ->toMediaCollection('post-featured-image');

    $media = $post->fresh()->getFirstMedia('post-featured-image');
    expect($media)->not->toBeNull();

    $previewPath = $media->getPath('preview');
    expect($previewPath)->toBeString()
        ->and(is_file($previewPath))->toBeTrue();

    $size = getimagesize($previewPath);
    expect($size)->not->toBeFalse();

    [$width, $height] = $size;

    expect(max($width, $height))->toBe(400)
        ->and(min($width, $height))->toBeGreaterThan(200)
        ->and(min($width, $height))->not->toBe(200);
});
