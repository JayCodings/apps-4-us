<?php

declare(strict_types=1);

namespace Components\Webhooks\Data;

use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use JsonSerializable;

final readonly class CreateUpdateWebhookResponseDto implements JsonSerializable
{
    /**
     * @param array<string, string>|null $headers
     */
    public function __construct(
        public string $name,
        public WebhookResponseTypeEnum $type,
        public ?int $status_code = null,
        public ?array $headers = null,
        public ?string $body = null,
        public ?string $proxy_url = null,
    ) {
        //
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type->value,
            'status_code' => $this->status_code,
            'headers' => $this->headers,
            'body' => $this->body,
            'proxy_url' => $this->proxy_url,
        ];
    }
}
