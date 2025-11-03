<?php

declare(strict_types=1);

namespace App\Models;

use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $route_id
 * @property string $project_id
 * @property string $user_id
 * @property string $request_method
 * @property string $request_url
 * @property array $request_headers
 * @property string|null $request_body
 * @property string|null $request_ip
 * @property int|null $response_status
 * @property array|null $response_headers
 * @property string|null $response_body
 * @property \Components\Webhooks\Enums\WebhookResponseTypeEnum|null $response_type
 * @property int|null $response_time_ms
 * @property string|null $error
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read WebhookRoute $route
 * @property-read Project $project
 * @property-read User $user
 */
class WebhookLog extends BaseModel
{
    use HasUuids;

    protected $casts = [
        'request_headers' => 'array',
        'response_status' => 'integer',
        'response_headers' => 'array',
        'response_type' => WebhookResponseTypeEnum::class,
        'response_time_ms' => 'integer',
    ];

    public function route(): BelongsTo
    {
        return $this->belongsTo(WebhookRoute::class, 'route_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
