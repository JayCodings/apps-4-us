<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookRouteResource;
use App\Models\WebhookResponse;
use App\Models\WebhookRoute;
use Components\Webhooks\Services\WebhookResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivateWebhookResponseController extends Controller
{
    public function __invoke(
        WebhookRoute $webhookRoute,
        WebhookResponse $webhookResponse,
        Request $request,
        WebhookResponseService $responseService
    ): JsonResponse {
        $responseService->activateResponse($webhookRoute, $webhookResponse);

        return response()->json(new WebhookRouteResource($webhookRoute->fresh()));
    }
}
