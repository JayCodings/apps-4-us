<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;

final class UpdateProfileController extends Controller
{
    public function __invoke(UpdateProfileRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user      = $request->user();

        $user->fill($validated);
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
