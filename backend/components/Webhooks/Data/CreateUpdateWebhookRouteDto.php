<?php

declare(strict_types=1);

namespace Components\Webhooks\Data;

use Components\Webhooks\Enums\WebhookMethodEnum;
use JsonSerializable;

final readonly class CreateUpdateWebhookRouteDto implements JsonSerializable
{
    public function __construct(
        public string $name,
        public WebhookMethodEnum $method,
        public int $rate_limit_per_minute = 60,
        public bool $is_active = true,
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
            'method' => $this->method->value,
            'rate_limit_per_minute' => $this->rate_limit_per_minute,
            'is_active' => $this->is_active,
        ];
    }
}
