<?php

declare(strict_types=1);

namespace Components\Projects\Services;

use App\Models\Project;
use App\Models\User;
use Components\Projects\Data\ProjectDto;
use Components\Projects\Enums\ProjectRoleEnum;
use Illuminate\Database\Eloquent\Collection;

readonly class ProjectService
{
    public function createProject(User $user, ProjectDto $dto): Project
    {
        $project = Project::create($dto->jsonSerialize());

        $project->users()->attach($user->id, ['role' => ProjectRoleEnum::Owner->value]);

        return $project;
    }

    public function updateProject(Project $project, ProjectDto $dto): Project
    {
        $project->update($dto->jsonSerialize());

        return $project;
    }

    public function deleteProject(Project $project): void
    {
        $project->delete();
    }

    /**
     * @return Collection<int, Project>
     */
    public function listUserProjects(User $user, bool $owned = false): Collection
    {
        $query = $user->projects();

        if ($owned) {
            $query->wherePivot('role', ProjectRoleEnum::Owner->value);
        }

        return $query->get();
    }
}
