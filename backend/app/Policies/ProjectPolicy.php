<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Components\Projects\Enums\ProjectRoleEnum;
use Components\Projects\Enums\ProjectTypeEnum;
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

    public function create(User $user, ProjectTypeEnum $type): Response
    {
        if (!$user->hasFeature($type->value)) {
            return Response::deny("You do not have access to create projects of type " . $type->value . ".");
        }

        $context = $user->getFeatureContext($type->value);

        if ($context) {
            $maxProjects = (int) ($context['max-projects'] ?? config('projects.max_projects_per_type'));
            $currentCount = $user->projects()
                ->wherePivot("role", ProjectRoleEnum::Owner->value)
                ->where('type', $type->value)
                ->count();

            if ($currentCount >= $maxProjects) {
                return Response::deny("You have reached the maximum of " . $maxProjects . " projects of type " . $type->value . ".");
            }
        }

        return Response::allow();
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
