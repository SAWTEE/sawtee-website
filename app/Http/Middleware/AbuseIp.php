<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AbuseIp
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('abuseip.enabled', true)) {
            return $next($request);
        }

        $ip = $request->ip();
        $whitelistedIps = config('abuseip.whitelist', []);

        if (is_string($ip) && in_array($ip, $whitelistedIps, true)) {
            return $next($request);
        }

        if (is_string($ip) && is_abused_ip($ip)) {
            abort(403, 'Your IP address has been blocked');
        }

        return $next($request);
    }
}
