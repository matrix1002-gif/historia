/* Historia — langue (français / anglais).
   - Le français est la langue d'origine : rien n'est modifié.
   - En anglais, les titres d'époques et les rangs sont remplacés ici, le contenu (fiches, quiz) vient de js/eras/en/*.js
     et le reste de l'interface est traduit à la volée (dictionnaire + motifs) à mesure que les écrans s'affichent. */
(function () {
  "use strict";
  var lang = "";
  try { lang = localStorage.getItem("historia.lang") || ""; } catch (e) { /* ignoré */ }
  if (lang !== "fr" && lang !== "en") lang = /^fr/i.test(navigator.language || "fr") ? "fr" : "en";

  var IDS = ["gaule", "evangelisation", "carolingiens", "moines", "chevaliers", "croisades", "capetiens", "renaissance", "grand-siecle", "revolution", "empire", "modernes"];
  window.HI = {
    lang: lang,
    set: function (l) { try { localStorage.setItem("historia.lang", l); } catch (e) { /* ignoré */ } location.reload(); },
    t: function (s) { return lang === "en" ? (tx(s) || s) : s; }
  };

  // Chargement du contenu dans la bonne langue (les scripts s'exécutent dans l'ordre).
  var dir = lang === "en" ? "js/eras/en/" : "js/eras/";
  var EN_READY = ["gaule", "evangelisation", "carolingiens", "moines", "chevaliers", "croisades", "capetiens", "renaissance", "grand-siecle", "revolution", "empire", "modernes"]; // époques déjà traduites en anglais
  IDS.forEach(function (id) { if (lang === "en" && EN_READY.indexOf(id) < 0) return; document.write('<script src="' + dir + id + '.js" onerror="void 0"><\/script>'); });

  document.write('<script src="js/daily/' + lang + '.js"><\/script>'); // personnage et saint du jour
  document.write('<script src="js/daily/more-' + lang + '.js"><\/script>'); // suite du récit du jour
  document.write('<script src="js/easy/more-' + lang + '.js"><\/script>'); // questions thématiques supplémentaires
  document.write('<script src="js/easy/lv-' + lang + '.js"><\/script>'); // questions par chapitre
  document.write('<script src="js/easy/' + lang + '.js"><\/script>'); // questions de culture générale

  if (lang !== "en") return;
  document.documentElement.lang = "en";
  document.title = "Historia – History of France and of Christendom";

  /* ---------- Époques et rangs ---------- */
  var ERA_EN = {
    gaule: ["Gauls & Romans", "1st c. BC – 5th c."],
    evangelisation: ["Europe Converts", "4th – 11th century"],
    carolingiens: ["Franks & Carolingians", "5th – 10th century"],
    moines: ["Monks & Monasteries", "6th – 13th century"],
    chevaliers: ["Knights & Feudalism", "10th – 15th century"],
    croisades: ["The Crusades", "1095 – 1291"],
    capetiens: ["Capetians & the Hundred Years' War", "987 – 1453"],
    renaissance: ["Renaissance & Wars of Religion", "1494 – 1598"],
    "grand-siecle": ["The Grand Siècle", "1598 – 1715"],
    revolution: ["Enlightenment & Revolution", "1715 – 1799"],
    empire: ["Napoleon & the 19th Century", "1799 – 1870"],
    modernes: ["The Contemporary World", "1870 – today"]
  };
  if (typeof ERA_META !== "undefined") ERA_META.forEach(function (m) { var e = ERA_EN[m.id]; if (e) { m.title = e[0]; m.period = e[1]; } });
  var RANK_EN = ["Page", "Squire", "Knight", "Banneret", "Baron", "Count", "Marquis", "Duke", "Constable", "Marshal", "Chronicler of the Realm"];
  if (typeof RANKS !== "undefined") RANKS.forEach(function (r, i) { r.name = RANK_EN[i] || r.name; });

  /* ---------- Dictionnaire (texte complet d'un nœud) ---------- */
  var D = {
    "Apprendre": "Learn", "Quiz": "Quiz", "Jeux": "Games", "Personnages": "Characters", "Médailles": "Medals", "Navigation": "Navigation",
    "L'histoire de France et de la chrétienté": "The history of France and of Christendom",
    "Voyage à travers les siècles": "A journey through the centuries",
    "Choisis ton époque, découvre ses grandes histoires, puis relève le défi du quiz : chaque étoile gagnée te fait grimper de rang !": "Pick your era, discover its great stories, then take on the quiz challenge: every star you earn moves you up a rank!",
    "Lis la fiche": "Read the lesson",
    "Joue au quiz": "Play the quiz",
    "Gagne des étoiles": "Earn stars",
    "Apprendre, époque par époque": "Learn, era by era",
    "Choisis une époque, lis la fiche de chaque niveau, puis passe au quiz pour valider ce que tu as appris.": "Pick an era, read the lesson of each level, then take the quiz to check what you have learned.",
    "Bientôt": "Soon", "Cette époque arrive bientôt.": "This era is coming soon to the English edition.",
    "Confidentialité": "Privacy", "Lancez votre série": "Start your streak", "Sceau obtenu": "Seal earned",
    "Retour": "Back", "Fermer la fiche": "Close lesson", "Quitter la partie": "Quit game", "Fermer": "Close",
    "niveaux réussis": "levels passed", "étoiles": "stars", "sceau": "seal", "Obtenu": "Earned",
    "). Réussir un quiz débloque le niveau suivant.": "). Passing a quiz unlocks the next level.",
    "Touche un niveau pour lire sa fiche, puis passe au quiz (": "Tap a level to read its lesson, then take the quiz (",
    "Le saviez-vous ?": "Did you know?",
    "Passer au quiz du niveau": "Go to the level quiz",
    "Réussis le quiz précédent pour débloquer le quiz": "Pass the previous quiz to unlock this one",
    "Question": "Question", "Vrai ou faux ?": "True or false?", "Chronologie": "Timeline", "Association": "Matching", "Devine l'année": "Guess the year",
    "Vrai": "True", "Faux": "False", "Valider": "Check", "Année": "Year", "Suite": "Next",
    "Touche les cartes dans l'ordre, de la plus ancienne à la plus récente.": "Tap the cards in order, from the oldest to the most recent.",
    "Touche un élément, puis celui qui lui correspond. Touche à nouveau pour défaire.": "Tap an item, then the one that matches it. Tap again to undo.",
    "Exact !": "Correct!", "Pas tout à fait": "Not quite", "Pile dans le mille !": "Bullseye!", "Très proche !": "Very close!", "Un peu à côté": "A bit off",
    "Ta réponse :": "Your answer:", "· Réponse :": "· Answer:", "Voir mon résultat": "See my result",
    "Courage, la fiche t'aidera à réussir.": "Keep going, the lesson will help you pass.", "C'est réussi, continue !": "Passed, keep going!",
    "Bien joué, chevalier !": "Well played, knight!", "Magnifique, digne d'un chroniqueur !": "Magnificent, worthy of a chronicler!",
    "Niveau réussi": "Level passed", "Défi du jour": "Daily challenge", "Tous les niveaux sont réussis": "All levels passed",
    "Nouveau rang": "New rank", "Nouveau personnage": "New character", "Nouveau personnage légendaire": "New legendary character",
    "Médaille obtenue": "Medal earned", "Médailles obtenues": "Medals earned", "À retenir": "To remember",
    "Réessayer le niveau": "Retry the level", "Lire la fiche": "Read the lesson", "Niveau suivant : la fiche": "Next level: the lesson",
    "Viser 3 étoiles": "Aim for 3 stars", "Rejouer le niveau": "Replay the level", "Carte de l'époque": "Era map", "Retour aux époques": "Back to the eras",
    "Teste-toi sur toutes les époques ou sur un seul thème. Pour apprendre d'abord, va dans « Apprendre ».": "Test yourself on every era or on a single theme. To learn first, go to “Learn”.",
    "Le Trésor du Royaume": "The Kingdom's Treasure",
    "15 questions, de plus en plus ardues. Gagne jusqu'à": "15 questions, harder and harder. Win up to",
    "1 000 000 d'écus": "1,000,000 crowns",
    ". Deux paliers te protègent : 1 000 et 32 000 écus. Trois jokers : le 50/50, l'appel au public et l'appel à un historien. Après le million, la": ". Two checkpoints protect you: 1,000 and 32,000 crowns. Three lifelines: 50/50, ask the crowd and call a historian. After the million, the",
    "continue sans limite.": "goes on without limit.", "Légende": "Legend",
    "Tous les thèmes": "All themes", "Ou un seul thème": "Or a single theme", "Les paliers": "The checkpoints", "palier": "checkpoint",
    "Pas encore joué": "Not played yet", "Prochain titre :": "Next title:", "Tu es au sommet du royaume.": "You are at the top of the realm.",
    "Un classement en ligne entre joueurs viendra plus tard. Pour l'instant, bats tes propres records et monte dans les titres.": "An online leaderboard will come later. For now, beat your own records and climb the titles.",
    "Record :": "Record:", "Public": "Crowd", "Historien": "Historian", "50/50": "50/50",
    "Le peuple de la cité a voté": "The townsfolk have voted", "Frère Aubry, chroniqueur": "Brother Aubry, chronicler",
    "Deux mauvaises réponses ont disparu.": "Two wrong answers are gone.",
    "Voir mon bilan": "See my summary", "Récupérer 1 000 000 d'écus": "Collect 1,000,000 crowns", "Question suivante": "Next question",
    "Le Trésor est à toi !": "The Treasure is yours!", "Bonne réponse !": "Correct!", "Mauvaise réponse": "Wrong answer", "La bonne réponse :": "The right answer:",
    "Valider ma réponse": "Lock in my answer", "Abandonner": "Give up", "Palier garanti": "Guaranteed checkpoint", "Aucun palier": "No checkpoint",
    "La Légende ·": "The Legend ·", "Rejouer": "Play again", "Menu du Trésor": "Treasure menu",
    "Le Trésor du Royaume est à toi !": "The Kingdom's Treasure is yours!", "Sage décision, tu repars avec ton or.": "Wise decision, you leave with your gold.",
    "Raté… mais ton palier te protège.": "Missed… but your checkpoint protects you.", "Nouveau record !": "New record!",
    "Personnage verrouillé": "Locked character", "Personnage mystère": "Mystery character", "Les personnages arrivent bientôt.": "Characters are coming soon.",
    "Rangs et réglages": "Ranks and settings", "Les rangs": "The ranks", "Musique": "Music", "Sons": "Sounds", "Vibrations": "Vibrations",
    "Réinitialiser ma progression": "Reset my progress",
    "Effacer toute votre progression (XP, rangs, niveaux, sceaux, série) ?": "Erase all your progress (XP, ranks, levels, seals, streak)?",
    "Abandonner la partie ? Tu garderas ton dernier palier.": "Give up the game? You keep your last checkpoint.",
    "Manant": "Peasant", "Artisan": "Artisan", "Bourgeois": "Burgher", "Chevalier": "Knight", "Baron": "Baron", "Comte": "Count", "Duc": "Duke", "Roi": "King", "Empereur": "Emperor", "Légende vivante": "Living Legend",
    "Langue": "Language", "Français": "Français", "English": "English",
    "Sans publicité": "Ad-free", "Rétablir mon achat": "Restore my purchase", "Merci ! Les publicités sont désactivées.": "Thank you! Ads are turned off.",
    "Pour aller plus loin": "Further reading", "Sans publicité ✓": "Ad-free ✓", "Langue / Language": "Langue / Language",
    "En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.": "As an Amazon Associate I earn from qualifying purchases.",
    // Médailles
    "Premiers pas": "First steps", "Réussis ton premier niveau.": "Pass your first level.",
    "Apprenti": "Apprentice", "Réussis 10 niveaux.": "Pass 10 levels.", "Compagnon": "Journeyman", "Réussis 30 niveaux.": "Pass 30 levels.",
    "Maître": "Master", "Réussis 60 niveaux.": "Pass 60 levels.", "Grand Maître": "Grand Master", "Réussis les 120 niveaux.": "Pass all 120 levels.",
    "Étoile d'or": "Gold star", "Obtiens 3 étoiles à un niveau.": "Get 3 stars on a level.", "Constellation": "Constellation", "Obtiens 3 étoiles à 10 niveaux.": "Get 3 stars on 10 levels.",
    "Voûte céleste": "Starry vault", "Obtiens 3 étoiles à 40 niveaux.": "Get 3 stars on 40 levels.",
    "Premier sceau": "First seal", "Termine une époque entière.": "Complete a whole era.", "Chancelier": "Chancellor", "Obtiens 5 sceaux d'époque.": "Earn 5 era seals.",
    "Sceau du royaume": "Seal of the realm", "Obtiens les 12 sceaux.": "Earn all 12 seals.",
    "Collectionneur": "Collector", "Débloque 5 personnages.": "Unlock 5 characters.", "Galerie royale": "Royal gallery", "Débloque 25 personnages.": "Unlock 25 characters.",
    "Panthéon": "Pantheon", "Débloque tous les personnages.": "Unlock every character.",
    "Veilleur": "Watchman", "Joue 3 jours de suite.": "Play 3 days in a row.", "Gardien": "Guardian", "Joue 7 jours de suite.": "Play 7 days in a row.",
    "Sentinelle": "Sentinel", "Joue 14 jours de suite.": "Play 14 days in a row.", "Mois de feu": "Month of fire", "Joue 30 jours de suite.": "Play 30 days in a row.",
    "Flamme éternelle": "Eternal flame", "Joue 100 jours de suite.": "Play 100 days in a row.",
    "Entrée à la cour": "Entering the court", "Joue au Trésor du Royaume.": "Play the Kingdom's Treasure.",
    "Coffre de bronze": "Bronze chest", "Atteins le palier 1 000 écus.": "Reach the 1,000 crowns checkpoint.",
    "Coffre d'argent": "Silver chest", "Atteins le palier 32 000 écus.": "Reach the 32,000 crowns checkpoint.",
    "Roi du Trésor": "King of the Treasure", "Gagne 1 000 000 d'écus.": "Win 1,000,000 crowns.",
    "Au-delà du Trésor": "Beyond the Treasure", "Réponds à une question de la Légende.": "Answer a Legend question.",
    "Réponds à 10 questions de la Légende.": "Answer 10 Legend questions.", "Immortel": "Immortal", "Réponds à 30 questions de la Légende.": "Answer 30 Legend questions.",
    "Sans filet": "No safety net", "Gagne le Trésor sans aucun joker.": "Win the Treasure without any lifeline.",
    "Esprit universel": "Universal mind", "Atteins 32 000 écus en « Tous les thèmes ».": "Reach 32,000 crowns in “All themes”.",
    "Atteins le rang de Chevalier.": "Reach the rank of Knight.", "Atteins le rang de Comte.": "Reach the rank of Count.", "Atteins le rang de Connétable.": "Reach the rank of Constable.",
    "Bonne mémoire": "Good memory", "Découvre 200 bonnes réponses.": "Discover 200 correct answers.", "Mémoire d'éléphant": "Elephant's memory", "Découvre 800 bonnes réponses.": "Discover 800 correct answers.",
    "Frère Aubry": "Brother Aubry"
  };
  // Les noms de médailles identiques aux rangs sont déjà dans D (Chevalier, Comte, Connétable → via RANKS).
  D["Connétable"] = "Constable"; D["Chevalier"] = "Knight"; D["Comte"] = "Count"; D["Baron"] = "Baron";

  function num(s) { return String(s).replace(/[\s  ]/g, ""); }
  function en(nStr) { var n = Number(num(nStr)); return isNaN(n) ? nStr : n.toLocaleString("en-US"); }
  function pl(n, a, b) { return Number(n) === 1 ? a : b; }

  /* ---------- Motifs (texte complet d'un nœud, avec nombres) ---------- */
  var P = [
    [/^Époque (\S+)$/, function (m) { return "Era " + m[1]; }],
    [/^(.+), (\d+) niveaux réussis sur (\d+)$/, function (m, t) { return t(m[1]) + ", " + m[2] + " levels passed out of " + m[3]; }],
    [/^Voir les rangs\. Rang actuel : (.+)$/, function (m, t) { return "View the ranks. Current rank: " + t(m[1]); }],
    [/^(\d+) jours? de suite$/, function (m) { return m[1] + " " + pl(m[1], "day", "days") + " in a row"; }],
    [/^Apprendre : niveau (\d+), (.+)$/, function (m) { return "Learn: level " + m[1] + ", " + m[2]; }],
    [/^Quiz du niveau (\d+), verrouillé : réussis le quiz précédent$/, function (m) { return "Level " + m[1] + " quiz, locked: pass the previous quiz"; }],
    [/^Quiz du niveau (\d+)$/, function (m) { return "Level " + m[1] + " quiz"; }],
    [/^Niveau (\d+) · (.+)$/, function (m) { return "Level " + m[1] + " · " + m[2]; }],
    [/^(.+) · Niveau (\d+)$/, function (m, t) { return t(m[1]) + " · Level " + m[2]; }],
    [/^· Niveau (\d+)$/, function (m) { return "· Level " + m[1]; }],
    [/^Niveau (\d+)$/, function (m) { return "Level " + m[1]; }],
    [/^Défi (\d+) sur (\d+)$/, function (m) { return "Challenge " + m[1] + " of " + m[2]; }],
    [/^(\d+) étoiles? sur (\d+)$/, function (m) { return m[1] + " " + pl(m[1], "star", "stars") + " out of " + m[2]; }],
    [/^· écart de (\d+) ans?$/, function (m) { return "· off by " + m[1] + " " + pl(m[1], "year", "years"); }],
    [/^Il faut (\d+) bonnes réponses pour ouvrir le niveau suivant\.$/, function (m) { return "You need " + m[1] + " correct answers to open the next level."; }],
    [/^Tous les niveaux sont réussis · \+(\d+) XP$/, function (m) { return "All levels passed · +" + m[1] + " XP"; }],
    [/^Nouvelles? médailles?$/, function () { return "New medals"; }],
    [/^Médailles? obtenues?$/, function () { return "Medals earned"; }],
    [/^(\d+) sur (\d+) personnages\. Réussis les niveaux pairs \(2, 4, 6, 8 et 10\) de chaque époque pour les rencontrer\.$/, function (m) { return m[1] + " of " + m[2] + " characters. Pass the even levels (2, 4, 6, 8 and 10) of each era to meet them."; }],
    [/^Réussis le niveau (\d+) de l'époque « (.+) » pour le rencontrer\.$/, function (m) { return "Pass level " + m[1] + " of the era “" + m[2] + "” to meet them."; }],
    [/^(\d+) médailles sur (\d+)\. Joue chaque jour, termine des époques, tente le Trésor du Royaume\.$/, function (m) { return m[1] + " of " + m[2] + " medals. Play every day, complete eras, try the Kingdom's Treasure."; }],
    [/^(\d+) bonnes? réponses? découvertes? sur (\d+)\. Chaque réponse nouvelle rapporte (\d+) XP, un niveau réussi (\d+) XP, un sceau d'époque (\d+) XP\.$/, function (m) { return m[1] + " correct " + pl(m[1], "answer", "answers") + " discovered out of " + m[2] + ". Each new answer earns " + m[3] + " XP, a level passed " + m[4] + " XP, an era seal " + m[5] + " XP."; }],
    [/^(\d+) bonnes? réponses? découvertes? sur (\d+)\.$/, function (m) { return m[1] + " correct answers discovered out of " + m[2] + "."; }],
    [/^Question (\d+) sur (\d+)$/, function (m) { return "Question " + m[1] + " of " + m[2]; }],
    [/^Légende n°(\d+)$/, function (m) { return "Legend no. " + m[1]; }],
    [/^· Légende n°(\d+)$/, function (m) { return "· Legend no. " + m[1]; }],
    [/^(\d+)\/15 bonnes réponses$/, function (m) { return m[1] + "/15 correct answers"; }],
    [/^(.+) \(utilisé\)$/, function (m, t) { return t(m[1]) + " (used)"; }],
    [/^à ([\d\s  ]+) écus?$/, function (m) { return "at " + en(m[1]) + " crowns"; }],
    [/^([\d\s  ]+) écus?$/, function (m) { return en(m[1]) + " " + pl(num(m[1]), "crown", "crowns"); }],
    [/^Record : ([\d\s  ]+) écus?(?: · (.+?))?(?: · Légende n°(\d+))?$/, function (m, t) { return "Record: " + en(m[1]) + " crowns" + (m[2] ? " · " + t(m[2]) : "") + (m[3] ? " · Legend no. " + m[3] : ""); }],
    [/^Record : ([\d\s  ]+) écus?$/, function (m) { return "Record: " + en(m[1]) + " crowns"; }],
    [/^Je m'arrête · garder ([\d\s  ]+) écus?$/, function (m) { return "I stop here · keep " + en(m[1]) + " crowns"; }],
    [/^Partir avec ([\d\s  ]+) écus? \?$/, function (m) { return "Leave with " + en(m[1]) + " crowns?"; }],
    [/^Continuer vers la Légende · risque de tout perdre sauf ([\d\s  ]+) écus?$/, function (m) { return "Continue to the Legend · risk losing everything except " + en(m[1]) + " crowns"; }],
    [/^Légende n°(\d+) : tu repars couvert de gloire !$/, function (m) { return "Legend no. " + m[1] + ": you leave covered in glory!"; }],
    [/^Tombé à la Légende n°(\d+)… mais ton palier te protège\.$/, function (m) { return "Fell at Legend no. " + m[1] + "… but your checkpoint protects you."; }],
    [/^La Légende · (.+)$/, function (m, t) { return "The Legend · " + t(m[1]); }],
    [/^(.+) · légendaire$/, function (m, t) { return t(m[1]) + " · legendary"; }],
    [/^« (.+) »$/, function (m, t) { return "“" + t(m[1]) + "”"; }],
    [/^Voilà un point que je connais bien : c'est la réponse ([A-D])\.$/, function (m) { return "That is a point I know well: the answer is " + m[1] + "."; }],
    [/^Sans hésiter, la ([A-D])\.$/, function (m) { return "Without hesitation, " + m[1] + "."; }],
    [/^Il me semble bien que c'est la ([A-D]), mais je ne le jurerais pas\.$/, function (m) { return "I believe it is " + m[1] + ", but I would not swear to it."; }],
    [/^Mes manuscrits penchent pour la ([A-D])\.$/, function (m) { return "My manuscripts lean towards " + m[1] + "."; }],
    [/^Honnêtement, je ne suis pas certain… je dirais la ([A-D])\.$/, function (m) { return "Honestly, I am not certain… I would say " + m[1] + "."; }],
    [/^Question redoutable\. Mon instinct d'historien me souffle la ([A-D])\.$/, function (m) { return "A formidable question. My historian's instinct whispers " + m[1] + "."; }]
  ];

  function tx(s) {
    var core = s.trim();
    if (!core) return null;
    var lead = s.slice(0, s.indexOf(core)), trail = s.slice(s.indexOf(core) + core.length);
    var r = D[core];
    if (r === undefined) {
      for (var i = 0; i < P.length; i++) {
        var m = P[i][0].exec(core);
        if (m) { r = P[i][1](m, function (x) { return tx(x) || x; }); break; }
      }
    }
    if (r === undefined) return null;
    return lead + r + trail;
  }

  /* ---------- Application au DOM ---------- */
  var ATTRS = ["aria-label", "title", "placeholder", "alt"];
  function fixText(n) {
    var v = n.nodeValue;
    if (!v || !/\S/.test(v)) return;
    var r = tx(v);
    if (r !== null && r !== v) n.nodeValue = r;
  }
  function fixEl(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = el.getAttribute(ATTRS[i]);
      if (a) { var r = tx(a); if (r !== null && r !== a) el.setAttribute(ATTRS[i], r); }
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1) return;
    if (root.tagName === "SCRIPT" || root.tagName === "STYLE" || root.tagName === "svg") return;
    fixEl(root);
    var w = document.createTreeWalker(root, 5, null); // texte + éléments
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) fixText(n);
      else if (n.tagName !== "SCRIPT" && n.tagName !== "STYLE") fixEl(n);
    }
  }
  var busy = false;
  function start() {
    walk(document.body);
    new MutationObserver(function (list) {
      if (busy) return;
      busy = true;
      try {
        list.forEach(function (m) {
          if (m.type === "childList") m.addedNodes.forEach(walk);
          else if (m.type === "characterData") fixText(m.target);
          else if (m.type === "attributes") fixEl(m.target);
        });
      } finally { busy = false; }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
