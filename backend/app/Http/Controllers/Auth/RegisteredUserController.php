<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\EmailVerificationService;
use Components\Projects\Data\ProjectDto;
use Components\Projects\Services\ProjectService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function store(
        Request $request,
        EmailVerificationService $emailVerificationService,
        ProjectService $projectService
    ): JsonResponse {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        if ($emailVerificationService->isVerificationRequired()) {
            $user->sendEmailVerificationNotification();

            return response()->json(new UserResource($user->fresh()), 409);
        }

        return response()->json(new UserResource($user->fresh()));
    }
}

