const CACHE_NAME = "vione-connect-pwa-v4";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/manifest.json",
  "/manifest-bc.webmanifest",
  "/apple-touch-icon.png",
  "/favicon.png",
  "/vione-maskable-192.png",
  "/vione-maskable-512.png",
  "/vione-gold-192.png",
  "/vione-gold-512.png",
  "/vione-wordmark.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        /* Continue even if some optional assets are missed */
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Không can thiệp API calls, uploads hoặc WebSocket
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/dm") ||
    url.pathname.startsWith("/upload") ||
    url.pathname.startsWith("/socket.io") ||
    url.pathname.startsWith("/communities") ||
    url.pathname.startsWith("/connect-app/community")
  ) {
    return;
  }

  // 1. Navigation request (HTML pages): Network-First để luôn nhận phiên bản mới nhất khi deploy
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = (await caches.match(request)) || (await caches.match("/connect-app"));
          if (cached) return cached;
          return new Response("Ứng dụng tạm thời gián đoạn kết nối mạng", {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        })
    );
    return;
  }

  // 2. Chunks JS/CSS hoặc assets: Network-First với fallback cache
  if (url.pathname.includes("/assets/") || url.pathname.includes("/_build/")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(null, { status: 404, statusText: "Asset Not Found" });
        })
    );
    return;
  }

  // 3. Các assets tĩnh khác: Stale-While-Revalidate với Response fallback hợp lệ
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        fetch(request)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
          })
          .catch(() => {});
        return cached;
      }
      try {
        const res = await fetch(request);
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return res;
      } catch {
        return new Response(null, { status: 503, statusText: "Network Error" });
      }
    })()
  );
});

// 4. Background Push & Notification Click handling for Phone Lockscreen & Status Bar
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Thông báo ViOne", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "ViOne Connect";
  const options = {
    body: data.body || "Bạn có thông báo mới từ hệ sinh thái ViOne",
    icon: data.icon || "/app-icon.png",
    badge: data.badge || "/app-icon.png",
    tag: data.tag || `vione-notif-${Date.now()}`,
    data: { url: data.url || "/connect-app" },
    vibrate: data.vibrate || [200, 100, 200],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/connect-app";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if (client.url && client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
