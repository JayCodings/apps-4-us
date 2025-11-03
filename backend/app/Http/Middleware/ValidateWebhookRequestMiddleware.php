<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateWebhookRequestMiddleware
{
    private const array BLOCKED_CONTENT_TYPES = [
        'multipart/form-data',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $contentLength = $request->header('Content-Length');

        if ($contentLength && ((int) $contentLength) > (config('projects.webhooks.max_request_size_kb') * 1024)) {
            return response('Request too large', 413);
        }

        $contentType = $request->header('Content-Type');

        if ($contentType && $this->isBlockedContentType($contentType)) {
            return response('Content type not allowed', 415);
        }

        return $next($request);
    }

    private function isBlockedContentType(string $contentType): bool
    {
        foreach (self::BLOCKED_CONTENT_TYPES as $blocked) {
            if (str_contains(strtolower($contentType), $blocked)) {
                return true;
            }
        }

        return false;
    }
}
