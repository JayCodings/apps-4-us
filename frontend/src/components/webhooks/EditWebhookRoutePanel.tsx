'use client';

import { useWebhooks } from '@/hooks/useWebhooks';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useConfirmModal } from '@/contexts/ConfirmModalContext';
import { useToast } from '@/contexts/ToastContext';
import { useProjects } from '@/hooks/useProjects';
import { useProjectContext } from '@/contexts/ProjectContext';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { WebhookRouteForm } from '@/components/webhooks/WebhookRouteForm';

interface EditWebhookRoutePanelProps {
  routeId: string;
  projectId: string;
}

export function EditWebhookRoutePanel({ routeId, projectId }: EditWebhookRoutePanelProps) {
  const { routes, updateRoute, deleteRoute, toggleRouteActive } = useWebhooks(projectId);
  const { close } = useSlidePanel();
  const { showConfirm } = useConfirmModal();
  const { showToast } = useToast();
  const { getProject } = useProjects();
  const { setProject } = useProjectContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const route = routes?.find(r => r.id === routeId);
  const publicUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/${routeId}`;

  const getMethodBadgeStyles = (method: string) => {
    const styles = {
      GET: 'bg-blue-400/10 text-blue-300 border border-blue-400/30',
      POST: 'bg-green-400/10 text-green-300 border border-green-400/30',
      PUT: 'bg-orange-400/10 text-orange-300 border border-orange-400/30',
      PATCH: 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/30',
      DELETE: 'bg-red-400/10 text-red-300 border border-red-400/30',
    };
    return styles[method as keyof typeof styles] || 'bg-indigo-400/10 text-indigo-300 border border-indigo-400/30';
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Webhook URL copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateRoute = async (data: any) => {
    try {
      setIsLoading(true);
      await updateRoute(routeId, data);
      showToast('Webhook route updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update webhook route:', error);
      showToast('Failed to update webhook route', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      setIsToggling(true);
      await toggleRouteActive(routeId);
    } catch (error) {
      console.error('Failed to toggle webhook route:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteRoute = () => {
    showConfirm({
      title: 'Delete Webhook Route',
      message: `Are you sure you want to delete "${route.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteRoute(routeId);
          const updatedProject = await getProject(projectId);
          setProject(updatedProject);
          close();
        } catch (error) {
          console.error('Failed to delete webhook route:', error);
        }
      },
    });
  };

  if (!route) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-discord-dark">
        <h2 className="text-2xl font-bold text-discord-text-normal mb-4">{route.name}</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-discord-dark p-3 rounded-lg flex-1">
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getMethodBadgeStyles(route.method)}`}>
              {route.method}
            </span>
            <code
              onClick={copyUrl}
              className="flex-1 text-sm text-discord-text-muted font-mono truncate cursor-pointer hover:text-discord-text-normal transition-colors"
            >
              {publicUrl}
            </code>
            <button
              onClick={copyUrl}
              className="p-2 hover:bg-discord-hover rounded-lg transition-colors duration-200"
              aria-label="Copy URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-discord-green" />
              ) : (
                <Copy className="w-4 h-4 text-discord-text-muted" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (isToggling || !route.permissions?.can.toggle_active.allowed) return;
                handleToggleActive();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (isToggling || !route.permissions?.can.toggle_active.allowed) return;
                  handleToggleActive();
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                route.is_active ? 'bg-discord-green' : 'bg-discord-gray'
              } ${
                isToggling || !route.permissions?.can.toggle_active.allowed
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              title={
                !route.permissions?.can.toggle_active.allowed
                  ? route.permissions?.can.toggle_active.message
                  : route.is_active
                  ? 'Deactivate webhook'
                  : 'Activate webhook'
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  route.is_active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>

            {!route.permissions?.can.toggle_active.allowed && (
              <div className="group relative">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <div className="absolute right-0 top-6 hidden group-hover:block w-64 p-2 bg-discord-darkest border border-discord-dark rounded-md text-xs text-discord-text-muted z-50">
                  {route.permissions?.can.toggle_active.message}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-discord-dark rounded-xl border border-discord-dark p-6">
            <h3 className="text-xl font-semibold text-discord-text-normal mb-4">
              Route Settings
            </h3>
            <WebhookRouteForm
              initialData={route}
              onSubmit={handleUpdateRoute}
              isLoading={isLoading}
              disabled={!route.permissions?.can.update.allowed}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
