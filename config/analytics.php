<?php

return [

    /*
    |--------------------------------------------------------------------------
    | First-party page view analytics
    |--------------------------------------------------------------------------
    |
    | Lightweight DB-backed page views suitable for shared hosting. IPs and
    | user agents are hashed with ANALYTICS_HASH_SALT before storage.
    |
    */

    'enabled' => (bool) env('ANALYTICS_ENABLED', true),

    /*
    | Minutes to wait before recording another view of the same path for a
    | given browser session (dedupe / throttle).
    */
    'dedupe_minutes' => (int) env('ANALYTICS_DEDUPE_MINUTES', 30),

    /*
    | Salt mixed into IP / user-agent hashes. Set a random value in production.
    */
    'hash_salt' => env('ANALYTICS_HASH_SALT', env('APP_KEY')),

    /*
    | Path prefixes that should never be recorded (admin, APIs, etc.).
    */
    'ignore_prefixes' => [
        'admin',
        'api',
        'sanctum',
        'broadcasting',
        '_debugbar',
        'telescope',
        'horizon',
        'livewire',
        'offline.html',
        'sw.js',
        'manifest.webmanifest',
        'workbox-',
    ],

];
