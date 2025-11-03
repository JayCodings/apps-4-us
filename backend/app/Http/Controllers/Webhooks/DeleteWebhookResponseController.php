<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\WebhookResponse;
use Components\Webhooks\Services\WebhookResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeleteWebhookResponseController extends Controller
{
    public function __invoke(
        WebhookResponse $webhookResponse,
        Request $request,
        WebhookResponseService $responseService
    ): JsonResponse {
        $responseService->deleteResponse($webhookResponse);

        return response()->json(null, 204);
    }
}
