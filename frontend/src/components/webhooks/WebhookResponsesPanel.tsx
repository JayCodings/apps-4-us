'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWebhookResponses } from '@/hooks/useWebhookResponses';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useConfirmModal } from '@/contexts/ConfirmModalContext';
import { useToast } from '@/contexts/ToastContext';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/common/Pagination';
import { Plus, Settings, Trash2 } from 'lucide-react';
import type { WebhookRoute, WebhookResponse } from '@/types/webhook';

interface WebhookResponsesPanelProps {
  routeId: string;
  routeName: string;
}

export function WebhookResponsesPanel({ routeId, routeName }: WebhookResponsesPanelProps) {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const { showConfirm } = useConfirmModal();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const { responses, meta, isLoading, deleteResponse, activateResponse } = useWebhookResponses(routeId, currentPage);
  const { routes, refresh: refreshRoutes } = useWebhooks(projectId);

  const route = routes?.find(r => r.id === routeId) as WebhookRoute | undefined;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateResponse = () => {
    router.push(`/projects/${projectId}/webhooks?action=create-webhook-response&routeId=${routeId}`);
  };

  const handleEditResponse = (responseId: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('action', 'edit-webhook-response');
    params.set('responseId', responseId);
    params.set('routeId', routeId);
    router.push(`/projects/${projectId}/webhooks?${params.toString()}`);
  };

  const [activatingResponseId, setActivatingResponseId] = useState<string | null>(null);

  const handleActivateResponse = async (responseId: string) => {
    if (responseId === route?.active_response_id) return;

    setActivatingResponseId(responseId);
    try {
      await activateResponse(responseId);
      await refreshRoutes();
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
      },
    });
  };

  const getStatusBadgeColor = (statusCode: number | null) => {
    if (!statusCode) return 'bg-gray-400/10 text-gray-300 border border-gray-400/30';
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-400/10 text-green-300 border border-green-400/30';
    if (statusCode >= 300 && statusCode < 400) return 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/30';
    if (statusCode >= 400 && statusCode < 500) return 'bg-orange-400/10 text-orange-300 border border-orange-400/30';
    if (statusCode >= 500) return 'bg-red-400/10 text-red-300 border border-red-400/30';
    return 'bg-gray-400/10 text-gray-300 border border-gray-400/30';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-discord-dark">
        <h2 className="text-2xl font-bold text-discord-text-normal mb-2">Manage Responses</h2>
        <p className="text-discord-text-muted">{routeName}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-discord-dark rounded-xl border border-discord-dark p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-discord-text-normal">
                Webhook Responses
              </h3>
              <div className="flex items-center gap-3">
                {route?.permissions?.can.create_responses.allowed ? (
                  <button
                    onClick={handleCreateResponse}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all active:scale-95 group"
                  >
                    <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    Create Response
                  </button>
                ) : (
                  <button
                    disabled
                    title={route?.permissions?.can.create_responses.message}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/50 text-white/50 rounded-md font-medium cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Create Response
                  </button>
                )}
              </div>
            </div>

            {responses.length === 0 ? (
              <div className="text-center py-12 bg-discord-dark rounded-lg border-2 border-dashed border-discord-dark">
                <p className="text-discord-text-muted">No responses yet.</p>
                <p className="text-discord-text-muted opacity-70 text-sm mt-1">
                  Create a response to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {responses.map((response) => (
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
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                if (activatingResponseId || !response.permissions?.can.activate.allowed) return;
                                if (response.id === route?.active_response_id) return;
                                handleActivateResponse(response.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  if (activatingResponseId || !response.permissions?.can.activate.allowed) return;
                                  if (response.id === route?.active_response_id) return;
                                  handleActivateResponse(response.id);
                                }
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                response.id === route?.active_response_id ? 'bg-discord-green' : 'bg-discord-gray'
                              } ${
                                activatingResponseId === response.id || !response.permissions?.can.activate.allowed
                                  ? 'opacity-50 cursor-not-allowed'
                                  : response.id === route?.active_response_id
                                  ? 'cursor-default'
                                  : 'cursor-pointer'
                              }`}
                              title={
                                !response.permissions?.can.activate.allowed
                                  ? 'Cannot activate response'
                                  : response.id === route?.active_response_id
                                  ? 'Active response'
                                  : 'Activate response'
                              }
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  response.id === route?.active_response_id ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </div>
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
                  ))}
                </div>

                {meta && (
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
