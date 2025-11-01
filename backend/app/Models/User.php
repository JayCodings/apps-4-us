<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $active_project_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read Project|null $activeProject
 * @property-read \Illuminate\Database\Eloquent\Collection<Project> $projects
 * @property-read \Illuminate\Database\Eloquent\Collection<Feature> $features
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;
    use HasUuids;

    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function activeProject(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'active_project_id');
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'user_features')
            ->withPivot('context')
            ->withTimestamps();
    }

    public function hasFeature(string $featureName): bool
    {
        return $this->features()->where('name', $featureName)->exists();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getFeatureContext(string $featureName): ?array
    {
        $feature = $this->features()->where('name', $featureName)->first();

        if (!$feature || !$feature->pivot->context) {
            return null;
        }

        return json_decode($feature->pivot->context, true);
    }
}
