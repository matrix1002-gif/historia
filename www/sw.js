/* Service worker : permet de jouer hors ligne. Changer CACHE à chaque mise à jour du contenu. */
const CACHE = "historia-v4";
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest", "./privacy.html",
  "./css/style.css", "./js/eras.js", "./js/art.js", "./js/ads.js", "./js/app.js",
  "./js/eras/gaule.js", "./js/eras/evangelisation.js", "./js/eras/carolingiens.js", "./js/eras/moines.js", "./js/eras/chevaliers.js", "./js/eras/croisades.js", "./js/eras/capetiens.js", "./js/eras/renaissance.js", "./js/eras/grand-siecle.js", "./js/eras/revolution.js", "./js/eras/empire.js",
  "./icons/icon.svg", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./fonts/cinzel-latin-500-normal.woff2", "./fonts/cinzel-latin-700-normal.woff2",
  "./fonts/eb-garamond-latin-400-normal.woff2", "./fonts/eb-garamond-latin-400-italic.woff2", "./fonts/eb-garamond-latin-600-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
