import useSWR from 'swr';
import { webhooksApi } from '@/lib/api/webhooks';
import { useCallback } from 'react';
import type {
  WebhookResponse,
  CreateWebhookResponseData,
  UpdateWebhookResponseData
} from '@/types/webhook';

export function useWebhookResponses(routeId: string) {
  const {
    data: responses,
    error,
    mutate,
    isLoading,
  } = useSWR<WebhookResponse[]>(
    routeId ? `/webhook-routes/${routeId}/responses` : null,
    () => webhooksApi.getResponses(routeId),
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
    responses,
    isLoading,
    error,
    createResponse,
    updateResponse,
    deleteResponse,
    activateResponse,
    refresh: mutate,
  };
}
