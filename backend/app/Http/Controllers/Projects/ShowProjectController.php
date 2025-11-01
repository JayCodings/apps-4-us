<?php

declare(strict_types=1);

namespace App\Http\Controllers\Projects;

use App\Http\Resources\ProjectResource;
use App\Models\Project;

final readonly class ShowProjectController
{
    public function __invoke(Project $project): ProjectResource
    {
        return new ProjectResource($project);
    }
}
