'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { webhooksApi } from '@/lib/api/webhooks';
import type { WebhookLog, PaginatedResponse } from '@/types/webhook';
import { WebhookLogsTable } from '@/components/webhooks/WebhookLogsTable';
import { Pagination } from '@/components/common/Pagination';

export default function WebhookLogsOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginatedResponse<WebhookLog>['meta'] | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await webhooksApi.getProjectLogs(projectId, currentPage);
        setLogs(response.data);
        setPaginationMeta(response.meta);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [projectId, currentPage]);

  if (isLoading && !paginationMeta) {
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
              {paginationMeta ? `${paginationMeta.total} Total Logs` : 'Loading...'}
            </p>
            <p className="text-sm text-discord-text-muted">
              {paginationMeta ? `Page ${paginationMeta.current_page} of ${paginationMeta.last_page}` : ''}
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
            <WebhookLogsTable
              logs={logs}
              isLoading={isLoading}
            />

            {paginationMeta && paginationMeta.last_page > 1 && (
              <div className="px-6 py-4 border-t border-discord-darker">
                <Pagination
                  currentPage={paginationMeta.current_page}
                  totalPages={paginationMeta.last_page}
                  totalItems={paginationMeta.total}
                  itemsPerPage={paginationMeta.per_page}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
