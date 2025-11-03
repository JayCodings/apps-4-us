'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { useWebhookResponses } from '@/hooks/useWebhookResponses';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useToast } from '@/contexts/ToastContext';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { webhooksApi } from '@/lib/api/webhooks';
import type { WebhookResponse } from '@/types/webhook';

interface EditWebhookResponsePanelProps {
  responseId: string;
  routeId: string;
  projectId: string;
}

export function EditWebhookResponsePanel({ responseId, routeId, projectId }: EditWebhookResponsePanelProps) {
  const { updateResponse } = useWebhookResponses(routeId);
  const { refresh: refreshRoutes } = useWebhooks(projectId);
  const { showToast } = useToast();
  const { close } = useSlidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<WebhookResponse | null>(null);

  const [name, setName] = useState('');
  const [statusCode, setStatusCode] = useState<string>('200');
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setIsLoading(true);
        const data = await webhooksApi.getResponse(responseId);
        setResponse(data);
        setName(data.name);
        setStatusCode(data.status_code?.toString() || '200');
        if (data.headers && Object.keys(data.headers).length > 0) {
          setHeaders(Object.entries(data.headers).map(([key, value]) => ({ key, value })));
        }
        setBody(data.body || '');
        setProxyUrl(data.proxy_url || '');
      } catch (error) {
        console.error('Failed to load response:', error);
        showToast('Failed to load response', 'error');
        close();
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponse();
  }, [responseId, showToast, close]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (response.type === 'static') {
      const statusCodeNum = parseInt(statusCode, 10);
      if (isNaN(statusCodeNum) || statusCodeNum < 100 || statusCodeNum > 599) {
        newErrors.statusCode = 'Status code must be between 100 and 599';
      }
    }

    if (response.type === 'proxy') {
      if (!proxyUrl.trim()) {
        newErrors.proxyUrl = 'Proxy URL is required';
      } else {
        try {
          new URL(proxyUrl);
        } catch {
          newErrors.proxyUrl = 'Must be a valid URL';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updateData: any = {
        name: name.trim(),
        type: response.type,
      };

      if (response.type === 'static') {
        const headersObj: Record<string, string> = {};
        headers.forEach((header) => {
          if (header.key.trim() && header.value.trim()) {
            headersObj[header.key.trim()] = header.value.trim();
          }
        });

        updateData.status_code = parseInt(statusCode, 10);
        updateData.headers = Object.keys(headersObj).length > 0 ? headersObj : null;
        updateData.body = body.trim() || null;
      } else {
        updateData.proxy_url = proxyUrl.trim();
      }

      await updateResponse(responseId, updateData);
      await refreshRoutes();
      showToast('Response updated successfully', 'success');
      close();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update response';
      showToast(errorMessage, 'error');
      console.error('Failed to update response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !response) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-discord-dark">
        <h2 className="text-2xl font-bold text-discord-text-normal mb-2">Edit Response</h2>
        <p className="text-sm text-discord-text-muted">
          Type: <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            response.type === 'proxy'
              ? 'bg-purple-400/10 text-purple-300 border border-purple-400/30'
              : 'bg-blue-400/10 text-blue-300 border border-blue-400/30'
          }`}>
            {response.type.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-discord-text-normal mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 bg-discord-dark border ${
                  errors.name ? 'border-red-500' : 'border-discord-darker'
                } rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Response name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {response.type === 'static' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Status Code
                  </label>
                  <input
                    type="number"
                    value={statusCode}
                    onChange={(e) => setStatusCode(e.target.value)}
                    className={`w-full px-3 py-2 bg-discord-dark border ${
                      errors.statusCode ? 'border-red-500' : 'border-discord-darker'
                    } rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="200"
                    min="100"
                    max="599"
                  />
                  {errors.statusCode && (
                    <p className="mt-1 text-sm text-red-400">{errors.statusCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Headers (optional)
                  </label>
                  <div className="space-y-2">
                    {headers.map((header, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Key"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 bg-discord-dark border border-discord-darker rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 bg-discord-dark border border-discord-darker rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeHeader(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addHeader}
                      className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
                    >
                      <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      Add Header
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Body (optional)
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 bg-discord-dark border border-discord-darker rounded-md text-discord-text-normal font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder='{"message": "Success"}'
                  />
                  <p className="text-xs text-discord-text-muted mt-1">
                    Response body content (JSON, XML, plain text, etc.)
                  </p>
                </div>
              </>
            )}

            {response.type === 'proxy' && (
              <div>
                <label className="block text-sm font-medium text-discord-text-normal mb-2">
                  Proxy URL
                </label>
                <input
                  type="url"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  className={`w-full px-3 py-2 bg-discord-dark border ${
                    errors.proxyUrl ? 'border-red-500' : 'border-discord-darker'
                  } rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="https://example.com/api/webhook"
                />
                {errors.proxyUrl && (
                  <p className="mt-1 text-sm text-red-400">{errors.proxyUrl}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-discord-dark">
              <button
                type="button"
                onClick={close}
                disabled={isSubmitting}
                className="px-4 py-2 text-discord-text-normal bg-discord-dark hover:bg-discord-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
