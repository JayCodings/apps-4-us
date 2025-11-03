'use client';

import { useWebhooks } from '@/hooks/useWebhooks';
import { useWebhookResponses } from '@/hooks/useWebhookResponses';
import { useWebhookLogs } from '@/hooks/useWebhookLogs';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useConfirmModal } from '@/contexts/ConfirmModalContext';
import { useToast } from '@/contexts/ToastContext';
import { useProjects } from '@/hooks/useProjects';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, FileText, Activity, Copy, Check, AlertCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { WebhookRouteForm } from '@/components/webhooks/WebhookRouteForm';

type TabType = 'settings' | 'responses' | 'logs';

interface EditWebhookRoutePanelProps {
  routeId: string;
  projectId: string;
}

export function EditWebhookRoutePanel({ routeId, projectId }: EditWebhookRoutePanelProps) {
  const { routes, updateRoute, deleteRoute, toggleRouteActive } = useWebhooks(projectId);
  const { responses, deleteResponse, activateResponse } = useWebhookResponses(routeId);
  const { logs } = useWebhookLogs(routeId);
  const { close } = useSlidePanel();
  const { showConfirm } = useConfirmModal();
  const { showToast } = useToast();
  const { getProject } = useProjects();
  const { setProject } = useProjectContext();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('settings');
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

  const tabs = [
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    { id: 'responses' as TabType, label: 'Responses', icon: FileText },
    { id: 'logs' as TabType, label: 'Logs', icon: Activity },
  ];

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

      <div className="border-b border-discord-dark px-6">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-discord-text-muted hover:text-discord-text-normal'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {activeTab === 'settings' && (
            <div>
              <div className="bg-discord-card rounded-xl border border-discord-dark p-6 mb-6">
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

              {route.permissions?.can.delete.allowed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="pt-8 border-t border-discord-dark"
                >
                  <h2 className="text-xl font-bold text-discord-text-normal mb-2">
                    Danger Zone
                  </h2>
                  <p className="text-discord-text-muted mb-4">
                    Once you delete a webhook route, there is no going back. Please be certain.
                  </p>

                  <button
                    type="button"
                    onClick={handleDeleteRoute}
                    className="px-6 py-3 bg-red-600/10 text-red-400 border border-red-600/50 rounded-md font-medium hover:bg-red-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    Delete Webhook Route
                  </button>
                </motion.div>
              )}

              {!route.permissions?.can.delete.allowed && route.permissions?.can.update.allowed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="pt-8 border-t border-discord-dark"
                >
                  <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-md p-4">
                    <p className="text-yellow-400 text-sm">
                      {route.permissions?.can.delete.message || "You don't have permission to delete this webhook route."}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="bg-discord-card rounded-xl border border-discord-dark p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-discord-text-normal">
                  Webhook Responses
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-discord-text-muted">
                    {responses?.length || 0} Response(s)
                  </span>
                  {route.permissions?.can.create_responses.allowed ? (
                    <button
                      onClick={() => router.push(`/projects/${projectId}/webhooks?action=create-webhook-response&routeId=${routeId}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Create Response
                    </button>
                  ) : (
                    <div className="group relative">
                      <button
                        disabled
                        title={route.permissions?.can.create_responses.message}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/50 text-white/50 rounded-md font-medium cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        Create Response
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {responses && responses.length === 0 ? (
                <div className="text-center py-12 bg-discord-dark rounded-lg border-2 border-dashed border-discord-dark">
                  <p className="text-discord-text-muted">No responses yet.</p>
                  <p className="text-discord-text-muted opacity-70 text-sm mt-1">
                    Create a response to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses?.map((response) => (
                    <div
                      key={response.id}
                      className="p-4 border border-discord-dark rounded-lg hover:border-discord-lighter transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-discord-text-normal">{response.name}</span>
                            {response.id === route.active_response_id && (
                              <span className="px-2 py-1 bg-discord-green/20 text-discord-green text-xs rounded-full font-medium">
                                Active
                              </span>
                            )}
                            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded font-medium">
                              {response.type}
                            </span>
                          </div>
                          <p className="text-sm text-discord-text-muted">
                            Status: {response.status_code}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {response.id !== route.active_response_id &&
                           response.permissions?.can.activate.allowed && (
                            <button
                              onClick={() => activateResponse(response.id)}
                              className="px-3 py-1 text-sm text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors duration-200"
                            >
                              Activate
                            </button>
                          )}
                          {response.permissions?.can.delete.allowed ? (
                            <button
                              onClick={() => deleteResponse(response.id)}
                              className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/20 rounded transition-colors duration-200"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              disabled
                              title={response.permissions?.can.delete.message}
                              className="px-3 py-1 text-sm text-red-400/50 rounded cursor-not-allowed"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-discord-card rounded-xl border border-discord-dark p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-discord-text-normal">
                  Request Logs
                </h3>
                <span className="text-sm text-discord-text-muted">
                  {logs?.length || 0} Log(s)
                </span>
              </div>

              {logs && logs.length === 0 ? (
                <div className="text-center py-12 bg-discord-dark rounded-lg border-2 border-dashed border-discord-dark">
                  <p className="text-discord-text-muted">No logs yet.</p>
                  <p className="text-discord-text-muted opacity-70 text-sm mt-1">
                    Logs will appear here once requests are received.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-discord-dark">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">Method</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">IP</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs?.map((log) => (
                        <tr key={log.id} className="border-b border-discord-dark hover:bg-discord-hover transition-colors duration-150">
                          <td className="py-3 px-4 text-sm text-discord-text-normal">
                            {new Date(log.created_at).toLocaleString('de-DE')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              log.response_status_code >= 200 && log.response_status_code < 300
                                ? 'bg-discord-green/20 text-discord-green'
                                : log.response_status_code >= 400
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {log.response_status_code}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-discord-text-muted font-mono">
                            {log.request_method}
                          </td>
                          <td className="py-3 px-4 text-sm text-discord-text-muted font-mono">
                            {log.request_ip}
                          </td>
                          <td className="py-3 px-4 text-sm text-discord-text-muted">
                            {log.response_time_ms}ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
