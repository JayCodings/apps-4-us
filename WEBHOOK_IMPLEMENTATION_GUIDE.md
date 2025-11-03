# Webhook-Proxy System - Implementierungsguide

## ✅ Fertiggestellt

### Backend (100%)
- ✅ Datenbank Migrations (4 Tabellen)
- ✅ Models (WebhookRoute, WebhookResponse, WebhookLog)
- ✅ Enums (WebhookMethodEnum, WebhookResponseTypeEnum)
- ✅ DTOs (5 Data Transfer Objects)
- ✅ Services (5 Services inkl. Security, Executor, Logger)
- ✅ Controllers (10 Controller für CRUD + Public Handler)
- ✅ FormRequests (4 Validation Requests)
- ✅ Resources (3 JSON Resources)
- ✅ Event (WebhookReceivedEvent für Broadcasting)
- ✅ Middleware (ValidateWebhookRequestMiddleware)
- ✅ Command (CleanupOldWebhookLogsCommand)
- ✅ Routes (authentifiziert + public)
- ✅ Services im AppServiceProvider registriert

### Infrastructure (100%)
- ✅ .env.example mit Reverb-Konfiguration
- ✅ docker-compose.yml mit Reverb-Service
- ✅ SSL-Zertifikate (via createSSL.sh generierbar)
- ✅ Migrations ausgeführt

## 📋 Noch zu erledigen

### 1. ENV-Setup
```bash
# .env.example nach .env kopieren falls noch nicht geschehen
cp .env.example .env

# SSL-Zertifikate generieren
./createSSL.sh

# Docker Container neu starten
docker compose down
docker compose up -d
```

### 2. Laravel Reverb Konfiguration
Die Reverb-Konfigurationsdateien müssen noch publiziert werden:
```bash
docker compose exec backend php artisan reverb:install --no-interaction
```

### 3. Frontend Implementation

#### 3.1 API Client (`frontend/src/lib/api/webhooks.ts`)
```typescript
import { apiClient } from './client';

export interface WebhookRoute {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  active_response_id: string | null;
  rate_limit_per_minute: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookResponse {
  id: string;
  route_id: string;
  user_id: string;
  name: string;
  type: 'static' | 'proxy';
  status_code: number | null;
  headers: Record<string, string> | null;
  body: string | null;
  proxy_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  route_id: string;
  user_id: string;
  request_method: string;
  request_url: string;
  request_headers: Record<string, any>;
  request_body: string | null;
  response_status: number | null;
  response_headers: Record<string, any> | null;
  response_body: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export const webhooksApi = {
  // Routes
  getRoutes: (projectId: string) =>
    apiClient.get<WebhookRoute[]>(`/projects/${projectId}/webhook-routes`),

  createRoute: (projectId: string, data: {
    name: string;
    method: string;
    rate_limit_per_minute?: number;
    is_active?: boolean;
  }) =>
    apiClient.post<WebhookRoute>(`/projects/${projectId}/webhook-routes`, data),

  updateRoute: (routeId: string, data: {
    name: string;
    method: string;
    rate_limit_per_minute?: number;
    is_active?: boolean;
  }) =>
    apiClient.put<WebhookRoute>(`/webhook-routes/${routeId}`, data),

  deleteRoute: (routeId: string) =>
    apiClient.delete(`/webhook-routes/${routeId}`),

  // Responses
  getResponses: (routeId: string) =>
    apiClient.get<WebhookResponse[]>(`/webhook-routes/${routeId}/responses`),

  createResponse: (routeId: string, data: {
    name: string;
    type: 'static' | 'proxy';
    status_code?: number;
    headers?: Record<string, string>;
    body?: string;
    proxy_url?: string;
  }) =>
    apiClient.post<WebhookResponse>(`/webhook-routes/${routeId}/responses`, data),

  updateResponse: (responseId: string, data: any) =>
    apiClient.put<WebhookResponse>(`/webhook-responses/${responseId}`, data),

  deleteResponse: (responseId: string) =>
    apiClient.delete(`/webhook-responses/${responseId}`),

  activateResponse: (routeId: string, responseId: string) =>
    apiClient.put(`/webhook-routes/${routeId}/activate/${responseId}`),

  // Logs
  getLogs: (routeId: string) =>
    apiClient.get<WebhookLog[]>(`/webhook-routes/${routeId}/logs`),
};
```

#### 3.2 Websocket Setup (`frontend/src/lib/websocket.ts`)
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
  wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
  forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`, // Implement getAuthToken()
    },
  },
});

export function subscribeToWebhooks(userId: string, onWebhookReceived: (data: any) => void) {
  return echo
    .private(`user.${userId}`)
    .listen('WebhookReceived', onWebhookReceived);
}
```

#### 3.3 Pages

**`frontend/src/app/projects/[id]/webhooks/page.tsx`**
- Liste aller Webhook-Routes für das Projekt
- Button "Neue Route erstellen"
- Zeigt für jede Route: Name, Methode, Status, öffentliche URL
- Click auf Route → Weiterleitung zu Detail-Seite

**`frontend/src/app/projects/[id]/webhooks/create/page.tsx`**
- Formular: Name, HTTP-Methode, Rate Limit
- Nach Erstellung → Redirect zu Route-Detail

**`frontend/src/app/projects/[id]/webhooks/[routeId]/page.tsx`**
- Tabs: "Einstellungen", "Responses", "Logs"
- Tab "Einstellungen": Route bearbeiten, aktivieren/deaktivieren
- Tab "Responses": Liste der Responses, Active-Marker, Response erstellen/bearbeiten/löschen
- Tab "Logs": Log-Tabelle mit Pagination

#### 3.4 Components

**`frontend/src/components/webhooks/WebhookRouteCard.tsx`**
- Zeigt Route-Info (Name, Methode, Status)
- Kopier-Button für öffentliche URL
- Status-Badge (aktiv/inaktiv)

**`frontend/src/components/webhooks/WebhookRouteForm.tsx`**
- Form für Create/Update
- Felder: Name, Methode (Dropdown), Rate Limit, is_active (Toggle)

**`frontend/src/components/webhooks/WebhookResponseEditor.tsx`**
- Toggle: Static vs Proxy
- Static: Status Code, Headers (Key-Value Editor), Body (Textarea)
- Proxy: Proxy URL

**`frontend/src/components/webhooks/WebhookLogTable.tsx`**
- Tabelle: Zeitstempel, Methode, Status, Error
- Click auf Zeile → Modal mit vollständigen Details
- Filter: Nur Errors anzeigen

**`frontend/src/components/webhooks/WebhookNotification.tsx`**
- Toast-Benachrichtigung bei neuem Webhook
- Nutzt Websocket-Events
- Link zu Log-Detail

#### 3.5 NPM Packages installieren
```bash
docker compose exec frontend npm install laravel-echo pusher-js
```

### 4. Cron Job für Cleanup
In `backend/app/Console/Kernel.php`:
```php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('webhooks:cleanup-logs')->daily();
}
```

### 5. Testing

#### Backend Tests
```bash
docker compose exec backend php artisan test
```

#### Frontend Tests
```bash
docker compose exec frontend npm test
```

#### Manual Tests
1. Projekt mit Type "webhook-proxy" erstellen
2. Webhook-Route erstellen
3. Static Response konfigurieren
4. Public URL mit curl/Postman testen:
   ```bash
   curl -X POST https://api.apps-4-us.localhost/webhooks/{route-uuid} \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```
5. Logs im Frontend prüfen
6. Proxy Response konfigurieren (z.B. zu httpbin.org)
7. Websocket-Benachrichtigungen testen

## Sicherheitsfeatures (Implementiert)

✅ SSRF-Protection (blockt localhost, private IPs, Docker-interne Hosts)
✅ Rate Limiting (configurable per Route, default 60/min)
✅ Request Size Limit (1MB)
✅ Keine File-Uploads (Content-Type Blocking)
✅ Keine Stream-Wrapper (file://, php://, data://)
✅ Feature-Gate (nur User mit "webhook-proxy" Feature)
✅ Error Logging für Debugging

## API Endpoints

### Authentifiziert (auth:sanctum + feature:webhook-proxy)
- GET    `/api/projects/{project}/webhook-routes`
- POST   `/api/projects/{project}/webhook-routes`
- PUT    `/api/webhook-routes/{id}`
- DELETE `/api/webhook-routes/{id}`
- GET    `/api/webhook-routes/{id}/responses`
- POST   `/api/webhook-routes/{id}/responses`
- PUT    `/api/webhook-responses/{id}`
- DELETE `/api/webhook-responses/{id}`
- PUT    `/api/webhook-routes/{id}/activate/{responseId}`
- GET    `/api/webhook-routes/{id}/logs`

### Public
- ANY `/api/webhooks/{uuid}` (ValidateWebhookRequestMiddleware)

## Öffentliche Webhook-URL
```
https://api.apps-4-us.localhost/webhooks/{route-uuid}
```
Die UUID ist gleichzeitig die ID der webhook_routes Tabelle.

## Database Schema

### webhook_routes
- id (UUID, primary)
- project_id (UUID FK)
- user_id (UUID FK)
- name (string)
- method (string: GET, POST, etc.)
- active_response_id (UUID, nullable FK)
- rate_limit_per_minute (int, default 60)
- is_active (boolean, default true)
- timestamps

### webhook_responses
- id (UUID, primary)
- route_id (UUID FK, cascade)
- user_id (UUID FK)
- name (string)
- type (string: 'static' | 'proxy')
- status_code (int, nullable)
- headers (JSON, nullable)
- body (text, nullable)
- proxy_url (string, nullable)
- timestamps

### webhook_logs
- id (UUID, primary)
- route_id (UUID FK, cascade)
- user_id (UUID FK)
- request_method (string)
- request_url (text)
- request_headers (JSON)
- request_body (text, nullable)
- response_status (int, nullable)
- response_headers (JSON, nullable)
- response_body (text, nullable)
- error (text, nullable)
- timestamps
- Index: (route_id, created_at)

Max. 100 Logs per Route (auto-cleanup via Cron)
