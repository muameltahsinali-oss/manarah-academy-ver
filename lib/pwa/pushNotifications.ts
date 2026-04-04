/**
 * Web Push scaffolding — wire to Laravel when backend exposes VAPID + subscriptions.
 * Never store secrets in the client; only public VAPID key belongs here.
 */

const PUBLIC_VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function isPushConfigured(): boolean {
  return typeof PUBLIC_VAPID === "string" && PUBLIC_VAPID.length > 0;
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

/**
 * Subscribe for push; call your API to persist subscription JSON on the server.
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushConfigured() || typeof window === "undefined") return null;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID!),
  });
  return sub;
}

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
