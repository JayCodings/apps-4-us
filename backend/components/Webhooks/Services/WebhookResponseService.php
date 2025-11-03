<?php

declare(strict_types=1);

namespace Components\Webhooks\Services;

use App\Models\User;
use App\Models\WebhookResponse;
use App\Models\WebhookRoute;
use Components\Webhooks\Data\CreateUpdateWebhookResponseDto;

readonly class WebhookResponseService
{
    public function createResponse(WebhookRoute $route, User $user, CreateUpdateWebhookResponseDto $dto): WebhookResponse
    {
        return WebhookResponse::create([
            'route_id' => $route->id,
            'user_id' => $user->id,
            'name' => $dto->name,
            'type' => $dto->type->value,
            'status_code' => $dto->status_code,
            'headers' => $dto->headers,
            'body' => $dto->body,
            'proxy_url' => $dto->proxy_url,
        ]);
    }

    public function updateResponse(WebhookResponse $response, CreateUpdateWebhookResponseDto $dto): WebhookResponse
    {
        $response->update([
            'name' => $dto->name,
            'type' => $dto->type->value,
            'status_code' => $dto->status_code,
            'headers' => $dto->headers,
            'body' => $dto->body,
            'proxy_url' => $dto->proxy_url,
        ]);

        return $response->fresh();
    }

    public function deleteResponse(WebhookResponse $response): void
    {
        $response->delete();
    }

    public function activateResponse(WebhookRoute $route, WebhookResponse $response): void
    {
        if ($response->route_id !== $route->id) {
            throw new \InvalidArgumentException('Response does not belong to this route');
        }

        $route->update(['active_response_id' => $response->id]);
    }
}
