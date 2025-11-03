<?php

declare(strict_types=1);

namespace App\Http\Resources\Webhooks;

use App\Policies\WebhookResponsePolicy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebhookResponseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        $data = [
            'id' => $this->id,
            'route_id' => $this->route_id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'type' => $this->type->value,
            'status_code' => $this->status_code,
            'headers' => $this->headers,
            'body' => $this->body,
            'proxy_url' => $this->proxy_url,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];

        if ($user) {
            $policy = app(WebhookResponsePolicy::class);
            $data['permissions'] = [
                'can' => [
                    'view' => $policy->view($user, $this->resource)->toArray(),
                    'update' => $policy->update($user, $this->resource)->toArray(),
                    'delete' => $policy->delete($user, $this->resource)->toArray(),
                    'activate' => $policy->activate($user, $this->resource)->toArray(),
                ],
            ];
        }

        return $data;
    }
}
