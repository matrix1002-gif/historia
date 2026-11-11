/* Service worker : permet de jouer hors ligne. Changer CACHE à chaque mise à jour du contenu. */
const CACHE = "historia-v56";
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest", "./privacy.html",
  "./css/style.css", "./js/eras.js", "./js/i18n.js", "./js/iap.js", "./js/affiliate.js", "./js/art.js", "./js/situations.js", "./js/firebase-config.js", "./js/board.js", "./js/ads.js", "./js/defense.js", "./js/run.js", "./audio/fuite.ogg", "./js/daily/fr.js", "./js/daily/en.js", "./js/daily/more-fr.js", "./js/daily/more-en.js", "./js/daily/who-fr.js", "./js/easy/lv3-fr.js", "./js/easy/lv3-en.js", "./js/daily/who-en.js", "./js/easy/fr.js", "./js/easy/en.js", "./js/easy/more-fr.js", "./js/easy/more-en.js", "./js/easy/lv-fr.js", "./js/easy/lv-en.js", "./js/app.js",
  "./js/eras/gaule.js", "./js/eras/evangelisation.js", "./js/eras/carolingiens.js", "./js/eras/moines.js", "./js/eras/chevaliers.js", "./js/eras/croisades.js", "./js/eras/capetiens.js", "./js/eras/renaissance.js", "./js/eras/modernes.js", "./js/eras/en/modernes.js", "./js/eras/grand-siecle.js", "./js/eras/revolution.js", "./js/eras/empire.js",
  "./js/eras/en/gaule.js", "./js/eras/en/evangelisation.js", "./js/eras/en/carolingiens.js", "./js/eras/en/moines.js", "./js/eras/en/chevaliers.js", "./js/eras/en/croisades.js", "./js/eras/en/capetiens.js", "./js/eras/en/renaissance.js", "./js/eras/en/grand-siecle.js", "./js/eras/en/revolution.js", "./js/eras/en/empire.js",
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
