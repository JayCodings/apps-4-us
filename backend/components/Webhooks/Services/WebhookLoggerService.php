<?php

declare(strict_types=1);

namespace Components\Webhooks\Services;

use App\Models\WebhookLog;
use App\Models\WebhookRoute;
use Illuminate\Http\Request;

readonly class WebhookLoggerService
{
    /**
     * @param array<string, mixed>|null $responseHeaders
     */
    public function logRequest(
        WebhookRoute $route,
        Request $request,
        ?int $responseStatus = null,
        ?array $responseHeaders = null,
        ?string $responseBody = null,
        ?string $error = null,
        ?string $requestIp = null,
        ?int $responseTimeMs = null,
    ): WebhookLog {
        return WebhookLog::create([
            'route_id' => $route->id,
            'project_id' => $route->project_id,
            'user_id' => $route->user_id,
            'request_method' => $request->method(),
            'request_url' => $request->fullUrl(),
            'request_headers' => $request->headers->all(),
            'request_body' => $request->getContent(),
            'request_ip' => $requestIp,
            'response_status' => $responseStatus,
            'response_headers' => $responseHeaders,
            'response_body' => $responseBody,
            'response_type' => $route->activeResponse?->type,
            'response_time_ms' => $responseTimeMs,
            'error' => $error,
        ]);
    }
}
