<?php

use App\Http\Kernel;
use App\Http\Middleware\PreventRequestForgery;

test('prevent request forgery middleware is registered on the web stack', function () {
    $middleware = app(Kernel::class)->getMiddlewareGroups()['web'] ?? [];

    expect($middleware)->toContain(PreventRequestForgery::class);
});
