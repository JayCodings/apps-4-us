'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useSlidePanelRegistry } from '@/hooks/useSlidePanelRegistry';
import { useActionModalRegistry } from '@/hooks/useActionModalRegistry';
import { useActionModalContext } from '@/contexts/ActionModalContext';
import { useProjectContext } from '@/contexts/ProjectContext';
import { WebhookRouteCard } from '@/components/webhooks/WebhookRouteCard';
import { CreateWebhookRoutePanel } from '@/components/webhooks/CreateWebhookRoutePanel';
import { EditWebhookRoutePanel } from '@/components/webhooks/EditWebhookRoutePanel';
import { WebhookLogsPanel } from '@/components/webhooks/WebhookLogsPanel';
import { WebhookResponseCreationFlow } from '@/components/WebhookResponseCreationFlow';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function WebhooksPage() {
  const params = useParams();
  const projectId = params.id as string;
  const searchParams = useSearchParams();
  const { project } = useProjectContext();
  const { routes, isLoading, refresh } = useWebhooks(projectId);
  const { open } = useSlidePanel();
  const { closeAction } = useActionModalContext();

  const canCreateWebhooks = project?.permissions?.can?.create_webhooks?.allowed ?? false;
  const createWebhooksMessage = project?.permissions?.can?.create_webhooks?.message;

  const routeId = searchParams.get('routeId');

  const handleCloseModal = useCallback(async () => {
    await refresh();
    closeAction();
  }, [refresh, closeAction]);

  const panels = useMemo(() => {
    const panelConfig: Record<string, { title: string; content: React.ReactNode }> = {
      createWebhookRoute: {
        title: "Create Webhook Route",
        content: <CreateWebhookRoutePanel />,
      },
    };

    routes?.forEach(route => {
      panelConfig[`edit-${route.id}`] = {
        title: route.name,
        content: <EditWebhookRoutePanel routeId={route.id} projectId={projectId} />,
      };
      panelConfig[`logs-${route.id}`] = {
        title: `${route.name} - Logs`,
        content: <WebhookLogsPanel routeId={route.id} routeName={route.name} />,
      };
    });

    return panelConfig;
  }, [routes, projectId]);

  const actionModals = useMemo(() => {
    if (!routeId) return {};

    return {
      'create-response': {
        content: <WebhookResponseCreationFlow routeId={routeId} onClose={handleCloseModal} />,
      },
    };
  }, [routeId, handleCloseModal]);

  useSlidePanelRegistry(panels);
  useActionModalRegistry(actionModals);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-discord-text-normal">Webhooks</h1>
          <p className="text-discord-text-muted mt-1">
            Manage your webhook routes and responses
          </p>
        </div>
        <button
          onClick={() => open('createWebhookRoute')}
          disabled={!canCreateWebhooks}
          title={!canCreateWebhooks ? createWebhooksMessage : undefined}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 group"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          Add Webhook
        </button>
      </motion.div>

      {routes && routes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16 bg-discord-card rounded-lg border-2 border-dashed border-discord-dark"
        >
          <p className="text-discord-text-muted text-lg">No webhook routes yet.</p>
          <p className="text-discord-text-muted opacity-70 mt-2">Create your first route to get started.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {routes?.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <WebhookRouteCard route={route} projectId={projectId} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
