<?php

declare(strict_types=1);

namespace Components\Webhooks\Data;

use Components\Webhooks\Enums\WebhookMethodEnum;
use JsonSerializable;

final readonly class WebhookRouteDto implements JsonSerializable
{
    public function __construct(
        public string $id,
        public string $project_id,
        public string $user_id,
        public string $name,
        public WebhookMethodEnum $method,
        public ?string $active_response_id,
        public int $rate_limit_per_minute,
        public bool $is_active,
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
            'project_id' => $this->project_id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'method' => $this->method->value,
            'active_response_id' => $this->active_response_id,
            'rate_limit_per_minute' => $this->rate_limit_per_minute,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
