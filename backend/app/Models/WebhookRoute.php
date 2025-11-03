<?php

declare(strict_types=1);

namespace App\Models;

use Components\Webhooks\Enums\WebhookMethodEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $project_id
 * @property string $user_id
 * @property string $name
 * @property WebhookMethodEnum $method
 * @property string|null $active_response_id
 * @property int $rate_limit_per_minute
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read Project $project
 * @property-read User $user
 * @property-read WebhookResponse|null $activeResponse
 * @property-read \Illuminate\Database\Eloquent\Collection<int, WebhookResponse> $responses
 * @property-read \Illuminate\Database\Eloquent\Collection<int, WebhookLog> $logs
 */
class WebhookRoute extends BaseModel
{
    use HasUuids;

    protected $casts = [
        'method' => WebhookMethodEnum::class,
        'is_active' => 'boolean',
        'rate_limit_per_minute' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(WebhookResponse::class, 'route_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(WebhookLog::class, 'route_id');
    }

    public function activeResponse(): BelongsTo
    {
        return $this->belongsTo(WebhookResponse::class, 'active_response_id');
    }
}
