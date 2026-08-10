<?php

use App\Models\Feature;
use App\Models\Fellow;
use App\Models\Fellowship;
use App\Models\Institute;
use App\Models\Member;
use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Artisan;

beforeEach(function () {
    Page::query()->firstOrCreate(
        ['slug' => 'about'],
        [
            'name' => 'About',
            'page_template' => 'SectionTemplate',
            'content' => '',
        ],
    );
});

test('sawtee content seeders are idempotent and populate cms tables', function () {
    Artisan::call('sawtee:seed-content');

    expect(Fellowship::query()->count())->toBeGreaterThanOrEqual(3)
        ->and(Fellow::query()->count())->toBeGreaterThanOrEqual(11)
        ->and(Member::query()->count())->toBeGreaterThanOrEqual(5)
        ->and(Institute::query()->count())->toBeGreaterThanOrEqual(11)
        ->and(Feature::query()->active()->count())->toBe(3)
        ->and(SiteSetting::getValue('about_intro'))->toBeString()->not->toBeEmpty()
        ->and(SiteSetting::getValue('social_menu'))->toBeArray()->not->toBeEmpty();

    $firstPassFellows = Fellow::query()->count();
    $firstPassInstitutes = Institute::query()->count();

    Artisan::call('sawtee:seed-content');

    expect(Fellow::query()->count())->toBe($firstPassFellows)
        ->and(Institute::query()->count())->toBe($firstPassInstitutes);
});
