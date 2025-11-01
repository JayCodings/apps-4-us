<?php

declare(strict_types=1);

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use Components\Projects\Data\ProjectDto;
use Components\Projects\Services\ProjectService;
use Illuminate\Http\JsonResponse;

class CreateProjectController extends Controller
{
    public function __invoke(
        StoreProjectRequest $request,
        ProjectService $projectService
    ): JsonResponse {
        $user      = $request->user();
        $validated = $request->validated();

        $dto = new ProjectDto(
            name: $validated['name'],
            description: $validated['description'] ?? null
        );

        $project = $projectService->createProject($user, $dto);

        return response()->json(new ProjectResource($project), 201);
    }
}
