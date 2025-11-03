<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookLogResource;
use App\Models\Project;
use App\Models\WebhookLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GetProjectWebhookLogsController extends Controller
{
    public function __invoke(Project $project, Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'page' => 'nullable|integer|min:1',
        ]);

        $logs = WebhookLog::query()
            ->where('project_id', $project->id)
            ->with('route')
            ->orderBy('created_at', 'desc')
            ->paginate(30);

        return WebhookLogResource::collection($logs);
    }
}
