<?php

use App\Http\Controllers\Webhooks\HandleWebhookController;
use App\Http\Middleware\ValidateWebhookRequestMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(config('app.frontend_url'));
});

Route::any('/webhooks/{uuid}', HandleWebhookController::class)->middleware([
    'throttle:webhook',
    ValidateWebhookRequestMiddleware::class,
]);
