'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import type { HttpMethod } from '@/types/webhook';

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function WebhookRouteForm({ initialData, onSubmit, isLoading, disabled }: Props) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    method: initialData?.method || 'GET' as HttpMethod,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Note:</strong> Webhooks are limited to {process.env.NEXT_PUBLIC_WEBHOOK_RATE_LIMIT_DEFAULT} req/min and a maximum request size of {process.env.NEXT_PUBLIC_WEBHOOK_MAX_REQUEST_SIZE_KB} KB.)
        </p>
      </div>


      <div>
            <label className="block text-sm font-medium text-discord-text-muted mb-2">
                HTTP Method *
            </label>
            <div className="flex gap-2 flex-wrap">
                {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map((method) => {
                    const isSelected = formData.method === method;

                    const getStyles = () => {
                        if (isSelected) {
                            const selectedStyles = {
                                GET: 'bg-blue-400/10 text-blue-300 border-blue-400/30',
                                POST: 'bg-green-400/10 text-green-300 border-green-400/30',
                                PUT: 'bg-orange-400/10 text-orange-300 border-orange-400/30',
                                PATCH: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
                                DELETE: 'bg-red-400/10 text-red-300 border-red-400/30',
                            };
                            return selectedStyles[method];
                        }

                        const hoverStyles = {
                            GET: 'hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-blue-300',
                            POST: 'hover:bg-green-400/10 hover:border-green-400/30 hover:text-green-300',
                            PUT: 'hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-300',
                            PATCH: 'hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-300',
                            DELETE: 'hover:bg-red-400/10 hover:border-red-400/30 hover:text-red-300',
                        };
                        return 'bg-transparent border-discord-dark text-discord-text-muted ' + hoverStyles[method];
                    };

                    return (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setFormData({ ...formData, method })}
                            disabled={disabled}
                            className={`
                  w-20 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150
                  border ${getStyles()}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                        >
                            {method}
                        </button>
                    );
                })}
            </div>
        </div>

      <div>
        <label className="block text-sm font-medium text-discord-text-muted mb-2">
          Name *
        </label>
        <input
          type="text"
          required
          disabled={disabled}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="e.g. Shopify Webhook"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || disabled || !formData.name.trim()}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 active:scale-95 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
