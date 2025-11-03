import useSWR from 'swr';
import { webhooksApi } from '@/lib/api/webhooks';
import type { WebhookLog, PaginatedResponse } from '@/types/webhook';

export function useWebhookLogs(routeId: string, page: number = 1, enableAutoRefresh: boolean = false) {
  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<PaginatedResponse<WebhookLog>>(
    routeId ? `/webhook-routes/${routeId}/logs?page=${page}` : null,
    () => webhooksApi.getLogs(routeId, page),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: enableAutoRefresh ? 5000 : 0,
    }
  );

  return {
    logs: data?.data || [],
    meta: data?.meta,
    links: data?.links,
    isLoading,
    error,
    refresh: mutate,
  };
}
