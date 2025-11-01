<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Policies\ProjectPolicy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        $data = [
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "type" => $this->type->value,
            "created_at" => $this->created_at?->toISOString(),
            "updated_at" => $this->updated_at?->toISOString(),
        ];

        if ($user) {
            $data["role"] = $this->users()->where("user_id", $user->id)->first()?->pivot?->role;
            $policy = app(ProjectPolicy::class);
            $data["permissions"] = [
                "can" => [
                    "view" => $policy->view($user, $this->resource)->toArray(),
                    "update" => $policy->update($user, $this->resource)->toArray(),
                    "delete" => $policy->delete($user, $this->resource)->toArray(),
                ],
            ];
        }

        return $data;
    }
}
