<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Webhooks\StoreWebhookResponseRequest;
use App\Http\Resources\Webhooks\WebhookResponseResource;
use App\Models\WebhookRoute;
use Components\Webhooks\Data\CreateUpdateWebhookResponseDto;
use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use Components\Webhooks\Services\WebhookResponseService;
use Illuminate\Http\JsonResponse;

class CreateWebhookResponseController extends Controller
{
    public function __invoke(
        WebhookRoute $webhookRoute,
        StoreWebhookResponseRequest $request,
        WebhookResponseService $responseService
    ): JsonResponse {
        $user = $request->user();
        $validated = $request->validated();

        $dto = new CreateUpdateWebhookResponseDto(
            name: $validated['name'],
            type: WebhookResponseTypeEnum::from($validated['type']),
            status_code: $validated['status_code'] ?? null,
            headers: $validated['headers'] ?? null,
            body: $validated['body'] ?? null,
            proxy_url: $validated['proxy_url'] ?? null,
        );

        $response = $responseService->createResponse($webhookRoute, $user, $dto);

        return response()->json(new WebhookResponseResource($response), 201);
    }
}
