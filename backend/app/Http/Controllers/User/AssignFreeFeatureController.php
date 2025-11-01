<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignFreeFeatureRequest;
use App\Http\Resources\UserResource;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AssignFreeFeatureController extends Controller
{
    public function __invoke(AssignFreeFeatureRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($user->features()->count() > 0) {
            return response()->json([
                'message' => 'You already have features assigned. Free feature selection is only available for new users.',
            ], Response::HTTP_FORBIDDEN);
        }

        $feature = Feature::where('name', $validated['feature'])->firstOrFail();

        $user->features()->attach($feature->id, [
            'context' => json_encode(['max-projects' => 1]),
        ]);

        $user->load('features');

        return response()->json(new UserResource($user));
    }
}
