<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\WebhookResponse;
use App\Models\WebhookRoute;
use Components\Projects\Enums\ProjectRoleEnum;
use Illuminate\Auth\Access\Response;

class WebhookResponsePolicy
{
    public function view(User $user, WebhookResponse $webhookResponse): Response
    {
        $isMember = $webhookResponse->route->project->users()
            ->where('user_id', $user->id)
            ->exists();

        return $isMember
            ? Response::allow()
            : Response::deny('You do not have access to this webhook response.');
    }

    public function create(User $user, WebhookRoute $webhookRoute): Response
    {
        $isOwner = $webhookRoute->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        if (!$isOwner) {
            return Response::deny('Only the project owner can create webhook responses.');
        }

        $context = $user->getFeatureContext($webhookRoute->project->type->value);

        if ($context) {
            $maxResponses = (int)($context['max-responses-per-webhook'] ?? config('projects.webhooks.max_responses_per_route'));
            $currentCount = $webhookRoute->responses()->count();

            if ($currentCount >= $maxResponses) {
                return Response::deny('You have reached the maximum of ' . $maxResponses . ' responses for this webhook.');
            }
        }

        return Response::allow();
    }

    public function update(User $user, WebhookResponse $webhookResponse): Response
    {
        $isOwner = $webhookResponse->route->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        return $isOwner
            ? Response::allow()
            : Response::deny('Only the project owner can update webhook responses.');
    }

    public function delete(User $user, WebhookResponse $webhookResponse): Response
    {
        $isOwner = $webhookResponse->route->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        if (!$isOwner) {
            return Response::deny('Only the project owner can delete webhook responses.');
        }

        if ($webhookResponse->route->active_response_id === $webhookResponse->id) {
            return Response::deny('Cannot delete the active response. Please activate another response first.');
        }

        return Response::allow();
    }

    public function activate(User $user, WebhookResponse $webhookResponse): Response
    {
        $isOwner = $webhookResponse->route->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        return $isOwner
            ? Response::allow()
            : Response::deny('Only the project owner can activate webhook responses.');
    }
}
