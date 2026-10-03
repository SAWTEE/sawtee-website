<?php

use App\Models\Category;
use App\Models\Post;
use App\Support\MediaConversionUrl;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('home page html includes crawler open graph image tags', function () {
    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertSee('property="og:image"', false)
        ->assertSee('property="og:image:secure_url"', false)
        ->assertSee('name="twitter:image"', false)
        ->assertSee(url('/assets/logo-sawtee.webp'), false);
});

test('post page html includes featured image in open graph tags', function () {
    Storage::fake('public');

    $category = Category::query()->create([
        'name' => 'News',
        'slug' => 'news',
        'type' => 'post',
        'parent_id' => null,
    ]);

    $post = Post::factory()->create([
        'title' => 'Trade Policy Update',
        'slug' => 'trade-policy-update',
        'status' => 'published',
        'category_id' => $category->id,
        'theme_id' => null,
        'published_at' => now(),
        'excerpt' => 'A short summary for social previews.',
    ]);

    $post->addMedia(UploadedFile::fake()->image('featured.jpg', 1200, 630))
        ->toMediaCollection('post-featured-image');

    $featuredMedia = $post->fresh()->getFirstMedia('post-featured-image');
    $absoluteImage = MediaConversionUrl::resolve($featuredMedia, 'large');
    expect($absoluteImage)->not->toBeEmpty()
        ->not->toBe(url('/assets/logo-sawtee.webp'));

    $response = $this->get(route('category.show', [
        'categories' => $category->slug,
        'subcategory' => $post->slug,
    ]));

    $response->assertOk()
        ->assertSee('property="og:image"', false)
        ->assertSee($absoluteImage, false)
        ->assertSee('Trade Policy Update', false)
        ->assertSee('A short summary for social previews.', false);
});
