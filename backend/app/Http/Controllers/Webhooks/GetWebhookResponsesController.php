<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookResponseResource;
use App\Models\WebhookResponse;
use App\Models\WebhookRoute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GetWebhookResponsesController extends Controller
{
    public function __invoke(WebhookRoute $webhookRoute, Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'page' => 'nullable|integer|min:1',
        ]);

        $responses = WebhookResponse::query()
            ->where('route_id', $webhookRoute->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return WebhookResponseResource::collection($responses);
    }
}
