'use client';

import { useParams } from 'next/navigation';
import { useWebhooks } from '@/hooks/useWebhooks';
import { motion } from 'framer-motion';
import { Activity, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { webhooksApi } from '@/lib/api/webhooks';
import type { WebhookLog } from '@/types/webhook';

export default function WebhookLogsOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { routes, isLoading: routesLoading } = useWebhooks(projectId);

  const [logs, setLogs] = useState<Array<WebhookLog & { route_name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllLogs = async () => {
      if (!routes || routes.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const allLogsPromises = routes.map(async (route) => {
          const routeLogs = await webhooksApi.getLogs(route.id);
          return routeLogs.map(log => ({
            ...log,
            route_name: route.name,
          }));
        });

        const logsArrays = await Promise.all(allLogsPromises);
        const allLogs = logsArrays.flat();
        allLogs.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setLogs(allLogs);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllLogs();
    const interval = setInterval(fetchAllLogs, 5000);

    return () => clearInterval(interval);
  }, [routes]);

  if (routesLoading || isLoading) {
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
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-discord-text-normal flex items-center gap-3">
              <Activity className="w-8 h-8" />
              Webhook Logs
            </h1>
            <p className="text-discord-text-muted mt-1">
              Overview of all webhook requests for this project
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-discord-text-muted">
              {routes?.length || 0} Webhook Route(s)
            </p>
            <p className="text-sm text-discord-text-muted">
              {logs.length} Log Entries
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 bg-discord-card rounded-lg border-2 border-dashed border-discord-dark"
          >
            <FileText className="w-16 h-16 text-discord-gray mx-auto mb-4" />
            <p className="text-discord-text-muted text-lg">No webhook logs yet.</p>
            <p className="text-discord-text-muted opacity-70 mt-2">
              Logs will appear here once requests are received.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-discord-card rounded-lg border border-discord-dark overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-discord-dark border-b border-discord-darker">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                      Timestamp
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                      Webhook Route
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                      IP Address
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                      Response Time
                    </th>
                    {logs.some(log => log.error) && (
                      <th className="text-left py-3 px-4 text-sm font-medium text-discord-text-muted">
                        Error
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-discord-darker hover:bg-discord-hover transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-sm text-discord-text-normal">
                        {new Date(log.created_at).toLocaleString('en-US')}
                      </td>
                      <td className="py-3 px-4 text-sm text-discord-text-normal font-medium">
                        {log.route_name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            log.response_status_code >= 200 && log.response_status_code < 300
                              ? 'bg-discord-green/20 text-discord-green'
                              : log.response_status_code >= 400
                              ? 'bg-discord-danger/20 text-discord-danger'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
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
                        <span className={`${
                          log.response_time_ms > 1000
                            ? 'text-discord-danger font-semibold'
                            : log.response_time_ms > 500
                            ? 'text-yellow-400'
                            : 'text-discord-green'
                        }`}>
                          {log.response_time_ms}ms
                        </span>
                      </td>
                      {logs.some(l => l.error) && (
                        <td className="py-3 px-4 text-sm text-discord-danger">
                          {log.error && (
                            <span className="truncate max-w-xs inline-block" title={log.error}>
                              {log.error}
                            </span>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
