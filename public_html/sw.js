const CACHE_NAME = "primex-static-v108_admin_panel_open_fix";
const STATIC_ASSETS = ["/", "/assets/css/app.css?v=20261120_v108_admin_panel_open_fix", "/assets/js/app.js?v=20261120_v108_admin_panel_open_fix", "/assets/js/chart.js?v=20261120_v108_admin_panel_open_fix", "/assets/js/3d-engine.js?v=20261120_v108_admin_panel_open_fix"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => (k.startsWith("alphavest-static-") || k.startsWith("primex-static-")) && k !== CACHE_NAME).map(k => caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname === "/offline.html" || url.pathname === "/logs" || url.pathname.startsWith("/logs/") || url.pathname.startsWith("/logs.")) return;

  // HTML/navigation is NETWORK-FIRST so a new deployment is visible immediately.
  // The cache is only a fallback when the network is unavailable.
  if (url.pathname === "/" || url.pathname === "/index.html") {
    event.respondWith(fetch(req, { cache: "no-store" }).then(res => {
      if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone())).catch(()=>{});
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match("/offline.html"))));
    return;
  }

  // Static assets are NETWORK-FIRST so a deployment is immediately visible.
  // The cache is only a fallback when the network is unavailable.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(fetch(req, { cache: "no-store" }).then(res => {
      if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone())).catch(()=>{});
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match("/offline.html"))));
    return;
  }

  event.respondWith(fetch(req).catch(() => caches.match(req).then(cached => cached || caches.match("/offline.html"))));
});


self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
