'use client';

import { useEffect } from 'react';
import { initializeEcho } from '@/lib/websocket';
import { useRouter } from 'next/navigation';

interface WebhookReceivedPayload {
  userId: string;
  projectId: string;
  routeId: string;
  logId: string;
}

interface Props {
  userId?: string;
  children: React.ReactNode;
}

export function WebhookNotificationProvider({ userId, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const echo = initializeEcho();

    const channel = echo.private(`user.${userId}`);

    channel.listen('.WebhookReceived', (payload: WebhookReceivedPayload) => {
      const { projectId, routeId, logId } = payload;

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Webhook empfangen', {
          body: 'Ein neuer Webhook-Request wurde empfangen.',
          icon: '/favicon.ico',
        });
      }

      const link = `/projects/${projectId}/webhooks/${routeId}?tab=logs&highlight=${logId}`;

      showToast(
        'Webhook empfangen',
        'Ein neuer Webhook-Request wurde empfangen.',
        () => router.push(link)
      );
    });

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      channel.stopListening('.WebhookReceived');
      echo.leave(`user.${userId}`);
    };
  }, [userId, router]);

  return <>{children}</>;
}

function showToast(title: string, message: string, onClick?: () => void) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm animate-slide-up cursor-pointer hover:shadow-xl transition-shadow duration-200';
  toast.onclick = () => {
    onClick?.();
    toast.remove();
  };

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900 mb-1">${title}</h4>
        <p class="text-sm text-gray-600">${message}</p>
      </div>
      <button class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
