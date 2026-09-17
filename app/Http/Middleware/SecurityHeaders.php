<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
        );
        $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy());

        if (app()->isProduction()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
        }

        return $response;
    }

    /**
     * Build the Content-Security-Policy header value. A relaxed script-src
     * and extra connect-src entries are allowed outside production so
     * Vite's dev server and HMR websocket keep working.
     */
    private function contentSecurityPolicy(): string
    {
        $scriptSrc = "'self'";
        $connectSrc = "'self'";

        if (! app()->isProduction()) {
            $scriptSrc .= " 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:* http://10.10.88.33:*";
            $connectSrc .= ' ws://localhost:* ws://127.0.0.1:* ws://10.10.88.33:* http://localhost:* http://127.0.0.1:* http://10.10.88.33:*';
        }

        $directives = [
            "default-src 'self'",
            "script-src {$scriptSrc}",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob:",
            "connect-src {$connectSrc}",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ];

        return implode('; ', $directives);
    }
}
