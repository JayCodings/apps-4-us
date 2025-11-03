'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useSlidePanelRegistry } from '@/hooks/useSlidePanelRegistry';
import { useProjectContext } from '@/contexts/ProjectContext';
import { WebhookRouteCard } from '@/components/webhooks/WebhookRouteCard';
import { CreateWebhookRoutePanel } from '@/components/webhooks/CreateWebhookRoutePanel';
import { EditWebhookRoutePanel } from '@/components/webhooks/EditWebhookRoutePanel';
import { WebhookResponseCreationFlow } from '@/components/WebhookResponseCreationFlow';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function WebhooksPage() {
  const params = useParams();
  const projectId = params.id as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { project } = useProjectContext();
  const { routes, isLoading } = useWebhooks(projectId);
  const { open } = useSlidePanel();

  const [showCreateResponseModal, setShowCreateResponseModal] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const canCreateWebhooks = project?.permissions?.can?.create_webhooks?.allowed ?? false;
  const createWebhooksMessage = project?.permissions?.can?.create_webhooks?.message;

  useEffect(() => {
    const action = searchParams.get('action');
    const routeId = searchParams.get('routeId');

    if (action === 'create-webhook-response' && routeId) {
      setSelectedRouteId(routeId);
      setShowCreateResponseModal(true);
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setShowCreateResponseModal(false);
    setSelectedRouteId(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('action');
    params.delete('routeId');
    const newSearch = params.toString();
    router.replace(newSearch ? `/projects/${projectId}/webhooks?${newSearch}` : `/projects/${projectId}/webhooks`);
  };

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
    });

    return panelConfig;
  }, [routes, projectId]);

  useSlidePanelRegistry(panels);

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
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4" />
          Create Route
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

      {showCreateResponseModal && selectedRouteId && (
        <WebhookResponseCreationFlow
          routeId={selectedRouteId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
