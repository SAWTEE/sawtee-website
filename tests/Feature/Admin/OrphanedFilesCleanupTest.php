<?php

use App\Models\User;
use App\Support\OrphanedFilesCleaner;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

beforeEach(function () {
    $this->actingAs(User::factory()->create([
        'email_verified_at' => now(),
    ]));
});

test('orphaned files cleaner reports files not referenced by the database', function () {
    $dir = public_path('Featured_Events');
    File::ensureDirectoryExists($dir);

    $orphan = $dir.'/orphan-cleanup-test-'.uniqid().'.pdf';
    File::put($orphan, 'stale');

    $report = app(OrphanedFilesCleaner::class)->scan();

    $labels = array_column($report['orphans'], 'label');
    expect($labels)->toContain('Featured_Events/'.basename($orphan));

    $result = app(OrphanedFilesCleaner::class)->delete(
        array_values(array_filter(
            $report['orphans'],
            fn (array $item) => $item['path'] === $orphan
        ))
    );

    expect($result['deleted'])->toBe(1)
        ->and(File::exists($orphan))->toBeFalse();
});

test('media-library cleaner respects the uploads prefix and keeps referenced media trees', function () {
    $prefix = trim((string) config('media-library.prefix', 'uploads'), '/');
    $mediaRoot = public_path('media-library'.($prefix !== '' ? '/'.$prefix : ''));
    File::ensureDirectoryExists($mediaRoot);

    $media = Media::query()->create([
        'model_type' => 'App\\Models\\Slide',
        'model_id' => 1,
        'uuid' => (string) Str::uuid(),
        'collection_name' => 'slides',
        'name' => 'kept',
        'file_name' => 'kept.jpg',
        'mime_type' => 'image/jpeg',
        'disk' => 'media',
        'conversions_disk' => 'media',
        'size' => 10,
        'manipulations' => [],
        'custom_properties' => [],
        'generated_conversions' => ['preview' => true],
        'responsive_images' => [],
    ]);

    $keptId = (int) $media->id;
    $orphanId = $keptId + 50_000;

    $keptDir = $mediaRoot.'/'.$keptId;
    $orphanDir = $mediaRoot.'/'.$orphanId;
    File::ensureDirectoryExists($keptDir.'/conversions');
    File::ensureDirectoryExists($orphanDir.'/conversions');
    File::put($keptDir.'/kept.jpg', 'original');
    File::put($keptDir.'/conversions/kept-preview.webp', 'preview');
    File::put($orphanDir.'/gone.jpg', 'stale');

    try {
        $report = app(OrphanedFilesCleaner::class)->scan();
        $labels = array_column($report['orphans'], 'label');

        expect($labels)->not->toContain('media-library/uploads')
            ->and($labels)->not->toContain('media-library/'.$prefix)
            ->and($labels)->not->toContain('media-library/'.$prefix.'/'.$keptId)
            ->and($labels)->toContain('media-library/'.$prefix.'/'.$orphanId);
    } finally {
        File::deleteDirectory($keptDir);
        File::deleteDirectory($orphanDir);
        $media->delete();
    }
});

test('files referenced only by a media fellow published story are not orphans', function () {
    $uploads = storage_path('app/public/uploads');
    File::ensureDirectoryExists($uploads);

    $name = 'story-image-'.uniqid().'.jpg';
    $path = $uploads.'/'.$name;
    File::put($path, 'image');

    $fellowshipId = DB::table('fellowships')->insertGetId([
        'year' => 2024,
        'title' => 'Media Fellowship',
        'description' => 'Fellowship',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $fellowId = DB::table('fellows')->insertGetId([
        'fellowship_id' => $fellowshipId,
        'name' => 'Fellow',
        'designation' => 'Journalist',
        'description' => 'Bio',
        'experience' => 'Experience',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('published_stories')->insert([
        'fellow_id' => $fellowId,
        'title' => 'A story with no URL in its title',
        'link' => 'https://example.com/story',
        'media_src' => '/storage/uploads/'.$name,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    try {
        $labels = array_column(app(OrphanedFilesCleaner::class)->scan()['orphans'], 'label');

        expect($labels)->not->toContain('storage/uploads/'.$name);
    } finally {
        File::delete($path);
    }
});

test('every file row protects its own basename even when names collide', function () {
    $dir = public_path('publications');
    File::ensureDirectoryExists($dir);

    $suffix = uniqid();
    $sharedName = 'collision-'.$suffix.'.pdf';
    $first = 'collision-'.$suffix.'-a.pdf';
    $second = 'collision-'.$suffix.'-b.pdf';

    File::put($dir.'/'.$first, 'first');
    File::put($dir.'/'.$second, 'second');

    // Both rows carry the same `name` but different paths. Keying references by
    // `name` kept only the last row, leaving the other file looking unreferenced.
    foreach ([$first, $second] as $basename) {
        DB::table('files')->insert([
            'name' => $sharedName,
            'path' => '/legacy/public/publications/'.$basename,
            'fileable_type' => 'App\\Models\\Publication',
            'fileable_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    try {
        $labels = array_column(app(OrphanedFilesCleaner::class)->scan()['orphans'], 'label');

        expect($labels)->not->toContain('publications/'.$first)
            ->and($labels)->not->toContain('publications/'.$second);
    } finally {
        File::delete($dir.'/'.$first);
        File::delete($dir.'/'.$second);
    }
});

test('cleaner refuses to delete paths outside the upload roots', function () {
    $outside = storage_path('framework/testing-outside-'.uniqid().'.txt');
    File::ensureDirectoryExists(dirname($outside));
    File::put($outside, 'keep me');

    try {
        $result = app(OrphanedFilesCleaner::class)->delete([
            ['path' => $outside, 'label' => 'spoofed', 'size' => 7],
        ]);

        expect($result['deleted'])->toBe(0)
            ->and($result['failed'])->toContain($outside)
            ->and(File::exists($outside))->toBeTrue();
    } finally {
        File::delete($outside);
    }
});

test('admin maintenance page is reachable and cleanup dry-run redirects back', function () {
    $this->get(route('admin.maintenance.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Backend/Maintenance/Index')
            ->has('report.orphanCount')
        );

    $this->from(route('admin.maintenance.index'))
        ->post(route('admin.maintenance.clean'), ['delete' => false])
        ->assertRedirect(route('admin.maintenance.index'))
        ->assertInertiaFlash('success');
});
