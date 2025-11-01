<?php

declare(strict_types=1);

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Components\Projects\Services\ProjectService;
use Illuminate\Http\Response;

class DeleteProjectController extends Controller
{
    public function __invoke(
        Project $project,
        ProjectService $projectService
    ): Response {
        $projectService->deleteProject($project);

        return response()->noContent();
    }
}
