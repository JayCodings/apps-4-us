'use client';

import { WebhookRoute } from '@/types/webhook';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useToast } from '@/contexts/ToastContext';
import { useProjects } from '@/hooks/useProjects';
import { useProjectContext } from '@/contexts/ProjectContext';

interface Props {
  route: WebhookRoute;
  projectId: string;
}

export function WebhookRouteCard({ route, projectId }: Props) {
  const { open } = useSlidePanel();
  const { toggleRouteActive } = useWebhooks(projectId);
  const { showToast } = useToast();
  const { getProject } = useProjects();
  const { setProject } = useProjectContext();
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const publicUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/${route.id}`;

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

  const handleToggleActive = async () => {
    try {
      setIsToggling(true);
      await toggleRouteActive(route.id);
      const updatedProject = await getProject(projectId);
      setProject(updatedProject);
    } catch (error) {
      console.error('Failed to toggle webhook route:', error);
      showToast('Failed to toggle webhook route', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-discord-card rounded-lg border border-discord-dark hover:border-discord-lighter hover:bg-discord-hover transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-discord-text-normal">{route.name}</h3>

        <button
          onClick={() => open(`edit-${route.id}`)}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all active:scale-95"
        >
          Manage
        </button>
      </div>

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
    </motion.div>
  );
}
