<?php

use App\Models\User;
use App\Support\OrphanedFilesCleaner;
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
