<?php

test('offline fallback page is available', function () {
    $this->get(route('pwa.offline'))
        ->assertSuccessful()
        ->assertSee('offline', false)
        ->assertSee('Back to home', false)
        ->assertSee('SAWTEE', false);
});

test('pwa icons exist on disk', function () {
    expect(public_path('pwa-192x192.png'))->toBeFile()
        ->and(public_path('pwa-512x512.png'))->toBeFile()
        ->and(public_path('pwa-maskable-512x512.png'))->toBeFile()
        ->and(public_path('apple-touch-icon.png'))->toBeFile()
        ->and(public_path('offline.html'))->toBeFile();
});

test('admin login is not publicly cacheable for long periods', function () {
    $cacheControl = strtolower(
        (string) $this->get('/admin/login')->headers->get('Cache-Control')
    );

    expect($cacheControl)->not->toMatch('/\bpublic\b.*\bmax-age=[1-9]/');
});
