import axios from '../axios';
import type {
  WebhookRoute,
  WebhookResponse,
  WebhookLog,
  CreateWebhookRouteData,
  UpdateWebhookRouteData,
  CreateWebhookResponseData,
  UpdateWebhookResponseData,
} from '@/types/webhook';

export const webhooksApi = {
  // Webhook Routes
  getRoutes: async (projectId: string) => {
    const { data } = await axios.get<WebhookRoute[]>(`/api/projects/${projectId}/webhook-routes`);
    return data;
  },

  createRoute: async (projectId: string, payload: CreateWebhookRouteData) => {
    const { data } = await axios.post<WebhookRoute>(`/api/projects/${projectId}/webhook-routes`, payload);
    return data;
  },

  updateRoute: async (routeId: string, payload: UpdateWebhookRouteData) => {
    const { data } = await axios.put<WebhookRoute>(`/api/webhook-routes/${routeId}`, payload);
    return data;
  },

  deleteRoute: async (routeId: string) => {
    await axios.delete(`/api/webhook-routes/${routeId}`);
  },

  toggleRouteActive: async (routeId: string) => {
    const { data } = await axios.put<WebhookRoute>(`/api/webhook-routes/${routeId}/toggle-active`);
    return data;
  },

  // Webhook Responses
  getResponses: async (routeId: string) => {
    const { data } = await axios.get<WebhookResponse[]>(`/api/webhook-routes/${routeId}/responses`);
    return data;
  },

  createResponse: async (routeId: string, payload: CreateWebhookResponseData) => {
    const { data } = await axios.post<WebhookResponse>(`/api/webhook-routes/${routeId}/responses`, payload);
    return data;
  },

  updateResponse: async (responseId: string, payload: UpdateWebhookResponseData) => {
    const { data } = await axios.put<WebhookResponse>(`/api/webhook-responses/${responseId}`, payload);
    return data;
  },

  deleteResponse: async (responseId: string) => {
    await axios.delete(`/api/webhook-responses/${responseId}`);
  },

  activateResponse: async (routeId: string, responseId: string) => {
    const { data } = await axios.put<WebhookRoute>(`/api/webhook-routes/${routeId}/activate/${responseId}`);
    return data;
  },

  // Webhook Logs
  getLogs: async (routeId: string) => {
    const { data} = await axios.get<WebhookLog[]>(`/api/webhook-routes/${routeId}/logs`);
    return data;
  },
};
