<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class UpdateAbuseIps extends Command
{
    protected $signature = 'abuseip:update';

    protected $description = 'Update the abuse IP blocklist';

    public function handle(): void
    {
        $this->info('Fetching IP blocklist...');

        $ips = $this->fetchIpsFromSources(config('abuseip.source', []));

        if ($ips === []) {
            $this->error('Failed to fetch IP blocklist');

            return;
        }

        if (config('abuseip.storage.compress')) {
            $ips = array_values(array_filter(
                array_map(function (string $ip) {
                    $long = ip2long($ip);

                    return $long === false ? null : $long;
                }, $ips),
                fn ($ip) => $ip !== null
            ));
        }

        if ($ips === []) {
            $this->error('Failed to parse IP blocklist');

            return;
        }

        file_put_contents(
            config('abuseip.storage.path'),
            json_encode($ips, config('abuseip.storage.compress') ? 0 : JSON_PRETTY_PRINT)
        );

        try {
            Cache::forever('abuse_ips', $ips);

            $this->info('IP blocklist updated successfully');
        } catch (QueryException) {
            Cache::forget('abuse_ips');

            $this->warn('IP blocklist saved to file, but is too long to cache in database');
        }
    }

    private function fetchIpsFromSources(array $sources): array
    {
        $ips = [];

        foreach ($sources as $source) {
            $response = Http::timeout(15)
                ->connectTimeout(5)
                ->get($source);

            if ($response->successful()) {
                $ips = array_merge($ips, $this->parseBlocklist($response->body()));
            } else {
                $this->error("Failed to fetch from source: $source");
            }
        }

        return array_values(array_unique($ips));
    }

    private function parseBlocklist(string $blocklist): array
    {
        $lines = explode("\n", $blocklist);

        return array_values(array_filter(
            array_map(fn ($line) => preg_replace('/\s*#.*$/', '', trim($line)), $lines),
            fn ($line) => filter_var($line, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false
        ));
    }
}
