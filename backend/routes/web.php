<?php

use App\Http\Controllers\Webhooks\HandleWebhookController;
use App\Http\Middleware\ValidateWebhookRequestMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::any('/webhooks/{uuid}', HandleWebhookController::class)->middleware([
    'throttle:webhook',
    ValidateWebhookRequestMiddleware::class,
]);
