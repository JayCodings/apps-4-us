'use client';

import { WebhookRoute, WebhookResponse } from '@/types/webhook';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, AlertCircle, ExternalLink, FileText, Settings, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useSlidePanelContext } from '@/contexts/SlidePanelContext';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useWebhookResponses } from '@/hooks/useWebhookResponses';
import { useToast } from '@/contexts/ToastContext';
import { useProjects } from '@/hooks/useProjects';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useConfirmModal } from '@/contexts/ConfirmModalContext';
import { Pagination } from '@/components/common/Pagination';
import { EditWebhookResponsePanel } from './EditWebhookResponsePanel';

interface Props {
  route: WebhookRoute;
  projectId: string;
}

export function WebhookRouteCard({ route, projectId }: Props) {
  const router = useRouter();
  const { open } = useSlidePanel();
  const { registerPanels } = useSlidePanelContext();
  const { toggleRouteActive, deleteRoute, refresh: refreshRoutes } = useWebhooks(projectId);
  const { showToast } = useToast();
  const { showConfirm } = useConfirmModal();
  const { getProject } = useProjects();
  const { setProject } = useProjectContext();

  const [copied, setCopied] = useState(false);
  const [copiedProxy, setCopiedProxy] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activatingResponseId, setActivatingResponseId] = useState<string | null>(null);

  const publicUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/${route.id}`;

  const { responses, meta, isLoading: isLoadingResponses, deleteResponse, activateResponse } = useWebhookResponses(
    route.id,
    currentPage
  );

  const inactiveResponses = responses.filter(r => r.id !== route.active_response_id);
  const inactiveCount = meta ? meta.total - (route.active_response ? 1 : 0) : 0;

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

  const getStatusBadgeColor = (statusCode: number | null) => {
    if (!statusCode) return 'bg-gray-400/10 text-gray-300 border border-gray-400/30';
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-400/10 text-green-300 border border-green-400/30';
    if (statusCode >= 300 && statusCode < 400) return 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/30';
    if (statusCode >= 400 && statusCode < 500) return 'bg-orange-400/10 text-orange-300 border border-orange-400/30';
    if (statusCode >= 500) return 'bg-red-400/10 text-red-300 border border-red-400/30';
    return 'bg-gray-400/10 text-gray-300 border border-gray-400/30';
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

  const handleCreateResponse = () => {
    router.push(`/projects/${projectId}/webhooks?action=create-response&routeId=${route.id}`);
  };

  const handleEditResponse = (responseId: string) => {
    const panelId = `edit-response-${responseId}`;
    registerPanels({
      [panelId]: {
        title: 'Edit Response',
        content: <EditWebhookResponsePanel responseId={responseId} routeId={route.id} projectId={projectId} />,
      },
    });
    open(panelId);
  };

  const handleActivateResponse = async (responseId: string) => {
    if (responseId === route.active_response_id) return;

    setActivatingResponseId(responseId);
    try {
      await activateResponse(responseId);
      await refreshRoutes();
      setShowInactive(false);
      showToast('Response activated successfully', 'success');
    } catch (error) {
      showToast('Failed to activate response', 'error');
      console.error('Failed to activate response:', error);
    } finally {
      setActivatingResponseId(null);
    }
  };

  const handleDeleteResponse = (response: WebhookResponse) => {
    showConfirm({
      title: 'Delete Response',
      message: `Are you sure you want to delete "${response.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteResponse(response.id);
        await refreshRoutes();
        showToast('Response deleted successfully', 'success');
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderResponseCard = (response: WebhookResponse | null | undefined, isActive: boolean = false) => {
    if (!response) {
      return (
        <div className="flex items-center gap-2 text-sm text-discord-text-muted bg-discord-dark/50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span>No active response configured</span>
        </div>
      );
    }

    return (
      <motion.div
        key={response.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="p-4 border bg-discord-card hover:bg-white/10 border-discord-card rounded-lg hover:border-discord-lighter transition-colors duration-200"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-discord-text-normal">
                {response.name}
              </span>
              <span className={`px-2 py-1 text-xs rounded font-medium ${
                response.type === 'proxy'
                  ? 'bg-purple-400/10 text-purple-300 border border-purple-400/30'
                  : 'bg-blue-400/10 text-blue-300 border border-blue-400/30'
              }`}>
                {response.type.toUpperCase()}
              </span>
              {response.type === 'proxy' ? (
                <span
                  className="inline-block p-[1px] rounded"
                  style={{
                    background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(234, 179, 8), rgb(239, 68, 68))',
                  }}
                >
                  <span className="flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-discord-card">
                    <span
                      style={{
                        background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(234, 179, 8), rgb(239, 68, 68))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      XXX
                    </span>
                  </span>
                </span>
              ) : response.status_code ? (
                <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusBadgeColor(response.status_code)}`}>
                  {response.status_code}
                </span>
              ) : null}
            </div>
            <div className="flex gap-2 items-center">
              {response.permissions?.can.update.allowed ? (
                <button
                  onClick={() => handleEditResponse(response.id)}
                  className="p-2 text-discord-text-normal hover:bg-white/10 rounded-md transition-colors duration-200 group"
                  title="Edit response"
                >
                  <Settings className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
                </button>
              ) : (
                <button
                  disabled
                  className="p-2 text-discord-text-muted/50 rounded-md cursor-not-allowed group"
                  title="Cannot edit response"
                >
                  <Settings className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
                </button>
              )}
              {response.permissions?.can.delete.allowed ? (
                <button
                  onClick={() => handleDeleteResponse(response)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors duration-200 group"
                  title="Delete response"
                >
                  <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
                </button>
              ) : (
                <button
                  disabled
                  title={response.permissions?.can.delete.message || 'Cannot delete response'}
                  className="p-2 text-red-400/50 rounded-md cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {isActive ? (
                <span className="px-2 py-1 text-xs rounded font-medium bg-green-400/10 text-green-300 border border-green-400/30">
                  ACTIVE
                </span>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (activatingResponseId || !response.permissions?.can.activate.allowed) return;
                    handleActivateResponse(response.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (activatingResponseId || !response.permissions?.can.activate.allowed) return;
                      handleActivateResponse(response.id);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-discord-gray ${
                    activatingResponseId === response.id || !response.permissions?.can.activate.allowed
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  title={
                    !response.permissions?.can.activate.allowed
                      ? 'Cannot activate response'
                      : 'Activate response'
                  }
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </div>
              )}
            </div>
          </div>

          {response.type === 'proxy' && response.proxy_url && (
            <div className="bg-discord-dark p-2 rounded">
              <span className="text-xs text-discord-text-muted block mb-1">Proxy URL</span>
              <code className="block text-sm text-white font-mono truncate cursor-pointer hover:text-discord-text-normal transition-colors">
                {response.proxy_url}
              </code>
            </div>
          )}

          {response.type === 'static' && (
            <div className="space-y-2">
              {response.headers && Object.keys(response.headers).length > 0 && (
                <div className="bg-discord-dark p-2 rounded">
                  <span className="text-xs text-discord-text-muted block mb-1">Headers</span>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 text-xs">
                        <span className="text-discord-text-muted font-mono">{key}:</span>
                        <span className="text-discord-text-normal font-mono flex-1 break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {response.body && (
                <div className="bg-discord-dark p-2 rounded">
                  <span className="text-xs text-discord-text-muted block mb-1">Body</span>
                  <pre className="text-xs text-discord-text-normal font-mono whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
                    {truncateText(response.body, 300)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
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

      {/* Responses Section */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-4 pt-4 border-t border-discord-dark"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-discord-text-muted">Responses</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open(`logs-${route.id}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-discord-dark text-discord-text-normal border border-discord-lighter rounded-md text-sm font-medium hover:bg-discord-hover transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Logs
            </button>
            {route.permissions?.can.create_responses.allowed ? (
              <button
                onClick={handleCreateResponse}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-all active:scale-95 group"
              >
                <Plus className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                Create Response
              </button>
            ) : (
              <button
                disabled
                title={route.permissions?.can.create_responses.message}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/50 text-white/50 rounded-md text-sm font-medium cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Response
              </button>
            )}
          </div>
        </div>

        {/* Active Response (always visible) */}
        <div className="space-y-3">
          {renderResponseCard(route.active_response, true)}

          {/* Toggle for inactive responses */}
          {inactiveCount > 0 && (
            <>
              <button
                onClick={() => setShowInactive(!showInactive)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-discord-text-muted hover:text-discord-text-normal transition-colors"
              >
                {showInactive ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide {inactiveCount} inactive response{inactiveCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show {inactiveCount} more response{inactiveCount !== 1 ? 's' : ''}
                  </>
                )}
              </button>

              {/* Inactive Responses */}
              <AnimatePresence>
                {showInactive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {isLoadingResponses ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <>
                        {inactiveResponses.map((response) => renderResponseCard(response, false))}

                        {meta && meta.last_page > 1 && (
                          <Pagination
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            totalItems={meta.total}
                            itemsPerPage={meta.per_page}
                            onPageChange={handlePageChange}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
