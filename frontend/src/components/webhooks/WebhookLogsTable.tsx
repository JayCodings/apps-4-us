'use client';

import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { WebhookLog } from '@/types/webhook';

interface WebhookLogsTableProps {
  logs: WebhookLog[];
  isLoading?: boolean;
}

export function WebhookLogsTable({ logs, isLoading = false }: WebhookLogsTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  if (logs.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-discord-card rounded-lg border-2 border-dashed border-discord-dark">
        <p className="text-discord-text-muted text-lg">No webhook logs yet.</p>
        <p className="text-discord-text-muted opacity-70 mt-2">
          Logs will appear here once requests are received.
        </p>
      </div>
    );
  }

  const toggleRow = (logId: string) => {
    setExpandedRowId(expandedRowId === logId ? null : logId);
  };

  const formatJson = (data: Record<string, unknown> | string | null): string => {
    if (!data) return 'N/A';
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-discord-dark border-b border-discord-darker">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted w-8">
              {/* Expand icon column */}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              Method
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              Error
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              Webhook Route
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              IP Address
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              Response Time
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => {
            const isExpanded = expandedRowId === log.id;

            return (
              <Fragment key={log.id}>
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-discord-darker hover:bg-discord-hover transition-colors duration-150 cursor-pointer"
                  onClick={() => toggleRow(log.id)}
                >
                  <td className="py-3 px-4">
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-discord-text-muted" />
                    </motion.div>
                  </td>
                  <td className="py-3 px-4 text-sm text-discord-text-muted font-mono font-semibold">
                    {log.request_method}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        log.response_status && log.response_status >= 200 && log.response_status < 300
                          ? 'bg-discord-green/20 text-discord-green'
                          : log.response_status && log.response_status >= 400
                          ? 'bg-discord-danger/20 text-discord-danger'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {log.response_status || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-discord-danger max-w-xs">
                    {log.error && (
                      <span className="truncate inline-block w-full" title={log.error}>
                        {log.error}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {log.response_type && (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            log.response_type === 'static'
                              ? 'bg-indigo-600/20 text-indigo-400'
                              : 'bg-discord-green/20 text-discord-green'
                          }`}
                        >
                          {log.response_type}
                        </span>
                      )}
                      {log.route?.name ? (
                        <span className="text-sm text-discord-text-normal font-medium">
                          {log.route.name}
                        </span>
                      ) : (
                        <span className="text-sm text-discord-text-muted">Unknown</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-discord-text-muted font-mono">
                    {log.request_ip || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-discord-text-muted">
                    {log.response_time_ms !== null ? (
                      <span className={`${
                        log.response_time_ms > 1000
                          ? 'text-discord-danger font-semibold'
                          : log.response_time_ms > 500
                          ? 'text-yellow-400'
                          : 'text-discord-green'
                      }`}>
                        {log.response_time_ms}ms
                      </span>
                    ) : (
                      <span className="text-discord-text-muted">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-discord-text-normal">
                    {new Date(log.created_at).toLocaleString('en-US')}
                  </td>
                </motion.tr>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.tr
                      key={`${log.id}-details`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={8} className="bg-discord-darker/50">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-discord-text-normal mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                              Request
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-discord-text-muted mb-1 font-medium">Headers</p>
                                <pre className="bg-discord-card border border-discord-dark rounded-md p-3 text-xs text-discord-text-normal overflow-x-auto font-mono">
                                  {formatJson(log.request_headers)}
                                </pre>
                              </div>
                              <div>
                                <p className="text-xs text-discord-text-muted mb-1 font-medium">Body</p>
                                <pre className="bg-discord-card border border-discord-dark rounded-md p-3 text-xs text-discord-text-normal overflow-x-auto font-mono max-h-64 overflow-y-auto">
                                  {formatJson(log.request_body)}
                                </pre>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-discord-text-normal mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-discord-green rounded-full"></span>
                              Response
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-discord-text-muted mb-1 font-medium">Headers</p>
                                <pre className="bg-discord-card border border-discord-dark rounded-md p-3 text-xs text-discord-text-normal overflow-x-auto font-mono">
                                  {formatJson(log.response_headers)}
                                </pre>
                              </div>
                              <div>
                                <p className="text-xs text-discord-text-muted mb-1 font-medium">Body</p>
                                <pre className="bg-discord-card border border-discord-dark rounded-md p-3 text-xs text-discord-text-normal overflow-x-auto font-mono max-h-64 overflow-y-auto">
                                  {formatJson(log.response_body)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
