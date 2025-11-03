<?php

declare(strict_types=1);

namespace App\Http\Resources\Webhooks;

use App\Policies\WebhookRoutePolicy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebhookRouteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        $data = [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'method' => $this->method->value,
            'active_response_id' => $this->active_response_id,
            'rate_limit_per_minute' => $this->rate_limit_per_minute,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];

        if ($user) {
            $policy = app(WebhookRoutePolicy::class);
            $responsePolicy = app(\App\Policies\WebhookResponsePolicy::class);
            $data['permissions'] = [
                'can' => [
                    'view' => $policy->view($user, $this->resource)->toArray(),
                    'update' => $policy->update($user, $this->resource)->toArray(),
                    'delete' => $policy->delete($user, $this->resource)->toArray(),
                    'toggle_active' => $policy->toggleActive($user, $this->resource)->toArray(),
                    'create_responses' => $responsePolicy->create($user, $this->resource)->toArray(),
                ],
            ];
        }

        return $data;
    }
}
