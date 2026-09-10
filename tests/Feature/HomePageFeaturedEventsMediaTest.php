<?php

use App\Models\Category;
use App\Models\Post;
use App\Support\ContentCache;
use App\Support\HomePageDataAssembler;
use App\Support\MediaConversionUrl;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

test('featured events prefer large conversion for original_url and keep preview_url for thumbs', function () {
    Cache::forget(ContentCache::homeKey());

    $category = Category::query()->firstOrCreate(
        ['slug' => 'featured-events'],
        [
            'name' => 'Featured Events',
            'type' => 'post',
            'parent_id' => null,
        ]
    );

    $post = Post::factory()->create([
        'title' => 'Policy outreach event',
        'slug' => 'policy-outreach-'.uniqid(),
        'status' => 'published',
        'category_id' => $category->id,
        'theme_id' => null,
        'published_at' => now(),
    ]);

    $post->addMedia(UploadedFile::fake()->image('event.jpg', 1600, 900))
        ->toMediaCollection('post-featured-image');

    $media = $post->fresh()->getFirstMedia('post-featured-image');
    expect($media)->not->toBeNull();

    // Preview is non-queued; large is queued — ensure a large file exists for this assertion.
    expect(MediaConversionUrl::isUsable($media, 'preview'))->toBeTrue();

    if (! MediaConversionUrl::isUsable($media, 'large')) {
        $largePath = dirname($media->getPath()).'/conversions/'
            .pathinfo($media->file_name, PATHINFO_FILENAME).'-large.webp';
        File::ensureDirectoryExists(dirname($largePath));
        File::copy($media->getPath('preview'), $largePath);
        $media->markAsConversionGenerated('large');
        $media->refresh();
    }

    $payload = app(HomePageDataAssembler::class)->assemble();
    $event = collect($payload['events'])->firstWhere('id', $post->id);

    expect($event)->not->toBeNull()
        ->and($event['media'][0]['original_url'] ?? null)->toContain('-large.')
        ->and($event['media'][0]['original_url'] ?? null)->not->toContain('-preview.')
        ->and($event['media'][0]['preview_url'] ?? null)->toContain('-preview.');
});
