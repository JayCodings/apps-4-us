<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Project;
use App\Policies\ProjectPolicy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            "id" => $this->id,
            "name" => $this->name,
            "email" => $this->email,
            "email_verified_at" => $this->email_verified_at?->toISOString(),
            "created_at" => $this->created_at?->toISOString(),
            "updated_at" => $this->updated_at?->toISOString(),
            "active_project" => $this->activeProject ? new ProjectResource($this->activeProject) : null,
            "permissions" => [
                "can" => [
                    "createProject" => app(ProjectPolicy::class)->create($user)->toArray(),
                ],
            ],
        ];
    }
}
