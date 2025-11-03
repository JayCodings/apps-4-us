export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type WebhookResponseType = 'static' | 'proxy';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface WebhookRoute {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  method: HttpMethod;
  active_response_id: string | null;
  active_response?: WebhookResponse | null;
  rate_limit_per_minute: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: {
    can: {
      view: { allowed: boolean };
      update: { allowed: boolean };
      delete: { allowed: boolean };
      toggle_active: { allowed: boolean; message?: string };
      create_responses: { allowed: boolean; message?: string };
    };
  };
}

export interface WebhookResponse {
  id: string;
  route_id: string;
  user_id: string;
  name: string;
  type: WebhookResponseType;
  status_code: number | null;
  headers: Record<string, string> | null;
  body: string | null;
  proxy_url: string | null;
  created_at: string;
  updated_at: string;
  permissions?: {
    can: {
      view: { allowed: boolean };
      update: { allowed: boolean };
      delete: { allowed: boolean; message?: string };
      activate: { allowed: boolean };
    };
  };
}

export interface WebhookLog {
  id: string;
  route_id: string;
  route?: WebhookRoute;
  project_id: string;
  user_id: string;
  request_method: string;
  request_url: string;
  request_headers: Record<string, string>;
  request_body: string | null;
  request_ip: string | null;
  response_status: number | null;
  response_headers: Record<string, string> | null;
  response_body: string | null;
  response_type: 'static' | 'proxy' | null;
  response_time_ms: number | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookRouteData {
  name: string;
  method: HttpMethod;
  is_active?: boolean;
}

export interface UpdateWebhookRouteData {
  name: string;
  method: HttpMethod;
  is_active?: boolean;
}

export interface CreateWebhookResponseData {
  name: string;
  type: WebhookResponseType;
  status_code?: number;
  headers?: Record<string, string>;
  body?: string;
  proxy_url?: string;
}

export interface UpdateWebhookResponseData {
  name: string;
  type: WebhookResponseType;
  status_code?: number;
  headers?: Record<string, string>;
  body?: string;
  proxy_url?: string;
}

export interface WebhookReceivedEventData {
  project_id: string;
  route_id: string;
  log_id: string;
}
