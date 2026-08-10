<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DenyDebugEndpoints
{
    /**
     * Block package debug endpoints outside local, even if APP_DEBUG is on.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            ! app()->environment('local')
            && $request->is('_boost', '_boost/*', '_ignition', '_ignition/*')
        ) {
            abort(404);
        }

        return $next($request);
    }
}
