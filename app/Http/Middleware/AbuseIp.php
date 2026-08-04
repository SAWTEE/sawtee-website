<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AbuseIp
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $whitelistedIps = config('abuseip.whitelist', []);

        if (in_array($ip, $whitelistedIps, true)) {
            return $next($request);
        }

        if (is_abused_ip($ip)) {
            abort(403, 'Your IP address has been blocked');
        }

        return $next($request);
    }
}
