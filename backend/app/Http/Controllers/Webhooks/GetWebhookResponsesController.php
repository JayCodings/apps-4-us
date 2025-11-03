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
        $responses = WebhookResponse::query()
            ->where('route_id', $webhookRoute->id)
            ->get();

        return WebhookResponseResource::collection($responses);
    }
}
