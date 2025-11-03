<?php

declare(strict_types=1);

return [
    'max_projects_per_type' => (int) env('MAX_PROJECTS_PER_TYPE'),
    'webhooks' => [
        'rate_limit_default' => (int) env('WEBHOOK_RATE_LIMIT_DEFAULT'),
        'max_request_size_kb' => (int) env('WEBHOOK_MAX_REQUEST_SIZE_KB'),
        'limit_per_project' => (int) env('MAX_WEBHOOKS_PER_PROJECT'),
        'max_responses_per_route' => (int) env('MAX_RESPONSES_PER_WEBHOOK_ROUTE', 3),
    ],
];
