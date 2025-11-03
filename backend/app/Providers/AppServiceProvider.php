<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\EmailVerificationService::class);
        $this->app->singleton(\Components\Projects\Services\ProjectService::class);
        $this->app->singleton(\Components\Webhooks\Services\WebhookSecurityService::class);
        $this->app->singleton(\Components\Webhooks\Services\WebhookLoggerService::class);
        $this->app->singleton(\Components\Webhooks\Services\WebhookExecutorService::class);
        $this->app->singleton(\Components\Webhooks\Services\WebhookRouteService::class);
        $this->app->singleton(\Components\Webhooks\Services\WebhookResponseService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Http\Resources\Json\JsonResource::withoutWrapping();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        VerifyEmail::createUrlUsing(function (object $notifiable) {
            $frontendUrl = config('app.frontend_url');
            $verifyUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'verification.verify',
                \Illuminate\Support\Carbon::now()->addMinutes(config('auth.verification.expire')),
                ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
            );

            // Extract token from backend URL and redirect to frontend
            $parsedUrl = parse_url($verifyUrl);
            parse_str($parsedUrl['query'] ?? '', $queryParams);

            return $frontendUrl . '/email-verify?' . http_build_query([
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
                'expires' => $queryParams['expires'] ?? '',
                'signature' => $queryParams['signature'] ?? ''
            ]);
        });

        RateLimiter::for('webhook', function (Request $request) {
            $uuid = $request->route('uuid');

            return Limit::perMinute(config('projects.webhooks.rate_limit_default'))
                ->by('webhook:' . $uuid)
                ->response(function (Request $request, array $headers) {
                    return response('Too many requests. Please try again later.', 429, $headers);
                });
        });
    }
}
