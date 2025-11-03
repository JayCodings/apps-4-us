<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookRouteResource;
use App\Models\WebhookRoute;
use Illuminate\Http\JsonResponse;

class ToggleWebhookRouteActiveController extends Controller
{
    public function __invoke(WebhookRoute $webhookRoute): JsonResponse
    {
        $webhookRoute->is_active = !$webhookRoute->is_active;
        $webhookRoute->save();

        return response()->json(new WebhookRouteResource($webhookRoute));
    }
}
