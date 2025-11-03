<?php

declare(strict_types=1);

namespace App\Models;

use Components\Projects\Enums\ProjectTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property ProjectTypeEnum $type
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $users
 * @property-read \Illuminate\Database\Eloquent\Collection<int, WebhookRoute> $webhookRoutes
 */
class Project extends BaseModel
{
    use HasUuids;

    protected $casts = [
        'type' => ProjectTypeEnum::class,
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function owner(): BelongsToMany
    {
        return $this->users()->wherePivot('role', 'owner');
    }

    public function webhookRoutes(): HasMany
    {
        return $this->hasMany(WebhookRoute::class);
    }
}
