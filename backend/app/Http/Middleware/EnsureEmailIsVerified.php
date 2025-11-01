<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\EmailVerificationService;
use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

readonly class EnsureEmailIsVerified
{
    public function __construct(
        private EmailVerificationService $emailVerificationService
    ) {
        //
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$this->emailVerificationService->isVerificationRequired()) {
            return $next($request);
        }

        if (!$request->user() ||
            ($request->user() instanceof MustVerifyEmail &&
            !$request->user()->hasVerifiedEmail())) {
            return response()->json(['message' => 'Your email address is not verified.'], 409);
        }

        return $next($request);
    }
}
