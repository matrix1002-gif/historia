/* Historia — scènes « Trouve les intrus » en vraies images (peintures).
   Dépose l'image dans www/img/intrus/ puis ajoute un bloc ci-dessous. Les coordonnées (x, y, r) sont en pixels de l'image :
   génère-les avec tools/intrus-editor.html (clique sur l'intrus, copie le bloc obtenu). */
(function () {
  "use strict";
  const H = window.HistoriaIntrus;
  if (!H) return;
  const IMAGES = [
    /* Exemple (décommente et adapte) :
    {
      id: "banquet-peinture",
      img: "img/intrus/banquet.jpg", w: 1600, h: 1000,
      title: { fr: "Le grand banquet", en: "The great banquet" },
      intruders: [
        { x: 812, y: 540, r: 45, name: { fr: "Un smartphone", en: "A smartphone" }, text: { fr: "…", en: "…" } },
        { x: 300, y: 700, r: 45, name: { fr: "…", en: "…" }, text: { fr: "…", en: "…" } },
        { x: 1300, y: 400, r: 45, name: { fr: "…", en: "…" }, text: { fr: "…", en: "…" } }
      ]
    }
    */
  ];
  // Les peintures passent avant les scènes dessinées en SVG.
  IMAGES.forEach((s) => H.scenes.unshift(s));
})();
