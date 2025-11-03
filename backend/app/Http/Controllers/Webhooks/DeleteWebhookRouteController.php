<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\WebhookRoute;
use Components\Webhooks\Services\WebhookRouteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeleteWebhookRouteController extends Controller
{
    public function __invoke(
        WebhookRoute $webhookRoute,
        Request $request,
        WebhookRouteService $routeService
    ): JsonResponse {
        $routeService->deleteRoute($webhookRoute);

        return response()->json(null, 204);
    }
}
