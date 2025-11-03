<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Webhooks\StoreWebhookRouteRequest;
use App\Http\Resources\Webhooks\WebhookRouteResource;
use App\Models\Project;
use Components\Webhooks\Data\CreateUpdateWebhookRouteDto;
use Components\Webhooks\Enums\WebhookMethodEnum;
use Components\Webhooks\Services\WebhookRouteService;
use Illuminate\Http\JsonResponse;

class CreateWebhookRouteController extends Controller
{
    public function __invoke(
        Project $project,
        StoreWebhookRouteRequest $request,
        WebhookRouteService $routeService
    ): JsonResponse {
        $user = $request->user();
        $validated = $request->validated();

        $dto = new CreateUpdateWebhookRouteDto(
            name: $validated['name'],
            method: WebhookMethodEnum::from($validated['method']),
            rate_limit_per_minute: config('projects.webhooks.rate_limit_default'),
            is_active: false,
        );

        $route = $routeService->createRoute($project, $user, $dto);

        return response()->json(new WebhookRouteResource($route), 201);
    }
}
