<?php

use Illuminate\Support\Facades\Cache;

if (! function_exists('abuse_ips')) {
    function abuse_ips(): array
    {
        return Cache::rememberForever('abuse_ips', function () {
            $path = config('abuseip.storage.path');

            if (! is_string($path) || ! file_exists($path)) {
                return [];
            }

            $decoded = json_decode((string) file_get_contents($path), true);

            return is_array($decoded) ? $decoded : [];
        });
    }
}

if (! function_exists('is_abused_ip')) {
    function is_abused_ip(string|int $ip): bool
    {
        if (! is_string($ip) && ! is_int($ip)) {
            return false;
        }

        if (is_string($ip)) {
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) === false) {
                return false;
            }

            if (config('abuseip.storage.compress')) {
                $long = ip2long($ip);

                if ($long === false) {
                    return false;
                }

                $ip = $long;
            }
        }

        return in_array($ip, abuse_ips(), true);
    }
}
