import useSWR from 'swr';
import { webhooksApi } from '@/lib/api/webhooks';
import type { WebhookLog } from '@/types/webhook';

export function useWebhookLogs(routeId: string) {
  const {
    data: logs,
    error,
    mutate,
    isLoading,
  } = useSWR<WebhookLog[]>(
    routeId ? `/webhook-routes/${routeId}/logs` : null,
    () => webhooksApi.getLogs(routeId),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 5000, // Auto-refresh every 5 seconds
    }
  );

  return {
    logs,
    isLoading,
    error,
    refresh: mutate,
  };
}
