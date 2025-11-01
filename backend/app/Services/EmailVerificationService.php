<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Container\Attributes\Config;

readonly class EmailVerificationService
{
    public function __construct(
        #[Config('auth.verification.required')]
        private bool $verificationRequired = true,
        #[Config('auth.verification.expire')]
        private int $verificationExpire = 60
    ) {
        //
    }

    /**
     * Check if email verification is required
     */
    public function isVerificationRequired(): bool
    {
        return $this->verificationRequired;
    }

    /**
     * Check if a user needs to verify their email
     */
    public function userNeedsVerification(User $user): bool
    {
        return $this->isVerificationRequired() && !$user->hasVerifiedEmail();
    }

    /**
     * Get the verification link expiration time in minutes
     */
    public function getVerificationExpiration(): int
    {
        return $this->verificationExpire;
    }
}