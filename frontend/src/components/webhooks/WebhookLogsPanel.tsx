'use client';

import { useState } from 'react';
import { useWebhookLogs } from '@/hooks/useWebhookLogs';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/common/Pagination';
import { WebhookLogsTable } from './WebhookLogsTable';

interface WebhookLogsPanelProps {
  routeId: string;
  routeName: string;
}

export function WebhookLogsPanel({ routeId, routeName }: WebhookLogsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { logs, meta, isLoading } = useWebhookLogs(routeId, currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <h2 className="text-2xl font-bold text-discord-text-normal mb-2">Request Logs</h2>
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
              <h3 className="text-xl font-semibold text-discord-text-normal">Request History</h3>
              <span className="text-sm text-discord-text-muted">
                {meta?.total || 0} Total Log{meta?.total !== 1 ? 's' : ''}
              </span>
            </div>

            <WebhookLogsTable
              logs={logs}
              isLoading={isLoading}
            />

            {logs.length > 0 && meta && (
              <Pagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                totalItems={meta.total}
                itemsPerPage={meta.per_page}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
