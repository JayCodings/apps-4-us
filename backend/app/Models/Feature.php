<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<User> $users
 */
class Feature extends BaseModel
{
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_features')
            ->withPivot('context')
            ->withTimestamps();
    }
}
