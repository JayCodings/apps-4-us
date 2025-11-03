import useSWR from 'swr';
import { webhooksApi } from '@/lib/api/webhooks';
import { useCallback } from 'react';
import type {
  WebhookRoute,
  CreateWebhookRouteData,
  UpdateWebhookRouteData
} from '@/types/webhook';

export function useWebhooks(projectId: string) {
  const {
    data: routes,
    error,
    mutate,
    isLoading,
  } = useSWR<WebhookRoute[]>(
    projectId ? `/projects/${projectId}/webhook-routes` : null,
    () => webhooksApi.getRoutes(projectId),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  const createRoute = useCallback(
    async (data: CreateWebhookRouteData) => {
      const route = await webhooksApi.createRoute(projectId, data);
      mutate();
      return route;
    },
    [projectId, mutate]
  );

  const updateRoute = useCallback(
    async (routeId: string, data: UpdateWebhookRouteData) => {
      const route = await webhooksApi.updateRoute(routeId, data);
      mutate();
      return route;
    },
    [mutate]
  );

  const deleteRoute = useCallback(
    async (routeId: string) => {
      await webhooksApi.deleteRoute(routeId);
      mutate();
    },
    [mutate]
  );

  const toggleRouteActive = useCallback(
    async (routeId: string) => {
      const route = await webhooksApi.toggleRouteActive(routeId);
      mutate();
      return route;
    },
    [mutate]
  );

  return {
    routes,
    isLoading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    toggleRouteActive,
    refresh: mutate,
  };
}
