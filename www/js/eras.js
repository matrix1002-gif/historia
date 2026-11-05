/* Historia — liste des époques et des rangs.
   Le contenu (niveaux, fiches, défis) est dans js/eras/<id>.js, chargé après ce fichier. */
window.HISTORIA_CONTENT = {};

const ERA_META = [
  { id: "gaule",          num: "I",    title: "Gaulois & Romains",               period: "Ier s. av. J.-C. – Ve s.", accent: "#5fae86", icon: "helmet",   scene: "gaule" },
  { id: "evangelisation", num: "II",   title: "L'Europe se convertit",           period: "IVe – XIe siècle",         accent: "#a98ad6", icon: "celtic",   scene: "evangelisation" },
  { id: "carolingiens",   num: "III",  title: "Francs & Carolingiens",           period: "Ve – Xe siècle",           accent: "#e0b24f", icon: "crown",    scene: "carolingiens" },
  { id: "moines",         num: "IV",   title: "Moines & monastères",             period: "VIe – XIIIe siècle",       accent: "#d9825f", icon: "book",     scene: "moines" },
  { id: "chevaliers",     num: "V",    title: "Chevaliers & féodalité",          period: "Xe – XVe siècle",          accent: "#8fa7d9", icon: "sword",    scene: "chevaliers" },
  { id: "croisades",      num: "VI",   title: "Les Croisades",                   period: "1095 – 1291",              accent: "#e06a6a", icon: "jerusalem",scene: "croisades" },
  { id: "capetiens",      num: "VII",  title: "Capétiens & Guerre de Cent Ans",  period: "987 – 1453",               accent: "#6fb3d9", icon: "lis",      scene: "capetiens" },
  { id: "renaissance",    num: "VIII", title: "Renaissance & guerres de Religion", period: "1494 – 1598",            accent: "#e58fb0", icon: "turret",   scene: "renaissance" },
  { id: "grand-siecle",   num: "IX",   title: "Le Grand Siècle",                 period: "1598 – 1715",              accent: "#f2d16b", icon: "sun",      scene: "grand-siecle" },
  { id: "revolution",     num: "X",    title: "Lumières & Révolution",           period: "1715 – 1799",              accent: "#6ec6c1", icon: "phrygian", scene: "revolution" },
  { id: "empire",         num: "XI",   title: "Napoléon & le XIXe siècle",       period: "1799 – 1870",              accent: "#c9d2e6", icon: "arch",     scene: "empire" },
  { id: "modernes",       num: "XII",  title: "Le monde contemporain",           period: "1870 – aujourd'hui",       accent: "#7fc4e8", icon: "tower",    scene: "modernes" }
];

const RANKS = [
  { xp: 0,     name: "Page" },
  { xp: 100,   name: "Écuyer" },
  { xp: 300,   name: "Chevalier" },
  { xp: 600,   name: "Banneret" },
  { xp: 1000,  name: "Baron" },
  { xp: 1600,  name: "Comte" },
  { xp: 2400,  name: "Marquis" },
  { xp: 3500,  name: "Duc" },
  { xp: 5000,  name: "Connétable" },
  { xp: 7000,  name: "Maréchal" },
  { xp: 9500,  name: "Chroniqueur du royaume" }
];
