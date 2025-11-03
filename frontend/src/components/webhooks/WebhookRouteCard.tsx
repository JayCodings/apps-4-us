'use client';

import { WebhookRoute } from '@/types/webhook';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle, ExternalLink, FileText, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useToast } from '@/contexts/ToastContext';
import { useProjects } from '@/hooks/useProjects';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useConfirmModal } from '@/contexts/ConfirmModalContext';

interface Props {
  route: WebhookRoute;
  projectId: string;
}

export function WebhookRouteCard({ route, projectId }: Props) {
  const { open } = useSlidePanel();
  const { toggleRouteActive, deleteRoute } = useWebhooks(projectId);
  const { showToast } = useToast();
  const { showConfirm } = useConfirmModal();
  const { getProject } = useProjects();
  const { setProject } = useProjectContext();
  const [copied, setCopied] = useState(false);
  const [copiedProxy, setCopiedProxy] = useState(false);
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
    const wasActive = route.is_active;
    try {
      setIsToggling(true);
      await toggleRouteActive(route.id);
      const updatedProject = await getProject(projectId);
      setProject(updatedProject);
      showToast(
        wasActive ? 'Webhook deactivated successfully' : 'Webhook activated successfully',
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle webhook route:', error);
      showToast('Failed to toggle webhook route', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  const copyProxyUrl = (proxyUrl: string) => {
    navigator.clipboard.writeText(proxyUrl);
    setCopiedProxy(true);
    showToast('Proxy URL copied to clipboard', 'success');
    setTimeout(() => setCopiedProxy(false), 2000);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
          await deleteRoute(route.id);
          const updatedProject = await getProject(projectId);
          setProject(updatedProject);
          showToast('Webhook route deleted successfully', 'success');
        } catch (error) {
          console.error('Failed to delete webhook route:', error);
          showToast('Failed to delete webhook route', 'error');
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-discord-card rounded-lg border border-discord-dark hover:border-discord-lighter hover:bg-white/10 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-discord-text-normal">{route.name}</h3>

        <div className="flex items-center gap-2">
          {route.permissions?.can.delete.allowed ? (
            <button
              onClick={handleDeleteRoute}
              className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors duration-200 group"
              title="Delete webhook"
            >
              <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
            </button>
          ) : (
            <button
              disabled
              title={route.permissions?.can.delete.message || 'Cannot delete webhook'}
              className="p-2 text-red-400/50 rounded-md cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => open(`edit-${route.id}`)}
            className="p-2 text-discord-text-normal hover:bg-white/10 rounded-md transition-colors duration-200 group"
            title="Manage webhook"
          >
            <Settings className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
          </button>
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

      <div className="flex items-center gap-2 bg-discord-dark p-3 rounded-lg">
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

      {/* Active Response Section */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-4 pt-4 border-t border-discord-dark"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-discord-text-muted">Active Response</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open(`logs-${route.id}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-discord-dark text-discord-text-normal border border-discord-lighter rounded-md text-sm font-medium hover:bg-discord-hover transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Logs
            </button>
            <button
              onClick={() => open(`responses-${route.id}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-discord-dark text-discord-text-normal border border-discord-lighter rounded-md text-sm font-medium hover:bg-discord-hover transition-all active:scale-95 group"
            >
              <Settings className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" />
              Manage Responses
            </button>
          </div>
        </div>

        {!route.active_response ? (
          <div className="flex items-center gap-2 text-sm text-discord-text-muted bg-discord-dark/50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span>Keine aktive Response konfiguriert</span>
          </div>
        ) : route.active_response.type === 'proxy' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-discord-text-muted">
              <span className="px-2 py-1 bg-purple-400/10 text-purple-300 border border-purple-400/30 rounded font-medium">
                PROXY
              </span>
              <span>{route.active_response.name}</span>
            </div>
            <div className="flex items-center gap-2 bg-discord-dark p-3 rounded-lg">
              <ExternalLink className="w-4 h-4 text-discord-text-muted flex-shrink-0" />
              <code className="flex-1 text-sm text-discord-text-muted font-mono truncate">
                {route.active_response.proxy_url}
              </code>
              <button
                onClick={() => route.active_response?.proxy_url && copyProxyUrl(route.active_response.proxy_url)}
                className="p-2 hover:bg-discord-hover rounded-lg transition-colors duration-200"
              >
                {copiedProxy ? (
                  <Check className="w-4 h-4 text-discord-green" />
                ) : (
                  <Copy className="w-4 h-4 text-discord-text-muted" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-green-400/10 text-green-300 border border-green-400/30 rounded text-xs font-medium">
                STATIC
              </span>
              <span className="text-xs text-discord-text-muted">{route.active_response.name}</span>
              {route.active_response.status_code && (
                <span className="px-2 py-1 bg-blue-400/10 text-blue-300 border border-blue-400/30 rounded text-xs font-medium">
                  {route.active_response.status_code}
                </span>
              )}
            </div>

            {route.active_response.headers && Object.keys(route.active_response.headers).length > 0 && (
              <div className="bg-discord-dark p-3 rounded-lg">
                <div className="text-xs font-medium text-discord-text-muted mb-2">Headers</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {Object.entries(route.active_response.headers).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-xs">
                      <span className="text-discord-text-muted font-mono">{key}:</span>
                      <span className="text-discord-text-normal font-mono flex-1 break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {route.active_response.body && (
              <div className="bg-discord-dark p-3 rounded-lg">
                <div className="text-xs font-medium text-discord-text-muted mb-2">Body</div>
                <pre className="text-xs text-discord-text-normal font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                  {truncateText(route.active_response.body, 500)}
                </pre>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
