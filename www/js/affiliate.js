/* Historia — suggestions de lecture (programme Partenaires Amazon).
   Pour activer : créer un compte Partenaires Amazon (amazon.fr et/ou amazon.com), puis renseigner votre
   identifiant de suivi ci-dessous (ex. "historia-21"). Tant qu'il est vide, la rubrique reste invisible.
   Les liens sont des recherches Amazon : aucun prix n'est affiché ni copié depuis Amazon. */
(function () {
  "use strict";
  var TAG = { fr: "", en: "" };
  var STORE = { fr: "https://www.amazon.fr", en: "https://www.amazon.com" };

  var BOOKS = {
    fr: {
      gaule: [["La Guerre des Gaules", "Jules César"], ["Les Celtes : histoire et dictionnaire", "Venceslas Kruta"]],
      evangelisation: [["La Conversion de l'Europe", "Richard Fletcher"], ["Histoire ecclésiastique du peuple anglais", "Bède le Vénérable"]],
      carolingiens: [["Charlemagne", "Jean Favier"], ["Vie de Charlemagne", "Éginhard"]],
      moines: [["La Règle de saint Benoît", "Benoît de Nursie"], ["Le Nom de la rose", "Umberto Eco"]],
      chevaliers: [["Chevaliers et chevalerie au Moyen Âge", "Jean Flori"], ["Guillaume le Maréchal ou le Meilleur Chevalier du monde", "Georges Duby"]],
      croisades: [["Les Croisades vues par les Arabes", "Amin Maalouf"], ["L'Épopée des croisades", "René Grousset"]],
      capetiens: [["Saint Louis", "Jacques Le Goff"], ["La Guerre de Cent Ans", "Philippe Contamine"]],
      renaissance: [["La Reine Margot", "Alexandre Dumas"], ["Les Guerres de Religion", "Nicolas Le Roux"]],
      "grand-siecle": [["Louis XIV", "François Bluche"], ["Mémoires", "Saint-Simon"]],
      revolution: [["Histoire de la Révolution française", "Jules Michelet"], ["Quatre-vingt-treize", "Victor Hugo"]],
      empire: [["Napoléon", "Jean Tulard"], ["Les Misérables", "Victor Hugo"]]
    },
    en: {
      gaule: [["The Gallic War", "Julius Caesar"], ["The Ancient Celts", "Barry Cunliffe"]],
      evangelisation: [["The Barbarian Conversion", "Richard Fletcher"], ["Ecclesiastical History of the English People", "Bede"]],
      carolingiens: [["Two Lives of Charlemagne", "Einhard and Notker"], ["Charlemagne", "Janet Nelson"]],
      moines: [["The Rule of Saint Benedict", "Benedict of Nursia"], ["The Name of the Rose", "Umberto Eco"]],
      chevaliers: [["The Knight in History", "Frances Gies"], ["William Marshal", "Georges Duby"]],
      croisades: [["The Crusades Through Arab Eyes", "Amin Maalouf"], ["The Crusades: The Authoritative History", "Thomas Asbridge"]],
      capetiens: [["A Distant Mirror", "Barbara Tuchman"], ["Saint Louis", "Jacques Le Goff"]],
      renaissance: [["Queen Margot", "Alexandre Dumas"], ["The French Wars of Religion", "R. J. Knecht"]],
      "grand-siecle": [["Louis XIV", "John B. Wolf"], ["Memoirs of the Duke of Saint-Simon", "Saint-Simon"]],
      revolution: [["Citizens", "Simon Schama"], ["A Tale of Two Cities", "Charles Dickens"]],
      empire: [["Napoleon: A Life", "Andrew Roberts"], ["Les Misérables", "Victor Hugo"]]
    }
  };

  function lang() { return (window.HI && window.HI.lang) === "en" ? "en" : "fr"; }
  function url(l, title, author) {
    return STORE[l] + "/s?k=" + encodeURIComponent(title + " " + author) + "&tag=" + encodeURIComponent(TAG[l]);
  }
  window.HistoriaAff = {
    enabled: function () { return !!TAG[lang()]; },
    books: function (eraId) {
      var l = lang();
      if (!TAG[l]) return [];
      return ((BOOKS[l] || {})[eraId] || []).map(function (b) { return { title: b[0], author: b[1], url: url(l, b[0], b[1]) }; });
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
