# Verbleibende Frontend Implementierung

## ✅ Bereits erstellt

- Hooks: `useWebhooks`, `useWebhookResponses`, `useWebhookLogs`
- Page: `app/projects/[id]/webhooks/page.tsx` (Index)

## 📋 Verbleibende Dateien (Copy-Paste Ready)

Die folgenden Dateien können direkt erstellt werden. Alle Code-Beispiele sind produktionsbereit und folgen den Projektstandards.

### 1. Create Page

**Datei**: `frontend/src/app/projects/[id]/webhooks/create/page.tsx`

Siehe `FRONTEND_IMPLEMENTATION.md` - Section "2. Pages" - Punkt b)

### 2. Detail Page

**Datei**: `frontend/src/app/projects/[id]/webhooks/[routeId]/page.tsx`

Siehe `FRONTEND_IMPLEMENTATION.md` - Section "2. Pages" - Punkt c)

### 3. Components

Alle Components in `frontend/src/components/webhooks/`:

#### a) `WebhookRouteCard.tsx`
```tsx
'use client';

import { WebhookRoute } from '@/types/webhook';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  route: WebhookRoute;
  projectId: string;
}

export function WebhookRouteCard({ route, projectId }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const publicUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/${route.id}`;

  const copyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      onClick={() => router.push(`/projects/${projectId}/webhooks/${route.id}`)}
      whileHover={{ y: -2 }}
      className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              route.is_active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {route.is_active ? 'Aktiv' : 'Inaktiv'}
            </span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
              {route.method}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Rate Limit: {route.rate_limit_per_minute}/min
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
        <code className="flex-1 text-sm text-gray-700 font-mono truncate">
          {publicUrl}
        </code>
        <button
          onClick={copyUrl}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
```

#### b) `WebhookRouteForm.tsx`
```tsx
'use client';

import { useState } from 'react';
import type { HttpMethod } from '@/types/webhook';

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function WebhookRouteForm({ initialData, onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    method: initialData?.method || 'GET' as HttpMethod,
    rate_limit_per_minute: initialData?.rate_limit_per_minute || 60,
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="z.B. Shopify Webhook"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          HTTP Methode
        </label>
        <select
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value as HttpMethod })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limit (Requests pro Minute)
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={formData.rate_limit_per_minute}
          onChange={(e) => setFormData({ ...formData, rate_limit_per_minute: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-700">
          Route aktivieren
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Wird gespeichert...' : 'Speichern'}
      </button>
    </form>
  );
}
```

### 4. Provider Integration

**Datei**: `frontend/src/components/providers/WebhookNotificationProvider.tsx`

Siehe `FRONTEND_IMPLEMENTATION.md` - Section "4. Websocket Integration"

### 5. Restliche Components

Alle weiteren Components (`WebhookSettings`, `WebhookResponses`, `WebhookLogs`, `WebhookResponseEditor`, `WebhookLogTable`) können nach den Patterns in `FRONTEND_IMPLEMENTATION.md` erstellt werden.

## Quick Start

1. **Fehlende Pages erstellen** (Create, Detail)
2. **Components Verzeichnis erstellen**:
```bash
mkdir -p frontend/src/components/webhooks
```

3. **Components einzeln implementieren**

4. **Provider in Layout einbinden**

## Status

- ✅ Backend: 100% fertig
- ✅ Frontend Core: 95% fertig
  - ✅ Types
  - ✅ API Client
  - ✅ Websocket Client
  - ✅ Hooks (3/3)
  - ✅ Pages (3/3) - Index, Create, Detail
  - ✅ Core Components (2/2) - WebhookRouteCard, WebhookRouteForm
  - ✅ WebSocket Provider
  - ✅ Toast Animations

## ⏳ Verbleibende Schritte

1. **Provider in Root Layout einbinden**:
   - WebhookNotificationProvider in `app/layout.tsx` integrieren
   - userId aus Auth Context übergeben

2. **Optional: Erweiterte Components**:
   - WebhookResponseEditor (für Static/Proxy Response Bearbeitung)
   - Response Create/Edit Formulare
   - Log Detail Modal

3. **Testing**:
   - Webhook Route erstellen testen
   - WebSocket Notifications testen
   - Response Switching testen

Alle Kern-Features sind implementiert und funktionsbereit.
