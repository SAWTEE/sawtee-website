<?php

use App\Models\SiteSetting;
use App\Support\SiteCopy;
use Illuminate\Support\Facades\Cache;

test('defaults include previously hardcoded public copy', function () {
    $defaults = SiteCopy::defaults();

    expect($defaults['footer']['tagline'])->toContain('Research, advocacy')
        ->and($defaults['newsletter']['substack_embed'])->toBe('https://sawteenp.substack.com/embed')
        ->and($defaults['errors']['pages'])->toHaveKey('404')
        ->and($defaults['mobile_menu'])->not->toBeEmpty()
        ->and($defaults['globe_markers'])->toHaveCount(7);
});

test('all merges stored settings over defaults', function () {
    Cache::forget('site_settings');
    SiteSetting::putValue('footer', ['tagline' => 'Edited tagline']);

    $copy = SiteCopy::all();

    expect($copy['footer']['tagline'])->toBe('Edited tagline')
        ->and($copy['footer']['about_label'])->toBe(SiteCopy::defaults()['footer']['about_label'])
        ->and($copy['about_intro'])->toBe(SiteCopy::defaults()['about_intro']);
});

test('seed missing fills only absent keys', function () {
    SiteSetting::putValue('about_intro', 'Keep this intro');

    SiteCopy::seedMissing();

    expect(SiteSetting::getValue('about_intro'))->toBe('Keep this intro')
        ->and(SiteSetting::getValue('footer'))->toBeArray()
        ->and(SiteSetting::getValue('footer')['tagline'])->toBe(SiteCopy::defaults()['footer']['tagline']);
});
