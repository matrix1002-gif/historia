/* Historia — suggestions d'objets (programme Partenaires Amazon).
   Pour activer : créer un compte Partenaires Amazon (amazon.fr pour le français, amazon.com pour l'anglais), puis
   renseigner chaque identifiant de suivi ci-dessous (ex. "historia-21"). Tant qu'il est vide, la rubrique reste invisible.
   Les liens sont des recherches Amazon : aucun prix n'est affiché ni copié depuis Amazon. */
(function () {
  "use strict";
  // Un identifiant par boutique : français -> amazon.fr (programme Partenaires amazon.fr), anglais -> amazon.com (programme amazon.com).
  // Une langue sans identifiant n'affiche pas la rubrique.
  var TAG = { fr: "", en: "historiaquiz-20" };
  var STORE = { fr: "https://www.amazon.fr", en: "https://www.amazon.com" };

  // Objets (pas de livres), un lien de recherche Amazon par objet : [libellé FR, libellé EN, recherche Amazon, courte description FR, EN]
  var ITEMS = {
    gaule: [["Casque de légionnaire romain (réplique)", "Roman legionary helmet replica", "roman legionary helmet replica"], ["Bijou celtique", "Celtic knot jewelry", "celtic knot jewelry"]],
    evangelisation: [["Croix celtique (pendentif)", "Celtic cross necklace", "celtic cross necklace"], ["Carnet style manuscrit enluminé", "Illuminated manuscript notebook", "illuminated manuscript journal"]],
    carolingiens: [["Jeu d'échecs médiéval", "Medieval chess set", "medieval chess set"], ["Set de calligraphie", "Calligraphy pen set", "calligraphy pen set"]],
    moines: [["Bougies en cire d'abeille", "Beeswax candles", "pure beeswax candles"], ["Set de calligraphie", "Calligraphy pen set", "calligraphy pen set"]],
    chevaliers: [["Casque de chevalier (réplique)", "Medieval knight helmet replica", "medieval knight helmet replica"], ["Jeu de société médiéval", "Medieval board game", "medieval board game"]],
    croisades: [["Carte du Moyen Âge (affiche)", "Medieval world map poster", "medieval world map poster"], ["Jeu de société médiéval", "Medieval strategy board game", "medieval strategy board game"]],
    capetiens: [["Puzzle cathédrale gothique", "Gothic cathedral jigsaw puzzle", "gothic cathedral jigsaw puzzle"], ["Maquette Notre-Dame", "Notre-Dame cathedral model kit", "notre dame cathedral model kit"]],
    renaissance: [["Puzzle d'art de la Renaissance", "Renaissance art jigsaw puzzle", "renaissance art jigsaw puzzle 1000"], ["Maquette Léonard de Vinci", "Leonardo da Vinci wooden model kit", "leonardo da vinci wooden model kit"]],
    "grand-siecle": [["Puzzle du château de Versailles", "Palace of Versailles jigsaw puzzle", "palace of versailles jigsaw puzzle"], ["Jeu de cartes d'histoire de France", "French history playing cards", "french history playing cards"]],
    revolution: [["Drapeau français", "French flag", "french flag tricolor"], ["Jeu de société Révolution française", "French Revolution board game", "french revolution board game"]],
    empire: [["Bicorne de Napoléon", "Napoleon bicorne hat", "napoleon bicorne hat"], ["Jeu de stratégie napoléonien", "Napoleonic wars board game", "napoleonic wars board game"]],
    modernes: [["Maquette de la tour Eiffel", "Eiffel Tower model kit", "eiffel tower model kit"], ["Jeu de société d'histoire", "History board game", "history strategy board game"]]
  };

  function lang() { return (window.HI && window.HI.lang) === "en" ? "en" : "fr"; }
  function url(l, q) {
    return STORE[l] + "/s?k=" + encodeURIComponent(q) + "&tag=" + encodeURIComponent(TAG[l]);
  }
  window.HistoriaAff = {
    enabled: function () { return !!TAG[lang()]; },
    books: function (eraId) {
      var l = lang();
      if (!TAG[l]) return [];
      return (ITEMS[eraId] || []).map(function (b) { return { title: l === "en" ? b[1] : b[0], author: "", url: url(l, l === "en" ? b[2] : b[0].replace(/\s*\(.*\)/, "")) }; });
    },
    disclosure: function () {
      return lang() === "en"
        ? "As an Amazon Associate I earn from qualifying purchases."
        : "En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.";
    },
    open: function (href) {
      var B = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
      if (B && B.open) B.open({ url: href }).catch(function () { window.open(href, "_blank", "noopener"); });
      else window.open(href, "_blank", "noopener");
    }
  };
})();
