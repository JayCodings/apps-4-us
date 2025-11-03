<?php

declare(strict_types=1);

namespace Components\Webhooks\Data;

use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use JsonSerializable;

final readonly class WebhookResponseDto implements JsonSerializable
{
    /**
     * @param array<string, string>|null $headers
     */
    public function __construct(
        public string $id,
        public string $route_id,
        public string $user_id,
        public string $name,
        public WebhookResponseTypeEnum $type,
        public ?int $status_code,
        public ?array $headers,
        public ?string $body,
        public ?string $proxy_url,
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
            'name' => $this->name,
            'type' => $this->type->value,
            'status_code' => $this->status_code,
            'headers' => $this->headers,
            'body' => $this->body,
            'proxy_url' => $this->proxy_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
