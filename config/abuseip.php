<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Enable AbuseIP blocking
    |--------------------------------------------------------------------------
    |
    | Set ABUSEIP_ENABLED=false in .env to temporarily disable blocking
    | (useful for local debugging). Default: enabled.
    |
    */
    'enabled' => env('ABUSEIP_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | AbuseIP Source URL
    |--------------------------------------------------------------------------
    |
    | The source URLs yielding a list of abusive IPs. Change these to whatever
    | sources you like. Just make sure they are separated by newlines.
    |
    | https://github.com/borestad/blocklist-abuseipdb
    | Do not use the abuseipdb-s100-all.ipv4 — it is only for statistical usage.
    | Prefer ≤30 days to avoid false positives. 14d is a good production default.
    |
    */
    'source' => [
        // 'https://raw.githubusercontent.com/borestad/blocklist-abuseipdb/main/abuseipdb-s100-30d.ipv4',
        'https://raw.githubusercontent.com/borestad/blocklist-abuseipdb/main/abuseipdb-s100-14d.ipv4',
    ],

    /*
    |--------------------------------------------------------------------------
    | IP Whitelist
    |--------------------------------------------------------------------------
    |
    | These IPs bypass the blocklist. Merge ABUSEIP_WHITELIST (comma-separated)
    | from .env with the static list below (office / monitoring IPs).
    |
    */
    'whitelist' => array_values(array_filter(array_unique(array_merge(
        [
            '127.0.0.1',
            '::1',
        ],
        array_map(
            'trim',
            explode(',', (string) env('ABUSEIP_WHITELIST', ''))
        )
    )))),

    /*
    |--------------------------------------------------------------------------
    | AbuseIP Storage
    |--------------------------------------------------------------------------
    |
    | Path is relative to storage_path() unless you pass an absolute path via
    | ABUSEIP_STORAGE_PATH. compress=true stores IPs as integers via ip2long().
    |
    */
    'storage' => [
        'path' => storage_path(
            env('ABUSEIP_STORAGE_PATH', 'framework/cache/abuseip.json')
        ),
        'compress' => filter_var(
            env('ABUSEIP_STORAGE_COMPRESS', true),
            FILTER_VALIDATE_BOOLEAN
        ),
    ],
];
