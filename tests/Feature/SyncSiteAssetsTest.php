<?php

test('sawtee sync site assets copies tracked files into public assets', function () {
    $marker = resource_path('site-assets/logo-sawtee.webp');
    expect($marker)->toBeFile();

    $this->artisan('sawtee:sync-site-assets')->assertSuccessful();

    expect(public_path('assets/logo-sawtee.webp'))->toBeFile()
        ->and(public_path('assets/member-institutes/bela.webp'))->toBeFile()
        ->and(public_path('assets/himal-lamsal.webp'))->toBeFile();
});
