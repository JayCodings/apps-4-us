<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

final class UpdatePasswordController extends Controller
{
    public function __invoke(UpdatePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user      = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'The provided password does not match your current password.',
                'errors' => [
                    'current_password' => ['The provided password does not match your current password.'],
                ],
            ], 422);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
