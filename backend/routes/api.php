<?php

use App\Http\Controllers\Projects\CreateProjectController;
use App\Http\Controllers\Projects\DeleteProjectController;
use App\Http\Controllers\Projects\ListProjectsController;
use App\Http\Controllers\Projects\ShowProjectController;
use App\Http\Controllers\User\AssignFreeFeatureController;
use App\Http\Controllers\User\UpdatePasswordController;
use App\Http\Controllers\User\UpdateProfileController;
use App\Http\Controllers\User\UpdateProjectController;
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
});
