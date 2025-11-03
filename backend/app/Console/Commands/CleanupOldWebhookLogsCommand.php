<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\WebhookLog;
use App\Models\WebhookRoute;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupOldWebhookLogsCommand extends Command
{
    protected $signature = 'webhooks:cleanup-logs';

    protected $description = 'Delete old webhook logs, keeping only the last 100 per route';

    public function handle(): int
    {
        $this->info('Starting webhook logs cleanup...');

        $routes = WebhookRoute::all();
        $totalDeleted = 0;

        foreach ($routes as $route) {
            $logsToKeep = WebhookLog::query()
                ->where('route_id', $route->id)
                ->orderBy('created_at', 'desc')
                ->limit(100)
                ->pluck('id');

            $deleted = WebhookLog::query()
                ->where('route_id', $route->id)
                ->whereNotIn('id', $logsToKeep)
                ->delete();

            if ($deleted > 0) {
                $this->line("Route {$route->name} ({$route->id}): Deleted {$deleted} logs");
                $totalDeleted += $deleted;
            }
        }

        $this->info("Cleanup complete. Total logs deleted: {$totalDeleted}");

        return Command::SUCCESS;
    }
}
