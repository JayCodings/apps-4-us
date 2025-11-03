# Frontend Implementierung - Webhook-Proxy

## ✅ Fertiggestellt

- TypeScript Types (`frontend/src/types/webhook.ts`)
- API Client (`frontend/src/lib/api/webhooks.ts`)
- Websocket Client (`frontend/src/lib/websocket.ts`)

## 📋 Noch zu implementieren

### 1. Webhook Hook (`frontend/src/hooks/useWebhooks.ts`)

```typescript
import useSWR from 'swr';
import { webhooksApi } from '@/lib/api/webhooks';
import { useCallback } from 'react';
import type { WebhookRoute, CreateWebhookRouteData, UpdateWebhookRouteData } from '@/types/webhook';

export function useWebhooks(projectId: string) {
  const {
    data: routes,
    error,
    mutate,
    isLoading,
  } = useSWR<WebhookRoute[]>(
    projectId ? `/projects/${projectId}/webhook-routes` : null,
    () => webhooksApi.getRoutes(projectId)
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

  return {
    routes,
    isLoading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    refresh: mutate,
  };
}
```

### 2. Pages

#### a) `frontend/src/app/projects/[id]/webhooks/page.tsx`

```tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useWebhooks } from '@/hooks/useWebhooks';
import { Button } from '@/components/ui/button';
import { WebhookRouteCard } from '@/components/webhooks/WebhookRouteCard';
import { Loader2 } from 'lucide-react';

export default function WebhooksPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { routes, isLoading } = useWebhooks(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-gray-600 mt-2">
            Verwalte deine Webhook-Routen und Responses
          </p>
        </div>
        <Button onClick={() => router.push(`/projects/${projectId}/webhooks/create`)}>
          Neue Route erstellen
        </Button>
      </div>

      {routes && routes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Noch keine Webhook-Routen vorhanden.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {routes?.map((route) => (
            <WebhookRouteCard key={route.id} route={route} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### b) `frontend/src/app/projects/[id]/webhooks/create/page.tsx`

```tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { WebhookRouteForm } from '@/components/webhooks/WebhookRouteForm';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useToast } from '@/contexts/ToastContext';

export default function CreateWebhookPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params.id as string;
  const { createRoute } = useWebhooks(projectId);

  const handleSubmit = async (data: any) => {
    try {
      const route = await createRoute(data);
      toast({ message: 'Webhook-Route erfolgreich erstellt', type: 'success' });
      router.push(`/projects/${projectId}/webhooks/${route.id}`);
    } catch (error) {
      toast({ message: 'Fehler beim Erstellen der Route', type: 'error' });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Neue Webhook-Route</h1>
      <WebhookRouteForm onSubmit={handleSubmit} />
    </div>
  );
}
```

#### c) `frontend/src/app/projects/[id]/webhooks/[routeId]/page.tsx`

```tsx
'use client';

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebhookSettings } from '@/components/webhooks/WebhookSettings';
import { WebhookResponses } from '@/components/webhooks/WebhookResponses';
import { WebhookLogs } from '@/components/webhooks/WebhookLogs';

export default function WebhookDetailPage() {
  const params = useParams();
  const routeId = params.routeId as string;
  const projectId = params.id as string;

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <WebhookSettings routeId={routeId} projectId={projectId} />
        </TabsContent>

        <TabsContent value="responses">
          <WebhookResponses routeId={routeId} />
        </TabsContent>

        <TabsContent value="logs">
          <WebhookLogs routeId={routeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 3. Wichtigste Components

#### a) `WebhookRouteCard` - Zeigt Route-Info mit öffentlicher URL

```tsx
import { WebhookRoute } from '@/types/webhook';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  route: WebhookRoute;
  projectId: string;
}

export function WebhookRouteCard({ route, projectId }: Props) {
  const router = useRouter();
  const publicUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/${route.id}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
  };

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/projects/${projectId}/webhooks/${route.id}`)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{route.name}</h3>
            <Badge variant={route.is_active ? 'success' : 'secondary'}>
              {route.is_active ? 'Aktiv' : 'Inaktiv'}
            </Badge>
            <Badge variant="outline">{route.method}</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Rate Limit: {route.rate_limit_per_minute}/min
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <code className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded">
          {publicUrl}
        </code>
        <Button size="icon" variant="outline" onClick={(e) => {
          e.stopPropagation();
          copyUrl();
        }}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
```

#### b) `WebhookResponseEditor` - Static/Proxy Toggle

```tsx
import { useState } from 'react';
import { WebhookResponseType } from '@/types/webhook';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Props {
  value: any;
  onChange: (data: any) => void;
}

export function WebhookResponseEditor({ value, onChange }: Props) {
  const [type, setType] = useState<WebhookResponseType>(value.type || 'static');

  const handleTypeChange = (newType: WebhookResponseType) => {
    setType(newType);
    onChange({ ...value, type: newType });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Response Type</Label>
        <RadioGroup value={type} onValueChange={handleTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="static" id="static" />
            <Label htmlFor="static">Statische Antwort</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="proxy" id="proxy" />
            <Label htmlFor="proxy">Proxy (Weiterleitung)</Label>
          </div>
        </RadioGroup>
      </div>

      {type === 'static' ? (
        <>
          <div>
            <Label htmlFor="status_code">Status Code</Label>
            <Input
              id="status_code"
              type="number"
              value={value.status_code || 200}
              onChange={(e) => onChange({ ...value, status_code: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={value.body || ''}
              onChange={(e) => onChange({ ...value, body: e.target.value })}
              rows={10}
            />
          </div>
        </>
      ) : (
        <div>
          <Label htmlFor="proxy_url">Proxy URL</Label>
          <Input
            id="proxy_url"
            type="url"
            placeholder="https://example.com/webhook"
            value={value.proxy_url || ''}
            onChange={(e) => onChange({ ...value, proxy_url: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
```

### 4. Websocket Integration (in Layout oder Provider)

```tsx
'use client';

import { useEffect } from 'react';
import { subscribeToWebhooks, unsubscribeFromWebhooks } from '@/lib/websocket';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

export function WebhookNotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const channel = subscribeToWebhooks(user.id, (event) => {
      toast({
        message: 'Neuer Webhook empfangen!',
        type: 'info',
        action: {
          label: 'Ansehen',
          onClick: () => router.push(`/projects/${event.project_id}/webhooks/${event.route_id}`),
        },
      });
    });

    return () => {
      if (user?.id) {
        unsubscribeFromWebhooks(user.id);
      }
    };
  }, [user?.id, toast, router]);

  return <>{children}</>;
}
```

## Installation & Setup

```bash
# Packages wurden bereits installiert (laravel-echo, pusher-js)

# .env Variablen in .env.example nach .env kopieren
cp .env.example .env

# Reverb konfigurieren
docker compose exec backend php artisan reverb:install --no-interaction

# Container neu starten
docker compose down && docker compose up -d
```

## Testing

```bash
# Webhook testen
curl -X POST https://api.apps-4-us.localhost/webhooks/{route-uuid} \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Fehlende ShadCN Components

Falls nicht vorhanden, installieren:
```bash
docker compose exec frontend npx shadcn-ui@latest add button card badge tabs input textarea label radio-group
```
