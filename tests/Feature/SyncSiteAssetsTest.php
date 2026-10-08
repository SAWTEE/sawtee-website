<?php

test('sawtee sync site assets copies tracked files into public assets', function () {
    $marker = resource_path('site-assets/logo-sawtee.webp');
    expect($marker)->toBeFile();

    $this->artisan('sawtee:sync-site-assets')->assertSuccessful();

    expect(public_path('assets/logo-sawtee.webp'))->toBeFile()
        ->and(public_path('assets/logo-sawtee-header.webp'))->toBeFile()
        ->and(public_path('assets/member-institutes/bela.webp'))->toBeFile()
        ->and(public_path('assets/himal-lamsal.webp'))->toBeFile();
});

test('header logo webp includes an alpha channel for dark mode', function () {
    $bytes = file_get_contents(resource_path('site-assets/logo-sawtee-header.webp'));

    expect($bytes)->toStartWith('RIFF')
        ->and(substr($bytes, 8, 4))->toBe('WEBP');

    $fourcc = substr($bytes, 12, 4);

    expect($fourcc)->toBeIn(['VP8X', 'VP8L']);

    if ($fourcc === 'VP8X') {
        expect(ord($bytes[20]) & 0x10)->not->toBe(0);
    }

    expect(strlen($bytes))->toBeLessThan(12 * 1024);
});
