<?php

use App\Http\Middleware\AbuseIp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpKernel\Exception\HttpException;

beforeEach(function () {
    Cache::flush();
});

test('whitelisted ips bypass the abuse ip blocklist', function () {
    config(['abuseip.whitelist' => ['127.0.0.1']]);
    Cache::forever('abuse_ips', [ip2long('127.0.0.1')]);

    $request = Request::create('/__abuse-test', 'GET', server: ['REMOTE_ADDR' => '127.0.0.1']);
    $response = app(AbuseIp::class)->handle($request, fn () => response('ok'));

    expect($response->getContent())->toBe('ok');
    expect($response->getStatusCode())->toBe(200);
});

test('blocked ipv4 addresses receive a 403 response', function () {
    config([
        'abuseip.whitelist' => [],
        'abuseip.storage.compress' => true,
    ]);

    Cache::forever('abuse_ips', [ip2long('203.0.113.10')]);

    $request = Request::create('/__abuse-test', 'GET', server: ['REMOTE_ADDR' => '203.0.113.10']);

    expect(fn () => app(AbuseIp::class)->handle($request, fn () => response('ok')))
        ->toThrow(function (HttpException $e) {
            expect($e->getStatusCode())->toBe(403);
        });
});

test('corrupt abuse ip json does not cause a 500', function () {
    config([
        'abuseip.whitelist' => [],
        'abuseip.storage.compress' => true,
        'abuseip.storage.path' => storage_path('framework/cache/abuseip-test-corrupt.json'),
    ]);

    file_put_contents(config('abuseip.storage.path'), '{not-json');

    $request = Request::create('/__abuse-test', 'GET', server: ['REMOTE_ADDR' => '203.0.113.50']);
    $response = app(AbuseIp::class)->handle($request, fn () => response('ok'));

    expect($response->getStatusCode())->toBe(200);
    expect($response->getContent())->toBe('ok');

    @unlink(config('abuseip.storage.path'));
});

test('blocking can be disabled via config', function () {
    config([
        'abuseip.enabled' => false,
        'abuseip.whitelist' => [],
        'abuseip.storage.compress' => true,
    ]);

    Cache::forever('abuse_ips', [ip2long('203.0.113.10')]);

    $request = Request::create('/__abuse-test', 'GET', server: ['REMOTE_ADDR' => '203.0.113.10']);
    $response = app(AbuseIp::class)->handle($request, fn () => response('ok'));

    expect($response->getStatusCode())->toBe(200);
});

test('non ipv4 addresses are not treated as abused', function () {
    config([
        'abuseip.whitelist' => [],
        'abuseip.storage.compress' => true,
    ]);

    Cache::forever('abuse_ips', [ip2long('203.0.113.10')]);

    expect(is_abused_ip('::1'))->toBeFalse();
    expect(is_abused_ip('not-an-ip'))->toBeFalse();
});
