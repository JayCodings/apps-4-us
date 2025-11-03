<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $route_id
 * @property string $user_id
 * @property string $request_method
 * @property string $request_url
 * @property array $request_headers
 * @property string|null $request_body
 * @property int|null $response_status
 * @property array|null $response_headers
 * @property string|null $response_body
 * @property string|null $error
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read WebhookRoute $route
 * @property-read User $user
 */
class WebhookLog extends BaseModel
{
    use HasUuids;

    protected $casts = [
        'request_headers' => 'array',
        'response_status' => 'integer',
        'response_headers' => 'array',
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
