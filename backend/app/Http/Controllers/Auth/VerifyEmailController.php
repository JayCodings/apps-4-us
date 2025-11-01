<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash): JsonResponse
    {
        // Get the authenticated user
        $authUser = $request->user();

        // Verify that the authenticated user matches the verification ID
        if (!$authUser || $authUser->id != $id) {
            return response()->json([
                'message' => 'Unauthorized. Please login to verify your email.'
            ], 401);
        }

        // Check if the hash matches
        if (!hash_equals($hash, sha1($authUser->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Invalid verification link.'
            ], 400);
        }

        // Check if already verified
        if ($authUser->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.',
                'verified' => true
            ], 200);
        }

        // Mark as verified
        if ($authUser->markEmailAsVerified()) {
            event(new Verified($authUser));
        }

        return response()->json([
            'message' => 'Email verified successfully.',
            'verified' => true
        ], 200);
    }
}