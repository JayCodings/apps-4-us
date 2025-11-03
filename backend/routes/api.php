<?php

use App\Http\Controllers\Projects\CreateProjectController;
use App\Http\Controllers\Projects\DeleteProjectController;
use App\Http\Controllers\Projects\ListProjectsController;
use App\Http\Controllers\Projects\ShowProjectController;
use App\Http\Controllers\Projects\UpdateProjectController;
use App\Http\Controllers\User\AssignFreeFeatureController;
use App\Http\Controllers\User\UpdatePasswordController;
use App\Http\Controllers\User\UpdateProfileController;
use App\Http\Controllers\Webhooks\ActivateWebhookResponseController;
use App\Http\Controllers\Webhooks\CreateWebhookResponseController;
use App\Http\Controllers\Webhooks\CreateWebhookRouteController;
use App\Http\Controllers\Webhooks\DeleteWebhookResponseController;
use App\Http\Controllers\Webhooks\DeleteWebhookRouteController;
use App\Http\Controllers\Webhooks\GetProjectWebhookLogsController;
use App\Http\Controllers\Webhooks\GetWebhookLogsController;
use App\Http\Controllers\Webhooks\GetWebhookResponsesController;
use App\Http\Controllers\Webhooks\GetWebhookRoutesController;
use App\Http\Controllers\Webhooks\ToggleWebhookRouteActiveController;
use App\Http\Controllers\Webhooks\UpdateWebhookResponseController;
use App\Http\Controllers\Webhooks\UpdateWebhookRouteController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        $user->load('features');
        return new UserResource($user);
    });

    Route::put('/user/profile', UpdateProfileController::class);
    Route::put('/user/password', UpdatePasswordController::class);
    Route::post('/user/features', AssignFreeFeatureController::class);

    Route::get('/projects', ListProjectsController::class);
    Route::get('/projects/{project}', ShowProjectController::class)->middleware('can:view,project');
    Route::post('/projects/{type}', CreateProjectController::class)->middleware('can:create,' . App\Models\Project::class . ',type');
    Route::put('/projects/{project}', UpdateProjectController::class)->middleware('can:update,project');
    Route::delete('/projects/{project}', DeleteProjectController::class)->middleware('can:delete,project');

    Route::middleware('feature:webhook-proxy')->group(function () {
        Route::get('/projects/{project}/webhook-routes', GetWebhookRoutesController::class)->middleware('can:view,project');
        Route::post('/projects/{project}/webhook-routes', CreateWebhookRouteController::class)->middleware('can:create,' . App\Models\WebhookRoute::class . ',project');
        Route::get('/projects/{project}/webhook-logs', GetProjectWebhookLogsController::class)->middleware('can:view,project');

        Route::put('/webhook-routes/{webhookRoute}', UpdateWebhookRouteController::class)->middleware('can:update,webhookRoute');
        Route::delete('/webhook-routes/{webhookRoute}', DeleteWebhookRouteController::class)->middleware('can:delete,webhookRoute');
        Route::put('/webhook-routes/{webhookRoute}/toggle-active', ToggleWebhookRouteActiveController::class)
            ->middleware('can:toggleActive,webhookRoute');

        Route::get('/webhook-routes/{webhookRoute}/responses', GetWebhookResponsesController::class);
        Route::post('/webhook-routes/{webhookRoute}/responses', CreateWebhookResponseController::class)
            ->middleware('can:create,' . App\Models\WebhookResponse::class . ',webhookRoute');
        Route::put('/webhook-responses/{webhookResponse}', UpdateWebhookResponseController::class)
            ->middleware('can:update,webhookResponse');
        Route::delete('/webhook-responses/{webhookResponse}', DeleteWebhookResponseController::class)
            ->middleware('can:delete,webhookResponse');
        Route::put('/webhook-routes/{webhookRoute}/activate/{webhookResponse}', ActivateWebhookResponseController::class)
            ->middleware('can:activate,webhookResponse');

        Route::get('/webhook-routes/{webhookRoute}/logs', GetWebhookLogsController::class);
    });
});
