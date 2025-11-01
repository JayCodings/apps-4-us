<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\EmailVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationStatusController extends Controller
{
    public function __invoke(Request $request, EmailVerificationService $emailVerificationService): JsonResponse
    {
        return response()->json([
            'verification_required' => $emailVerificationService->isVerificationRequired(),
            'user_verified' => $request->user() ? $request->user()->hasVerifiedEmail() : null,
        ]);
    }
}