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
        $method = WebhookMethodEnum::from($request->method());
        $route = $routeService->findRouteByUuid($uuid, $method);

        if (!$route || !$route->is_active) {
            return response('Webhook not found', 404);
        }

        // Check if the route owner has the webhook-proxy feature
        if (!$route->user->hasFeature('webhook-proxy')) {
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: 'User does not have webhook-proxy feature'
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('Webhook feature not available', 403);
        }

        if (!$route->active_response_id) {
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: 'No active response configured'
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('No active response configured', 500);
        }

        $activeResponse = WebhookResponse::find($route->active_response_id);

        if (!$activeResponse) {
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: 'Active response not found'
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('Active response not found', 500);
        }

        try {
            $result = $executorService->execute($activeResponse, $request);

            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                responseStatus: $result['status'],
                responseHeaders: $result['headers'],
                responseBody: $result['body']
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response($result['body'], $result['status'])
                ->withHeaders($result['headers']);
        } catch (\Exception $e) {
            $log = $loggerService->logRequest(
                route: $route,
                request: $request,
                error: $e->getMessage()
            );

            event(new WebhookReceivedEvent($route->user_id, $route->project_id, $route->id, $log->id));

            return response('Internal server error', 500);
        }
    }
}
