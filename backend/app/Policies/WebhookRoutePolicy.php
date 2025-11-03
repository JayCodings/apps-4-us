<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Models\WebhookRoute;
use Components\Projects\Enums\ProjectRoleEnum;
use Illuminate\Auth\Access\Response;

class WebhookRoutePolicy
{
    public function view(User $user, WebhookRoute $webhookRoute): Response
    {
        $isMember = $webhookRoute->project->users()
            ->where('user_id', $user->id)
            ->exists();

        return $isMember
            ? Response::allow()
            : Response::deny('You do not have access to this webhook route.');
    }

    public function create(User $user, Project $project): Response
    {
        $isOwner = $project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        if (!$isOwner) {
            return Response::deny('Only the project owner can create webhook routes.');
        }

        $context = $user->getFeatureContext($project->type->value);

        if ($context) {
            $maxWebhooks = (int)($context['max-webhooks'] ?? config('projects.webhooks.limit_per_project'));
            $currentCount = $project->webhookRoutes()->count();

            if ($currentCount >= $maxWebhooks) {
                return Response::deny('You have reached the maximum of ' . $maxWebhooks . ' webhooks for this project.');
            }
        }

        return Response::allow();
    }

    public function update(User $user, WebhookRoute $webhookRoute): Response
    {
        $isOwner = $webhookRoute->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        return $isOwner
            ? Response::allow()
            : Response::deny('Only the project owner can update webhook routes.');
    }

    public function delete(User $user, WebhookRoute $webhookRoute): Response
    {
        $isOwner = $webhookRoute->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        return $isOwner
            ? Response::allow()
            : Response::deny('Only the project owner can delete webhook routes.');
    }

    public function toggleActive(User $user, WebhookRoute $webhookRoute): Response
    {
        $isOwner = $webhookRoute->project->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', ProjectRoleEnum::Owner->value)
            ->exists();

        if (!$isOwner) {
            return Response::deny('Only the project owner can activate/deactivate webhook routes.');
        }

        if (!$webhookRoute->active_response_id) {
            return Response::deny('Webhook must have at least one active response before it can be activated.');
        }

        return Response::allow();
    }
}
