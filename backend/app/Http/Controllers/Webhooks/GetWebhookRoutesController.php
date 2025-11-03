<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookRouteResource;
use App\Models\Project;
use App\Models\WebhookRoute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GetWebhookRoutesController extends Controller
{
    public function __invoke(Project $project, Request $request): AnonymousResourceCollection
    {
        $routes = WebhookRoute::query()
            ->where('project_id', $project->id)
            ->get();

        return WebhookRouteResource::collection($routes);
    }
}
