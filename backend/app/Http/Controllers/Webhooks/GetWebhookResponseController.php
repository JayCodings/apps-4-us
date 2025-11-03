<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Http\Resources\Webhooks\WebhookResponseResource;
use App\Models\WebhookResponse;

class GetWebhookResponseController extends Controller
{
    public function __invoke(WebhookResponse $webhookResponse): WebhookResponseResource
    {
        $webhookResponse->load(['route.project']);

        return new WebhookResponseResource($webhookResponse);
    }
}
