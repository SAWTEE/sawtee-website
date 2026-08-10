<?php

use App\Models\Fellow;
use App\Models\Fellowship;
use App\Models\Page;
use App\Models\PublishedStory;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Page::query()->firstOrCreate(
        ['slug' => 'media-fellows'],
        [
            'name' => 'Media Fellows',
            'page_template' => 'MediaFellows',
            'content' => '',
        ],
    );
});

test('media fellows page renders cohorts from the database', function () {
    $fellowship = Fellowship::query()->create([
        'year' => 2026,
        'title' => 'SAWTEE Media Fellowship 2026',
        'description' => 'Test cohort description',
    ]);

    $fellow = Fellow::query()->create([
        'fellowship_id' => $fellowship->id,
        'name' => 'Test Fellow',
        'designation' => 'Reporter',
        'description' => 'A short bio.',
        'experience' => '<p>First reflection.</p><p>Second reflection.</p>',
    ]);

    PublishedStory::query()->create([
        'fellow_id' => $fellow->id,
        'title' => 'Example Story',
        'link' => 'https://example.com/story',
        'media_src' => null,
    ]);

    $this->get('/media-fellows')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Page')
            ->has('fellowships', 1)
            ->where('fellowships.0.year', '2026')
            ->where('fellowships.0.fellows.0.name', 'Test Fellow')
            ->where('fellowships.0.fellows.0.experience.0', 'First reflection.')
            ->where('fellowships.0.fellows.0.published_stories.0.title', 'Example Story')
        );
});
