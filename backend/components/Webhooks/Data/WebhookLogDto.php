<?php

declare(strict_types=1);

namespace Components\Webhooks\Data;

use JsonSerializable;

final readonly class WebhookLogDto implements JsonSerializable
{
    /**
     * @param array<string, mixed> $request_headers
     * @param array<string, mixed>|null $response_headers
     */
    public function __construct(
        public string $id,
        public string $route_id,
        public string $user_id,
        public string $request_method,
        public string $request_url,
        public array $request_headers,
        public ?string $request_body,
        public ?int $response_status,
        public ?array $response_headers,
        public ?string $response_body,
        public ?string $error,
        public string $created_at,
        public string $updated_at,
    ) {
        //
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
