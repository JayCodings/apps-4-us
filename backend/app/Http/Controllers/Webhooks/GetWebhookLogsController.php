<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookLogResource;
use App\Models\WebhookLog;
use App\Models\WebhookRoute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GetWebhookLogsController extends Controller
{
    public function __invoke(WebhookRoute $webhookRoute, Request $request): AnonymousResourceCollection
    {
        $logs = WebhookLog::query()
            ->where('route_id', $webhookRoute->id)
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        return WebhookLogResource::collection($logs);
    }
}
