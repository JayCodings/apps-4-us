<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Events\WebhookReceivedEvent;
use App\Http\Controllers\Controller;
use App\Models\WebhookResponse;
use Components\Webhooks\Enums\WebhookMethodEnum;
use Components\Webhooks\Services\WebhookExecutorService;
use Components\Webhooks\Services\WebhookLoggerService;
use Components\Webhooks\Services\WebhookRouteService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HandleWebhookController extends Controller
{
    public function __invoke(
        string $uuid,
        Request $request,
        WebhookRouteService $routeService,
        WebhookExecutorService $executorService,
        WebhookLoggerService $loggerService
    ): Response {
        $startTime = microtime(true);
        $requestIp = $request->ip();

        $method = WebhookMethodEnum::from($request->method());
        $route = $routeService->findRouteByUuid($uuid, $method);

        if (!$route || !$route->is_active) {
            return response('Webhook not found', 404);
        }

        // Check if the route owner has the webhook-proxy feature
        if (!$route->user->hasFeature('webhook-proxy')) {
            $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: 'User does not have webhook-proxy feature',
                requestIp: $requestIp,
                responseTimeMs: $responseTimeMs
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('Webhook feature not available', 403);
        }

        if (!$route->active_response_id) {
            $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: 'No active response configured',
                requestIp: $requestIp,
                responseTimeMs: $responseTimeMs
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('No active response configured', 500);
        }

        $activeResponse = WebhookResponse::find($route->active_response_id);

        if (!$activeResponse) {
            $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: 'Active response not found',
                requestIp: $requestIp,
                responseTimeMs: $responseTimeMs
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('Active response not found', 500);
        }

        try {
            $result = $executorService->execute($activeResponse, $request);

            $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                responseStatus: $result['status'],
                responseHeaders: $result['headers'],
                responseBody: $result['body'],
                requestIp: $requestIp,
                responseTimeMs: $responseTimeMs
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response($result['body'], $result['status'])
                ->withHeaders($result['headers']);
        } catch (\Exception $e) {
            $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: $e->getMessage(),
                requestIp: $requestIp,
                responseTimeMs: $responseTimeMs
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('Internal server error', 500);
        }
    }
}
