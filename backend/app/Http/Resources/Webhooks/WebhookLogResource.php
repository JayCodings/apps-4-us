<?php

declare(strict_types=1);

namespace App\Http\Resources\Webhooks;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebhookLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'route_id' => $this->route_id,
            'user_id' => $this->user_id,
            'request_method' => $this->request_method,
            'request_url' => $this->request_url,
            'request_headers' => $this->request_headers,
            'request_body' => $this->request_body,
            'response_status' => $this->response_status,
            'response_headers' => $this->response_headers,
            'response_body' => $this->response_body,
            'error' => $this->error,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
