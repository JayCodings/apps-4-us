import useSWR from 'swr';
import { webhooksApi } from '@/lib/api/webhooks';
import { useCallback } from 'react';
import type {
  WebhookResponse,
  PaginatedResponse,
  CreateWebhookResponseData,
  UpdateWebhookResponseData
} from '@/types/webhook';

export function useWebhookResponses(routeId: string, page: number = 1) {
  const {
    data,
    error,
    mutate,
    isLoading,
  } = useSWR<PaginatedResponse<WebhookResponse>>(
    routeId ? `/webhook-routes/${routeId}/responses?page=${page}` : null,
    () => webhooksApi.getResponses(routeId, page),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  const createResponse = useCallback(
    async (data: CreateWebhookResponseData) => {
      const response = await webhooksApi.createResponse(routeId, data);
      mutate();
      return response;
    },
    [routeId, mutate]
  );

  const updateResponse = useCallback(
    async (responseId: string, data: UpdateWebhookResponseData) => {
      const response = await webhooksApi.updateResponse(responseId, data);
      mutate();
      return response;
    },
    [mutate]
  );

  const deleteResponse = useCallback(
    async (responseId: string) => {
      await webhooksApi.deleteResponse(responseId);
      mutate();
    },
    [mutate]
  );

  const activateResponse = useCallback(
    async (responseId: string) => {
      await webhooksApi.activateResponse(routeId, responseId);
      mutate();
    },
    [routeId, mutate]
  );

  return {
    responses: data?.data || [],
    meta: data?.meta,
    links: data?.links,
    isLoading,
    error,
    createResponse,
    updateResponse,
    deleteResponse,
    activateResponse,
    refresh: mutate,
  };
}
