<?php

use App\Models\SiteSetting;
use App\Models\User;
use App\Support\SiteCopy;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('the settings screen shares the merged site copy', function () {
    $this->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Backend/SiteSetting/Edit')
            ->has('settings.footer.tagline')
            ->has('settings.newsletter.substack_embed')
            ->has('settings.mobile_menu')
        );
});

test('an editor can update public site copy', function () {
    $payload = SiteCopy::defaults();
    $payload['footer']['tagline'] = 'Updated footer tagline';
    $payload['about_intro'] = 'Updated Know Us intro';
    $payload['newsletter']['substack_embed'] = 'https://example.com/embed';

    $this->patch(route('admin.settings.update'), $payload)
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.settings.edit'));

    expect(SiteSetting::getValue('footer')['tagline'])->toBe('Updated footer tagline')
        ->and(SiteSetting::getValue('about_intro'))->toBe('Updated Know Us intro')
        ->and(SiteSetting::getValue('newsletter')['substack_embed'])->toBe('https://example.com/embed');
});

test('settings update rejects an invalid social link', function () {
    $payload = SiteCopy::defaults();
    $payload['social_menu'] = [
        ['name' => 'twitter', 'link' => 'not-a-url'],
    ];

    $this->patch(route('admin.settings.update'), $payload)
        ->assertSessionHasErrors('social_menu.0.link');
});
