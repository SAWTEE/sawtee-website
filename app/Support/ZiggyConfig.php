<?php

namespace App\Support;

use Illuminate\Http\Request;
use Tighten\Ziggy\Ziggy;

final class ZiggyConfig
{
    /**
     * Resolve the Ziggy group for the current request.
     *
     * Authenticated users need the full admin route map. Guest visits under
     * /admin (login, password reset) get auth helpers only. Everyone else
     * receives the public whitelist so admin endpoints are not disclosed.
     */
    public static function groupFor(Request $request): string
    {
        if ($request->user() !== null) {
            return 'admin';
        }

        if ($request->is('admin', 'admin/*', 'forgot-password', 'reset-password', 'reset-password/*')) {
            return 'auth';
        }

        return 'public';
    }

    /**
     * @return array<string, mixed>
     */
    public static function forRequest(Request $request): array
    {
        return (new Ziggy(self::groupFor($request)))->toArray();
    }
}
