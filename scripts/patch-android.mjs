// Prépare le projet Android généré : identifiants AdMob (admob.config.json) et numéro de version.
// Utilisé par le workflow GitHub. Variables : VERSION_CODE, VERSION_NAME.
import fs from "node:fs";

const cfg = JSON.parse(fs.readFileSync("admob.config.json", "utf8"));
const code = process.env.VERSION_CODE || "1";
const name = process.env.VERSION_NAME || "1.0";

// 1. Identifiant d'application AdMob dans le manifeste Android
const manifestPath = "android/app/src/main/AndroidManifest.xml";
let manifest = fs.readFileSync(manifestPath, "utf8");
if (!manifest.includes("com.google.android.gms.ads.APPLICATION_ID")) {
  manifest = manifest.replace(
    "</application>",
    `    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${cfg.appId}" />\n    </application>`
  );
  fs.writeFileSync(manifestPath, manifest);
}

// 2. Numéro de version
const gradlePath = "android/app/build.gradle";
let gradle = fs.readFileSync(gradlePath, "utf8");
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "${name}"`);
fs.writeFileSync(gradlePath, gradle);

// 3. Identifiants de bannière / plein écran dans le code de l'application (copie Android uniquement)
const adsPath = "android/app/src/main/assets/public/js/ads.js";
let ads = fs.readFileSync(adsPath, "utf8");
ads = ads
  .replace(/TEST: (true|false)/, `TEST: ${cfg.test ? "true" : "false"}`)
  .replace(/BANNER_ID: "[^"]*"/, `BANNER_ID: "${cfg.bannerId}"`)
  .replace(/INTERSTITIAL_ID: "[^"]*"/, `INTERSTITIAL_ID: "${cfg.interstitialId}"`);
fs.writeFileSync(adsPath, ads);

console.log(`AdMob test=${cfg.test} | app ${cfg.appId} | versionCode ${code} | versionName ${name}`);
