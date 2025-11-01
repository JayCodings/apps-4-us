<?php

declare(strict_types=1);

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use Components\Projects\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListProjectsController extends Controller
{
    public function __invoke(Request $request, ProjectService $projectService): AnonymousResourceCollection
    {
        $user     = $request->user();
        $projects = $projectService->listUserProjects($user);

        return ProjectResource::collection($projects);
    }
}
