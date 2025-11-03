<?php

declare(strict_types=1);

namespace Components\Webhooks\Services;

use App\Models\Project;
use App\Models\User;
use App\Models\WebhookRoute;
use Components\Webhooks\Data\CreateUpdateWebhookRouteDto;
use Components\Webhooks\Enums\WebhookMethodEnum;

readonly class WebhookRouteService
{
    public function createRoute(Project $project, User $user, CreateUpdateWebhookRouteDto $dto): WebhookRoute
    {
        return WebhookRoute::create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'name' => $dto->name,
            'method' => $dto->method->value,
            'rate_limit_per_minute' => $dto->rate_limit_per_minute,
            'is_active' => $dto->is_active,
        ]);
    }

    public function updateRoute(WebhookRoute $route, CreateUpdateWebhookRouteDto $dto): WebhookRoute
    {
        $route->update([
            'name' => $dto->name,
            'method' => $dto->method->value,
            'rate_limit_per_minute' => $dto->rate_limit_per_minute,
            'is_active' => $dto->is_active,
        ]);

        return $route->fresh();
    }

    public function deleteRoute(WebhookRoute $route): void
    {
        $route->delete();
    }

    public function findRouteByUuid(string $uuid, WebhookMethodEnum $method): ?WebhookRoute
    {
        return WebhookRoute::query()
            ->with('user.features')
            ->where('id', $uuid)
            ->where('method', $method->value)
            ->where('is_active', true)
            ->first();
    }
}
