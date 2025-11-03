<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Webhooks\UpdateWebhookResponseRequest;
use App\Http\Resources\Webhooks\WebhookResponseResource;
use App\Models\WebhookResponse;
use Components\Webhooks\Data\CreateUpdateWebhookResponseDto;
use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use Components\Webhooks\Services\WebhookResponseService;
use Illuminate\Http\JsonResponse;

class UpdateWebhookResponseController extends Controller
{
    public function __invoke(
        WebhookResponse $webhookResponse,
        UpdateWebhookResponseRequest $request,
        WebhookResponseService $responseService
    ): JsonResponse {
        $validated = $request->validated();

        $dto = new CreateUpdateWebhookResponseDto(
            name: $validated['name'],
            type: WebhookResponseTypeEnum::from($validated['type']),
            status_code: $validated['status_code'] ?? null,
            headers: $validated['headers'] ?? null,
            body: $validated['body'] ?? null,
            proxy_url: $validated['proxy_url'] ?? null,
        );

        $response = $responseService->updateResponse($webhookResponse, $dto);

        return response()->json(new WebhookResponseResource($response));
    }
}
