<?php

declare(strict_types=1);

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Components\Projects\Data\ProjectDto;
use Components\Projects\Services\ProjectService;
use Illuminate\Http\JsonResponse;

class UpdateProjectController extends Controller
{
    public function __invoke(
        UpdateProjectRequest $request,
        Project $project,
        ProjectService $projectService
    ): JsonResponse {
        $validated = $request->validated();

        $dto = new ProjectDto(
            type: $project->type,
            name: $validated['name'],
            description: $validated['description'] ?? null
        );

        $updatedProject = $projectService->updateProject($project, $dto);

        return response()->json(new ProjectResource($updatedProject));
    }
}
