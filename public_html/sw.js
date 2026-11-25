const CACHE_NAME = "primex-static-v133_signals_redesign_100min_additional";
const STATIC_ASSETS = ["/", "/offline.html", "/assets/css/app.css?v=20261125_v133_signals_redesign_100min_additional", "/assets/js/app.js?v=20261125_v133_signals_redesign_100min_additional", "/assets/js/chart.js?v=20261125_v133_signals_redesign_100min_additional", "/assets/js/3d-engine.js?v=20261125_v133_signals_redesign_100min_additional"];

function fallbackResponse(req) {
  return caches.match(req).then(cached => cached || caches.match("/offline.html")).then(res => {
    return res || new Response("Service temporarily unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }).catch(() => new Response("Service temporarily unavailable", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  }));
}

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
  if (url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname === "/version.php" || url.pathname === "/offline.html" || url.pathname === "/logs" || url.pathname.startsWith("/logs/") || url.pathname.startsWith("/logs.") || url.pathname === "/console" || url.pathname.startsWith("/console/") || url.pathname.startsWith("/console.")) return;

  // HTML/navigation is NETWORK-FIRST so a new deployment is visible immediately.
  // The cache is only a fallback when the network is unavailable.
  if (url.pathname === "/" || url.pathname === "/index.html") {
    event.respondWith(fetch(req, { cache: "no-store" }).then(res => {
      if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone())).catch(()=>{});
      return res;
    }).catch(() => fallbackResponse(req)));
    return;
  }

  // Static assets are NETWORK-FIRST so a deployment is immediately visible.
  // The cache is only a fallback when the network is unavailable.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(fetch(req, { cache: "no-store" }).then(res => {
      if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone())).catch(()=>{});
      return res;
    }).catch(() => fallbackResponse(req)));
    return;
  }

  event.respondWith(fetch(req).catch(() => fallbackResponse(req)));
});


self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
