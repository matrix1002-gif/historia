/* Historia — publicités (Google AdMob).
   Ne fait rien dans un navigateur : actif uniquement dans l'application Android.
   Pour passer aux vraies publicités : remplacer les identifiants de test ci-dessous
   (voir le guide), et mettre TEST à false. */
(function () {
  "use strict";
  var ADS = {
    TEST: true, // true = publicités de test de Google. Mettre false avec vos vrais identifiants.
    BANNER_ID: "ca-app-pub-3940256099942544/9214589741",       // identifiant de test (bannière adaptative)
    INTERSTITIAL_ID: "ca-app-pub-3940256099942544/1033173712", // identifiant de test (plein écran)
    EVERY_N_QUIZ: 2   // une pub plein écran toutes les N parties terminées
  };

  // Achat « sans publicité » : plus aucune publicité, et pas même de demande de consentement.
  function adFree() { try { return localStorage.getItem("historia.adfree") === "1"; } catch (e) { return false; } }

  var cap = window.Capacitor;
  var AdMob = cap && cap.Plugins && cap.Plugins.AdMob;
  var native = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  if (!native || !AdMob) { window.HistoriaAds = { screen: function () {}, quizFinished: function () {} }; return; }

  var ready = false, bannerOn = false, done = 0, hot = false;
  var wanted = "home";

  function setSpace(px) { document.documentElement.style.setProperty("--ad-h", (px || 0) + "px"); }

  function showBanner() {
    if (!ready || bannerOn || adFree()) return;
    bannerOn = true;
    AdMob.showBanner({ adId: ADS.BANNER_ID, adSize: "ADAPTIVE_BANNER", position: "BOTTOM_CENTER", margin: 0, isTesting: ADS.TEST })
      .catch(function () { bannerOn = false; });
  }
  function hideBanner() {
    if (!bannerOn) return;
    bannerOn = false; setSpace(0);
    AdMob.removeBanner().catch(function () {});
  }
  function prepare() {
    if (!ready) return;
    AdMob.prepareInterstitial({ adId: ADS.INTERSTITIAL_ID, isTesting: ADS.TEST }).then(function () { hot = true; }).catch(function () { hot = false; });
  }

  async function start() {
    if (adFree()) return;
    try {
      // Consentement européen (RGPD) : le formulaire de Google s'affiche si la loi l'exige.
      var info = await AdMob.requestConsentInfo();
      if (info && info.isConsentFormAvailable && info.status === "REQUIRED") info = await AdMob.showConsentForm();
      if (info && info.canRequestAds === false) return;
      await AdMob.initialize({ initializeForTesting: ADS.TEST, tagForChildDirectedTreatment: false, tagForUnderAgeOfConsent: false, maxAdContentRating: "ParentalGuidance" });
      AdMob.addListener("bannerAdSizeChanged", function (s) { if (bannerOn) setSpace(s && s.height); });
      AdMob.addListener("interstitialAdDismissed", function () { hot = false; prepare(); });
      ready = true;
      prepare();
      if ((wanted !== "quiz" && wanted !== "tgame" && wanted !== "defense")) showBanner();
    } catch (e) { /* les publicités sont facultatives : l'application continue sans */ }
  }

  window.HistoriaAds = {
    screen: function (name) {
      wanted = name;
      if (name === "quiz" || name === "tgame" || name === "defense") hideBanner(); else showBanner();
    },
    quizFinished: function () {
      done++;
      if (ready && hot && !adFree() && done % ADS.EVERY_N_QUIZ === 0) {
        AdMob.showInterstitial().catch(function () {});
      }
    }
  };
  window.addEventListener("historia:adfree", function () { hideBanner(); setSpace(0); });
  start();
})();
