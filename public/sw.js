/* Manara Academy — service worker (static + offline shell; API never cached here) */
const VERSION = "manara-pwa-v1";
const CACHE_STATIC = `${VERSION}-shell`;
const CACHE_ASSETS = `${VERSION}-assets`;

const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) =>
      cache.add(new Request(OFFLINE_URL, { cache: "reload" }))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key.startsWith("manara-pwa-") && !key.startsWith(VERSION)) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
      await self.clients.claim();
    })()
  );
});

function sameOrigin(url) {
  return url.origin === self.location.origin;
}

/** Laravel / external APIs — always network; never cache response bodies in SW */
function isCrossOrigin(url) {
  return !sameOrigin(url);
}

function isSameOriginApiOrSensitive(url) {
  return url.pathname.startsWith("/api");
}

function isStaticLikeAsset(url) {
  const p = url.pathname;
  if (p.startsWith("/_next/static/")) return true;
  if (p.startsWith("/_next/image")) return true;
  if (p === "/manifest.webmanifest") return true;
  if (p === "/icon-192" || p === "/icon-512") return true;
  return /\.(?:js|css|woff2?|ttf|ico|png|jpg|jpeg|webp|svg|gif)$/i.test(p);
}

/**
 * Cache-first + background revalidate (stale-while-revalidate for static shells).
 */
async function cacheFirstWithRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((response) => {
    if (response && response.ok && response.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  });
  return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isCrossOrigin(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (isSameOriginApiOrSensitive(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const offline = await caches.match(OFFLINE_URL);
        return offline || new Response("Offline", { status: 503, statusText: "Offline" });
      })
    );
    return;
  }

  if (isStaticLikeAsset(url)) {
    event.respondWith(
      cacheFirstWithRevalidate(request, CACHE_ASSETS).catch(() => fetch(request))
    );
    return;
  }

  event.respondWith(fetch(request));
});

/* Push — opt-in; server must send Web Push with VAPID; backend integration later */
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? String(event.data.text()) : "" };
  }
  const title = payload.title || "منارة اكاديمي";
  const options = {
    body: payload.body || payload.message || "لديك إشعار جديد",
    icon: "/icon-192",
    badge: "/icon-192",
    tag: payload.tag || "manara-notification",
    data: { url: payload.url || "/dashboard/notifications" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "/dashboard/notifications";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
