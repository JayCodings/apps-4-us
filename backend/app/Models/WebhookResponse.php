<?php

declare(strict_types=1);

namespace App\Models;

use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $route_id
 * @property string $user_id
 * @property string $name
 * @property WebhookResponseTypeEnum $type
 * @property int|null $status_code
 * @property array|null $headers
 * @property string|null $body
 * @property string|null $proxy_url
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read WebhookRoute $route
 * @property-read User $user
 */
class WebhookResponse extends BaseModel
{
    use HasUuids;

    protected $casts = [
        'type' => WebhookResponseTypeEnum::class,
        'status_code' => 'integer',
        'headers' => 'array',
    ];

    public function route(): BelongsTo
    {
        return $this->belongsTo(WebhookRoute::class, 'route_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
