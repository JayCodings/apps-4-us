<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Webhooks\UpdateWebhookRouteRequest;
use App\Http\Resources\Webhooks\WebhookRouteResource;
use App\Models\WebhookRoute;
use Components\Webhooks\Data\CreateUpdateWebhookRouteDto;
use Components\Webhooks\Enums\WebhookMethodEnum;
use Components\Webhooks\Services\WebhookRouteService;
use Illuminate\Http\JsonResponse;

class UpdateWebhookRouteController extends Controller
{
    public function __invoke(
        WebhookRoute $webhookRoute,
        UpdateWebhookRouteRequest $request,
        WebhookRouteService $routeService
    ): JsonResponse {
        $validated = $request->validated();

        $dto = new CreateUpdateWebhookRouteDto(
            name: $validated['name'],
            method: WebhookMethodEnum::from($validated['method']),
            rate_limit_per_minute: config('projects.webhooks.rate_limit_default'),
            is_active: $webhookRoute->is_active,
        );

        $route = $routeService->updateRoute($webhookRoute, $dto);

        return response()->json(new WebhookRouteResource($route));
    }
}
