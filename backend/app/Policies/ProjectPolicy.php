<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Components\Projects\Enums\ProjectRoleEnum;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    public function viewAny(User $user): Response
    {
        return Response::allow();
    }

    public function view(User $user, Project $project): Response
    {
        $isMember = $project->users()->where("user_id", $user->id)->exists();

        return $isMember
            ? Response::allow()
            : Response::deny("You do not have access to this project.");
    }

    public function create(User $user): Response
    {
        $ownedProjectsCount = $user->projects()
            ->wherePivot("role", ProjectRoleEnum::Owner->value)
            ->count();

        return $ownedProjectsCount < 2
            ? Response::allow()
            : Response::deny("You have reached the maximum of 2 projects.");
    }

    public function update(User $user, Project $project): Response
    {
        $isOwner = $project->users()
            ->where("user_id", $user->id)
            ->wherePivot("role", ProjectRoleEnum::Owner->value)
            ->exists();

        return $isOwner
            ? Response::allow()
            : Response::deny("Only the project owner can update this project.");
    }

    public function delete(User $user, Project $project): Response
    {
        $isOwner = $project->users()
            ->where("user_id", $user->id)
            ->wherePivot("role", ProjectRoleEnum::Owner->value)
            ->exists();

        if (!$isOwner) {
            return Response::deny("Only the project owner can delete this project.");
        }

        return Response::allow();
    }
}
