// Fabrique les fichiers binaires (polices, icônes, écran de démarrage) à partir de sources texte.
// À lancer après "npm install" et avant la publication du site ou la construction Android.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const fonts = [
  ["@fontsource/cinzel", "cinzel-latin-500-normal.woff2"],
  ["@fontsource/cinzel", "cinzel-latin-700-normal.woff2"],
  ["@fontsource/eb-garamond", "eb-garamond-latin-400-normal.woff2"],
  ["@fontsource/eb-garamond", "eb-garamond-latin-400-italic.woff2"],
  ["@fontsource/eb-garamond", "eb-garamond-latin-600-normal.woff2"]
];
fs.mkdirSync("www/fonts", { recursive: true });
for (const [pkg, file] of fonts) fs.copyFileSync(path.join("node_modules", pkg, "files", file), path.join("www/fonts", file));

async function png(src, out, size) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(src, { density: 300 }).resize(size, size).png().toFile(out);
}
await png("www/icons/icon.svg", "www/icons/icon-192.png", 192);
await png("www/icons/icon.svg", "www/icons/icon-512.png", 512);
await png("www/icons/icon-maskable.svg", "www/icons/icon-maskable-512.png", 512);
await png("www/icons/icon.svg", "assets/icon-only.png", 1024);
await png("assets-src/icon-background.svg", "assets/icon-background.png", 1024);
await png("assets-src/icon-foreground.svg", "assets/icon-foreground.png", 1024);
await png("assets-src/splash.svg", "assets/splash.png", 2732);
await png("assets-src/splash.svg", "assets/splash-dark.png", 2732);
console.log("Polices et icônes prêtes.");
