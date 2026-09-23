<?php

use App\Models\Feature;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('guests cannot manage features', function () {
    auth()->logout();

    $this->get(route('admin.features.index'))->assertRedirect(route('login'));
});

test('an editor can create a feature from the admin', function () {
    $this->post(route('admin.features.store'), [
        'title' => 'Media fellowship',
        'description' => 'A programme for journalists.',
        'image_src' => '/assets/Media-Fellowship-banner.webp',
        'link' => '/media-fellows',
        'sort_order' => 1,
        'is_active' => true,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.features.index'));

    $feature = Feature::query()->first();

    expect($feature)->not->toBeNull()
        ->and($feature->title)->toBe('Media fellowship')
        ->and($feature->key)->toBe('media-fellowship')
        ->and($feature->is_active)->toBeTrue();
});

test('feature store rejects a duplicate key', function () {
    Feature::factory()->create(['key' => 'taken']);

    $this->post(route('admin.features.store'), [
        'key' => 'taken',
        'title' => 'Something else',
        'is_active' => true,
    ])->assertSessionHasErrors('key');
});

test('feature update keeps its own key and can be hidden', function () {
    $feature = Feature::factory()->create([
        'key' => 'covid-resources',
        'title' => 'COVID-19 resources',
        'is_active' => true,
    ]);

    $this->patch(route('admin.features.update', $feature), [
        'key' => 'covid-resources',
        'title' => 'COVID-19 archive',
        'description' => 'Updated copy',
        'is_active' => false,
        'sort_order' => 4,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.features.index'));

    $feature->refresh();

    expect($feature->title)->toBe('COVID-19 archive')
        ->and($feature->is_active)->toBeFalse()
        ->and($feature->sort_order)->toBe(4);
});

test('an editor can delete a feature', function () {
    $feature = Feature::factory()->create();

    $this->delete(route('admin.features.destroy', $feature))
        ->assertRedirect(route('admin.features.index'));

    expect(Feature::query()->find($feature->id))->toBeNull();
});
