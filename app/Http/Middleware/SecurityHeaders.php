<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Attach browser security headers and strip server fingerprinting.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        if (function_exists('header_remove')) {
            header_remove('X-Powered-By');
        }

        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        $response->headers->set('X-Content-Type-Options', 'nosniff', false);
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN', false);
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin', false);
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), payment=()',
            false
        );
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin', false);

        $response->headers->set(
            'Content-Security-Policy',
            $this->contentSecurityPolicy(),
            false
        );

        if ($request->isSecure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains',
                false
            );
        }

        return $response;
    }

    /**
     * Build CSP. In local Vite HMR, allow the Vite origin from public/hot.
     */
    protected function contentSecurityPolicy(): string
    {
        $scriptSrc = ["'self'", "'unsafe-inline'"];
        $styleSrc = ["'self'", "'unsafe-inline'"];
        $connectSrc = ["'self'", 'ws:', 'wss:', 'https:'];
        $fontSrc = ["'self'", 'data:'];
        $workerSrc = ["'self'", 'blob:'];

        if ($viteOrigin = $this->viteDevOrigin()) {
            // Vite serves modules from another origin (e.g. https://sawtee.test:5173).
            $scriptSrc[] = $viteOrigin;
            $scriptSrc[] = "'unsafe-eval'";
            $styleSrc[] = $viteOrigin;
            $connectSrc[] = $viteOrigin;
            $fontSrc[] = $viteOrigin;
            $workerSrc[] = $viteOrigin;

            $wsOrigin = preg_replace('/^http/', 'ws', $viteOrigin);
            if (is_string($wsOrigin) && $wsOrigin !== '') {
                $connectSrc[] = $wsOrigin;
            }
        }

        return implode('; ', [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "frame-src 'self' https:",
            "object-src 'none'",
            "img-src 'self' data: blob: https:",
            'font-src '.implode(' ', array_unique($fontSrc)),
            'style-src '.implode(' ', array_unique($styleSrc)),
            'script-src '.implode(' ', array_unique($scriptSrc)),
            'connect-src '.implode(' ', array_unique($connectSrc)),
            'worker-src '.implode(' ', array_unique($workerSrc)),
            "media-src 'self' blob: https:",
        ]);
    }

    /**
     * Vite writes the active HMR URL to public/hot while `npm run dev` is running.
     */
    protected function viteDevOrigin(): ?string
    {
        if (! app()->environment(['local', 'development'])) {
            return null;
        }

        $hotPath = public_path('hot');
        if (! is_file($hotPath)) {
            return null;
        }

        $url = trim((string) file_get_contents($hotPath));
        if ($url === '') {
            return null;
        }

        $parts = parse_url($url);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        $origin = $parts['scheme'].'://'.$parts['host'];
        if (! empty($parts['port'])) {
            $origin .= ':'.$parts['port'];
        }

        return $origin;
    }
}
