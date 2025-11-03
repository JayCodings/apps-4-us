import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import type { WebhookReceivedEventData } from '@/types/webhook';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo | null;
  }
}

window.Pusher = Pusher;

let echoInstance: Echo | null = null;

export function initializeEcho() {
  if (echoInstance) {
    return echoInstance;
  }

  if (
    !process.env.NEXT_PUBLIC_REVERB_APP_KEY ||
    !process.env.NEXT_PUBLIC_REVERB_HOST ||
    !process.env.NEXT_PUBLIC_REVERB_SCHEME
  ) {
    console.warn('Reverb configuration missing. Websockets disabled.');
    return null;
  }

  const port = parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '443', 10);
  const forceTLS = process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https';

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: forceTLS ? port : 80,
    wssPort: port,
    forceTLS,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/broadcasting/auth`,
    auth: {
      headers: {},
    },
  });

  window.Echo = echoInstance;

  return echoInstance;
}

export function getEcho(): Echo | null {
  return echoInstance || initializeEcho();
}

export function subscribeToWebhooks(
  userId: string,
  onWebhookReceived: (data: WebhookReceivedEventData) => void
) {
  const echo = getEcho();

  if (!echo) {
    console.warn('Echo not initialized. Cannot subscribe to webhooks.');
    return null;
  }

  return echo
    .private(`user.${userId}`)
    .listen('.WebhookReceived', (event: WebhookReceivedEventData) => {
      onWebhookReceived(event);
    });
}

export function unsubscribeFromWebhooks(userId: string) {
  const echo = getEcho();

  if (!echo) {
    return;
  }

  echo.leave(`private-user.${userId}`);
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    window.Echo = null;
  }
}
