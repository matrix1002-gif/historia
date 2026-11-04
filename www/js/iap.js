/* Historia — achat « sans publicité » (Google Play Billing, achat unique à vie).
   Actif uniquement dans l'application Android. Le produit se crée dans la Play Console :
   Monétiser > Produits > Produits in-app, identifiant : remove_ads, prix : 4,99 €. */
(function () {
  "use strict";
  var PRODUCT = "remove_ads";
  var KEY = "historia.adfree";
  var cap = window.Capacitor;
  var NP = cap && cap.Plugins && cap.Plugins.NativePurchases;
  var native = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  var available = native && !!NP;
  var price = "";

  function has() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function grant() {
    var was = has();
    try { localStorage.setItem(KEY, "1"); } catch (e) { /* ignoré */ }
    if (!was) window.dispatchEvent(new Event("historia:adfree"));
  }
  function owned(list) {
    return (list || []).some(function (p) {
      return p && p.productIdentifier === PRODUCT && (p.purchaseState === undefined || String(p.purchaseState) === "1");
    });
  }
  function check() {
    if (!available) return Promise.resolve(has());
    return NP.getPurchases({ productType: "inapp" })
      .then(function (r) { if (owned(r && r.purchases)) grant(); return has(); })
      .catch(function () { return has(); });
  }
  function loadPrice() {
    if (!available) return Promise.resolve("");
    return NP.getProduct({ productIdentifier: PRODUCT, productType: "inapp" })
      .then(function (r) { price = (r && r.product && r.product.priceString) || ""; return price; })
      .catch(function () { return ""; });
  }

  window.HistoriaIAP = {
    available: available,
    adFree: has,
    price: function () { return price; },
    init: function () { return Promise.all([check(), loadPrice()]).then(function () { window.dispatchEvent(new Event("historia:iap")); }); },
    buy: function () {
      if (!available) return Promise.reject(new Error("indisponible"));
      return NP.purchaseProduct({ productIdentifier: PRODUCT, productType: "inapp", quantity: 1 })
        .then(function () { grant(); return true; });
    },
    restore: function () {
      if (!available) return Promise.resolve(false);
      return NP.restorePurchases().catch(function () {}).then(check);
    }
  };
  if (available) window.HistoriaIAP.init();
})();
