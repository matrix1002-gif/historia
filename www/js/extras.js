/* Historia — chroniques (leçons) et jeux supplémentaires, rattachés aux époques de data.js par leur id.
   lesson : cartes à lire avant le quiz  { d: date, t: titre, p: texte }
   tf     : vrai ou faux                 { q, a: true|false, e }
   order  : remettre dans l'ordre        { q, items: [{ t, y }] }  — items DÉJÀ dans le bon ordre, y = repère affiché à la correction
   match  : associer                     { q, pairs: [[gauche, droite], ...] }
   year   : deviner l'année              { q, y, min, max, tol, e }  — années avant J.-C. en négatif */

const EXTRAS = {
  gaule: {
    lesson: [
      { d: "Vers 600 av. J.-C.", t: "Des Celtes et des Grecs",
        p: "Bien avant la France, il y a la Gaule : un patchwork de peuples celtes, Arvernes, Éduens, Parisii… Ils forgent le fer, frappent monnaie et s'abritent dans de vastes places fortes, les oppida. Sur la côte, des marins grecs venus de Phocée fondent Massalia, la future Marseille." },
      { d: "58 – 52 av. J.-C.", t: "César contre Vercingétorix",
        p: "Jules César conquiert la Gaule en huit ans. En 52, un jeune chef arverne, Vercingétorix, unit enfin plusieurs peuples. Il l'emporte à Gergovie, puis s'enferme dans Alésia, où les légions l'encerclent. Pour épargner son armée affamée, il se rend. Les Gaulois, trop divisés, ont perdu." },
      { d: "Ier – IIIe siècle", t: "La Gaule romaine",
        p: "En deux siècles, la Gaule change de visage : routes pavées, aqueducs, thermes, théâtres et amphithéâtres à Lyon, Nîmes ou Arles. On parle de plus en plus latin, la langue dont naîtra le français. Les Gaulois deviennent des Gallo-Romains." },
      { d: "177 – 380", t: "Les premiers chrétiens",
        p: "L'Évangile remonte la vallée du Rhône jusqu'à Lyon. En 177, une persécution frappe la communauté : l'évêque Pothin et la jeune esclave Blandine comptent parmi les martyrs. En 313, Constantin accorde la liberté de culte ; en 380, Théodose fait du christianisme la religion de l'Empire." }
    ],
    tf: [
      { q: "Vercingétorix a remporté la bataille de Gergovie contre César.", a: true,
        e: "À Gergovie, les légions de César doivent battre en retraite. Mais cette victoire gauloise reste sans lendemain : Alésia, quelques mois plus tard, scelle la défaite." },
      { q: "L'édit de Milan, en 313, fait du christianisme la religion officielle de l'Empire romain.", a: false,
        e: "L'édit de Milan accorde la liberté de culte à tous, chrétiens compris. Le christianisme ne devient religion officielle qu'en 380, sous Théodose." },
      { q: "Les Gaulois frappaient leurs propres monnaies avant la conquête romaine.", a: true,
        e: "Dès le IIIe siècle av. J.-C., de nombreux peuples gaulois émettent des monnaies d'or, d'argent et de bronze, souvent inspirées de modèles grecs." }
    ],
    order: [
      { q: "Remets ces événements dans l'ordre chronologique.",
        items: [{ t: "Fondation de Massalia", y: "vers 600 av. J.-C." }, { t: "Siège d'Alésia", y: "52 av. J.-C." }, { t: "Martyrs de Lyon", y: "177" }, { t: "Édit de Milan", y: "313" }] }
    ],
    match: [
      { q: "Associe chaque nom à son rôle.",
        pairs: [["Vercingétorix", "Chef gaulois vaincu à Alésia"], ["César", "Auteur de La Guerre des Gaules"], ["Blandine", "Martyre de Lyon en 177"], ["Constantin", "Édit de Milan, 313"]] }
    ],
    year: [
      { q: "En quelle année Vercingétorix se rend-il à César, à Alésia ?", y: -52, min: -90, max: -10, tol: 3,
        e: "C'est en 52 av. J.-C. qu'il dépose les armes. Il sera exécuté à Rome en 46 av. J.-C., après le triomphe de César." },
      { q: "En quelle année l'édit de Milan accorde-t-il la liberté de culte ?", y: 313, min: 230, max: 400, tol: 5,
        e: "En 313, Constantin et Licinius mettent fin aux persécutions." }
    ]
  },

  evangelisation: {
    lesson: [
      { d: "Vers 50", t: "Paul franchit la mer",
        p: "Vers l'an 50, l'apôtre Paul de Tarse passe en Macédoine : à Philippes, l'Évangile prend pied sur le sol européen. Puis viennent Athènes, Corinthe, Rome. Le long des routes de l'Empire, de petites communautés se forment, malgré les persécutions." },
      { d: "IVe – Ve siècle", t: "Martin et Patrick",
        p: "Martin, soldat romain devenu évêque de Tours, fonde le monastère de Ligugé et évangélise les campagnes de Gaule. Au siècle suivant, Patrick, né en Bretagne insulaire et un temps esclave en Irlande, y retourne comme missionnaire : l'île devient une terre de moines." },
      { d: "VIe – VIIIe siècle", t: "Les moines voyageurs",
        p: "Colomban quitte l'Irlande vers 590 et fonde Luxeuil puis Bobbio. En 597, Augustin, envoyé par le pape Grégoire le Grand, débarque dans le Kent. Boniface, lui, part chez les Germains : il abat le chêne sacré de Geismar vers 723 et sera tué en Frise en 754." },
      { d: "IXe – XIe siècle", t: "Slaves, Vikings, Hongrois",
        p: "Cyrille et Méthode créent un alphabet pour traduire l'Évangile en langue slave. Mieszko Ier de Pologne est baptisé en 966, le prince Vladimir de Kiev en 988, Étienne Ier de Hongrie reçoit sa couronne vers l'an 1000. Au nord, Anschaire prêche au Danemark et en Suède. L'Europe chrétienne prend forme." }
    ],
    tf: [
      { q: "Saint Patrick est né en Irlande.", a: false,
        e: "Patrick est né en Bretagne insulaire, dans l'Empire romain. Capturé adolescent par des pirates, il est emmené comme esclave en Irlande, où il reviendra plus tard comme évêque." },
      { q: "Cyrille et Méthode ont créé un alphabet pour traduire l'Évangile en langue slave.", a: true,
        e: "Ils mettent au point l'alphabet glagolitique, ancêtre de l'alphabet cyrillique, et traduisent des textes liturgiques en slavon." },
      { q: "Boniface est mort en Frise, tué lors d'une mission, en 754.", a: true,
        e: "Boniface est assassiné près de Dokkum avec ses compagnons. L'Église le vénère comme martyr et « apôtre de la Germanie »." }
    ],
    order: [
      { q: "Remets ces événements dans l'ordre chronologique.",
        items: [{ t: "Martin devient évêque de Tours", y: "vers 371" }, { t: "Augustin débarque dans le Kent", y: "597" }, { t: "Boniface abat le chêne de Geismar", y: "vers 723" }, { t: "Baptême du prince Vladimir", y: "988" }] }
    ],
    match: [
      { q: "Associe chaque saint à sa terre ou à son œuvre.",
        pairs: [["Patrick", "Apôtre de l'Irlande"], ["Colomban", "Luxeuil et Bobbio"], ["Boniface", "Apôtre de la Germanie"], ["Cyrille et Méthode", "Alphabet glagolitique"]] }
    ],
    year: [
      { q: "En quelle année le prince Vladimir de Kiev se fait-il baptiser ?", y: 988, min: 900, max: 1050, tol: 5,
        e: "Vers 988, Vladimir se fait baptiser et impose le christianisme à la Rus' de Kiev, ancêtre de la Russie, de l'Ukraine et de la Biélorussie." },
      { q: "En quelle année Augustin débarque-t-il dans le Kent ?", y: 597, min: 500, max: 700, tol: 5,
        e: "En 597, Augustin et une quarantaine de compagnons sont accueillis par le roi Æthelberht." }
    ]
  },

  carolingiens: {
    lesson: [
      { d: "486 – 511", t: "Clovis, roi des Francs",
        p: "Vers 486, Clovis bat le Romain Syagrius à Soissons. Il épouse Clotilde, une princesse burgonde catholique, et se fait baptiser à Reims par l'évêque Remi, un geste décisif : les évêques et les populations gallo-romaines le soutiennent. En 507, il bat les Wisigoths à Vouillé, s'installe à Paris et meurt en 511." },
      { d: "732 – 751", t: "Des maires du palais au trône",
        p: "Les derniers rois mérovingiens règnent sans gouverner : le pouvoir appartient aux maires du palais. Charles Martel arrête à Poitiers, en 732, un raid venu d'Espagne. Son fils Pépin le Bref met fin à la dynastie : élu roi en 751, il reçoit l'onction et le soutien du pape." },
      { d: "768 – 814", t: "Charlemagne, empereur",
        p: "Roi des Francs en 768, Charlemagne conquiert le royaume lombard, la Bavière et, au prix de guerres longues et dures, la Saxe, dont les habitants sont convertis de force. Le jour de Noël de l'an 800, le pape Léon III le couronne empereur à Rome, dans la basilique Saint-Pierre." },
      { d: "Renaissance carolingienne", t: "Des écoles et des livres",
        p: "Charlemagne s'entoure de lettrés, comme le moine anglo-saxon Alcuin. Il demande que des écoles soient ouvertes près des évêchés et des monastères. On copie les textes anciens en minuscule caroline. Après sa mort, en 814, l'empire se déchire : le traité de Verdun le partage en 843." }
    ],
    tf: [
      { q: "Charlemagne a été couronné empereur à Aix-la-Chapelle.", a: false,
        e: "Il est couronné à Rome, dans la basilique Saint-Pierre, en l'an 800. Aix-la-Chapelle est sa capitale favorite et le lieu de sa sépulture." },
      { q: "Les Mérovingiens tirent leur nom de Mérovée, un ancêtre de Clovis.", a: true,
        e: "Mérovée, chef franc du Ve siècle, est l'ancêtre légendaire de la dynastie. Son petit-fils, Clovis, en est le plus célèbre représentant." },
      { q: "Selon son biographe Éginhard, Charlemagne a appris à écrire tardivement et avec difficulté.", a: true,
        e: "Éginhard raconte que Charlemagne gardait des tablettes sous son oreiller pour s'exercer, mais qu'il s'y est mis trop tard pour réussir." }
    ],
    order: [
      { q: "Remets ces événements dans l'ordre chronologique.",
        items: [{ t: "Bataille de Poitiers", y: "732" }, { t: "Pépin le Bref devient roi", y: "751" }, { t: "Couronnement de Charlemagne", y: "800" }, { t: "Traité de Verdun", y: "843" }] }
    ],
    match: [
      { q: "Associe chaque personnage à son rôle.",
        pairs: [["Clovis", "Baptisé à Reims"], ["Charles Martel", "Vainqueur de Poitiers"], ["Pépin le Bref", "Premier roi carolingien"], ["Alcuin", "Lettré à la cour de Charlemagne"]] }
    ],
    year: [
      { q: "En quelle année Charlemagne est-il couronné empereur ?", y: 800, min: 700, max: 900, tol: 5,
        e: "Le 25 décembre 800, à Rome. Il est le premier empereur d'Occident depuis la chute de l'Empire romain d'Occident, en 476." },
      { q: "En quelle année a lieu la bataille de Poitiers, remportée par Charles Martel ?", y: 732, min: 650, max: 800, tol: 5,
        e: "En 732, parfois datée de 733 : les historiens hésitent encore sur l'année exacte." }
    ]
  },

  moines: {
    lesson: [
      { d: "Vers 529", t: "Benoît au Mont-Cassin",
        p: "Benoît de Nursie fonde le monastère du Mont-Cassin, en Italie. Sa Règle organise la vie commune autour de la prière, de la lecture et du travail. Les moines obéissent à un abbé, restent dans leur monastère et accueillent chaque hôte comme le Christ. Cette règle devient le modèle de l'Occident." },
      { d: "VIe – IXe siècle", t: "Copistes et enlumineurs",
        p: "Dans le scriptorium, les moines copient à la main sur du parchemin, peau d'animal soigneusement préparée. Ils décorent les pages de lettrines et de miniatures dorées. Sans eux, de nombreux textes de l'Antiquité auraient disparu. Les Évangiles de Lindisfarne et le Livre de Kells en sont de célèbres chefs-d'œuvre." },
      { d: "910 – 1115", t: "Cluny, Cîteaux, Clairvaux",
        p: "Cluny, fondée en 910 en Bourgogne, devient une puissance spirituelle qui rayonne sur des centaines de monastères. Mais certains veulent plus de simplicité : à Cîteaux en 1098, puis à Clairvaux, où Bernard s'installe en 1115, les « moines blancs » choisissent la pauvreté et le silence." },
      { d: "Au quotidien", t: "Une journée de moine",
        p: "Huit temps de prière rythment la journée, dont un en pleine nuit. Entre les offices, on cultive, on soigne les malades à l'infirmerie, on copie, on accueille les pèlerins. Défrichements, vignes, élevage : les abbayes transforment les campagnes autant que les esprits." }
    ],
    tf: [
      { q: "Les moines copistes écrivaient sur du papier, comme aujourd'hui.", a: false,
        e: "Ils utilisaient le parchemin, fait de peaux de mouton, de chèvre ou de veau. Le papier ne se répand en Occident qu'à la fin du Moyen Âge." },
      { q: "Le cloître est la galerie couverte qui entoure le jardin intérieur d'une abbaye.", a: true,
        e: "Lieu de promenade, de lecture et de silence, le cloître relie l'église, la salle capitulaire, le réfectoire et le dortoir." },
      { q: "Les cisterciens sont surnommés les « moines blancs » à cause de la couleur de leur habit.", a: true,
        e: "Les moines de Cîteaux portent une robe de laine blanche ou grise, alors que les bénédictins de Cluny sont vêtus de noir." }
    ],
    order: [
      { q: "Remets ces événements dans l'ordre chronologique.",
        items: [{ t: "Benoît fonde le Mont-Cassin", y: "vers 529" }, { t: "Lindisfarne est pillé par les Vikings", y: "793" }, { t: "Fondation de Cluny", y: "910" }, { t: "Naissance de l'ordre de Cîteaux", y: "1098" }] }
    ],
    match: [
      { q: "Associe chaque lieu de l'abbaye à son usage.",
        pairs: [["Scriptorium", "Copie des manuscrits"], ["Réfectoire", "Salle des repas"], ["Cloître", "Galerie autour d'un jardin"], ["Salle capitulaire", "Lecture de la Règle et décisions"]] }
    ],
    year: [
      { q: "En quelle année l'abbaye de Cluny est-elle fondée ?", y: 910, min: 850, max: 1000, tol: 5,
        e: "En 910, grâce à un don du duc d'Aquitaine Guillaume Ier, qui place le monastère sous la seule autorité du pape." },
      { q: "En quelle année naît l'ordre de Cîteaux ?", y: 1098, min: 1020, max: 1170, tol: 5,
        e: "Robert de Molesme et ses compagnons fondent Cîteaux en 1098 pour revenir à une application plus stricte de la Règle de saint Benoît." }
    ]
  },

  chevaliers: {
    lesson: [
      { d: "Xe – XIIe siècle", t: "Le monde féodal",
        p: "Quand l'autorité des rois s'affaiblit, la protection passe aux seigneurs. Un vassal prête hommage à son seigneur et lui promet fidélité et aide militaire ; en échange, il reçoit un fief, une terre à gouverner. Autour d'eux travaillent les paysans, qui nourrissent tout le monde." },
      { d: "De 7 à 21 ans", t: "Devenir chevalier",
        p: "Vers sept ans, le fils d'un noble devient page dans la maison d'un seigneur. Vers quatorze ans, il est écuyer et apprend le combat à cheval. Après une veillée d'armes, il est adoubé : on lui remet l'épée, et il reçoit la collée, un coup sur l'épaule ou la nuque. L'idéal ? Protéger l'Église, les veuves et les orphelins." },
      { d: "XIe – XIIIe siècle", t: "Le château fort",
        p: "D'abord une simple tour sur une butte de terre, le château devient une forteresse de pierre : enceinte, fossés, pont-levis, herse, mâchicoulis, et au centre le donjon. C'est à la fois une demeure, un poste de commandement et un refuge pour les paysans du voisinage." },
      { d: "XIIe – XIIIe siècle", t: "Tournois et blasons",
        p: "Les tournois offrent aux chevaliers un entraînement et un spectacle. Sous le heaume, on ne reconnaît pas les visages : les armoiries peintes sur le bouclier et sur la cotte servent d'identité. C'est la naissance du blason. Guillaume le Maréchal, vainqueur de centaines de tournois, est célébré comme « le meilleur chevalier du monde »." }
    ],
    tf: [
      { q: "Un vassal devait à son seigneur l'hommage, la fidélité et une aide militaire.", a: true,
        e: "C'est la base du lien féodal : le vassal sert, le seigneur protège et lui confie un fief." },
      { q: "Le blason servait surtout à décorer les châteaux.", a: false,
        e: "Les armoiries servaient d'abord à reconnaître les combattants, dont le visage disparaissait sous le heaume. Elles ont ensuite orné châteaux, sceaux et tombeaux." },
      { q: "Le pont-levis permettait de fermer l'entrée d'un château en se relevant.", a: true,
        e: "Relevé, il barre l'accès à la porte et laisse le fossé entre les assaillants et la muraille." }
    ],
    order: [
      { q: "Remets les étapes de la vie d'un chevalier dans l'ordre.",
        items: [{ t: "Page", y: "vers 7 ans" }, { t: "Écuyer", y: "vers 14 ans" }, { t: "Veillée d'armes", y: "la nuit précédente" }, { t: "Adoubement", y: "vers 21 ans" }] }
    ],
    match: [
      { q: "Associe chaque mot à sa définition.",
        pairs: [["Donjon", "Tour principale du château"], ["Herse", "Grille qui coulisse devant la porte"], ["Écuyer", "Jeune au service d'un chevalier"], ["Fief", "Terre confiée à un vassal"]] }
    ],
    year: [
      { q: "En quelle année Guillaume le Conquérant bat-il Harold à Hastings ?", y: 1066, min: 1000, max: 1150, tol: 3,
        e: "Le 14 octobre 1066, Guillaume, duc de Normandie, devient roi d'Angleterre. L'épisode est raconté dans la tapisserie de Bayeux." }
    ]
  },

  croisades: {
    lesson: [
      { d: "1095", t: "L'appel de Clermont",
        p: "L'empereur byzantin Alexis Ier demande de l'aide contre les Turcs seldjoukides. Au concile de Clermont, le pape Urbain II appelle les chevaliers d'Occident à secourir les chrétiens d'Orient et à délivrer Jérusalem. La foule s'enflamme, des milliers d'hommes cousent une croix sur leur vêtement : ce sont les croisés." },
      { d: "1096 – 1099", t: "La route de Jérusalem",
        p: "Une première vague populaire, menée par Pierre l'Ermite, est anéantie en Anatolie. Puis les armées des princes, avec Godefroy de Bouillon, Raymond de Saint-Gilles et Bohémond, traversent l'Orient, prennent Antioche, puis Jérusalem le 15 juillet 1099, au prix d'un massacre. Quatre États latins naissent : Jérusalem, Antioche, Édesse et Tripoli." },
      { d: "1187 – 1204", t: "Saladin, Richard et le détournement",
        p: "En 1187, Saladin écrase les croisés à Hattin et reprend Jérusalem. La troisième croisade réunit Philippe Auguste, Richard Cœur de Lion et Frédéric Barberousse, qui se noie en route. Richard prend Acre, mais ne reprend pas Jérusalem. En 1204, la quatrième croisade est détournée vers Constantinople, ville chrétienne, qu'elle pille." },
      { d: "1248 – 1291", t: "Saint Louis et la fin",
        p: "Louis IX conduit la septième croisade en Égypte : vaincu à Mansourah, il est capturé en 1250 et libéré contre rançon. En 1270, la huitième croisade s'arrête à Tunis, où il meurt. En 1291, Saint-Jean-d'Acre tombe : c'est la fin des États latins. Les Templiers, Hospitaliers et chevaliers Teutoniques, ordres de moines-soldats, ont marqué l'époque." }
    ],
    tf: [
      { q: "La première croisade a été conduite par les rois de France et d'Angleterre.", a: false,
        e: "Aucun roi ne part en 1096. L'expédition est menée par des princes et grands seigneurs : Godefroy de Bouillon, Raymond de Saint-Gilles, Bohémond de Tarente… Les rois n'iront qu'à partir de la deuxième croisade." },
      { q: "Saladin a repris Jérusalem aux croisés en 1187.", a: true,
        e: "Après sa victoire de Hattin en juillet 1187, Saladin reprend la ville en octobre. Elle restera, presque sans interruption, aux mains musulmanes jusqu'au XXe siècle." },
      { q: "La quatrième croisade s'est terminée par la prise de Constantinople, ville chrétienne.", a: true,
        e: "Endettés envers Venise, les croisés se laissent détourner. En 1204, ils pillent Constantinople. Cet épisode creuse durablement le fossé entre chrétiens d'Orient et d'Occident." }
    ],
    order: [
      { q: "Remets ces événements dans l'ordre chronologique.",
        items: [{ t: "Appel de Clermont", y: "1095" }, { t: "Prise de Jérusalem", y: "1099" }, { t: "Bataille de Hattin", y: "1187" }, { t: "Prise de Constantinople", y: "1204" }, { t: "Mort de Saint Louis à Tunis", y: "1270" }] }
    ],
    match: [
      { q: "Associe chaque personnage à son rôle.",
        pairs: [["Urbain II", "Lance l'appel de Clermont"], ["Saladin", "Vainqueur de Hattin"], ["Richard Cœur de Lion", "Roi d'Angleterre à la 3e croisade"], ["Saint Louis", "Meurt à Tunis en 1270"]] }
    ],
    year: [
      { q: "En quelle année les croisés prennent-ils Jérusalem ?", y: 1099, min: 1040, max: 1200, tol: 3,
        e: "Le 15 juillet 1099, après un siège de cinq semaines. La prise de la ville s'accompagne d'un massacre de la population." },
      { q: "En quelle année Saladin remporte-t-il la bataille de Hattin ?", y: 1187, min: 1100, max: 1250, tol: 3,
        e: "Le 4 juillet 1187, près du lac de Tibériade, l'armée du royaume de Jérusalem est presque anéantie." }
    ]
  },

  capetiens: {
    lesson: [
      { d: "987 – 1180", t: "Hugues Capet, un roi modeste",
        p: "En 987, les grands du royaume élisent Hugues Capet. Son domaine, autour de Paris et d'Orléans, est minuscule, et de puissants ducs et comtes l'entourent. Mais ses descendants gardent le trône pendant plus de trois siècles : ils font sacrer leur fils aîné de leur vivant, et la couronne devient héréditaire." },
      { d: "1180 – 1270", t: "Philippe Auguste et Saint Louis",
        p: "Philippe Auguste agrandit le domaine, fortifie Paris, bâtit le Louvre et gagne à Bouvines en 1214. Son petit-fils Louis IX rend la justice, fait cesser les guerres entre seigneurs et fait construire la Sainte-Chapelle pour la couronne d'épines. Il est canonisé en 1297." },
      { d: "XIIe – XIIIe siècle", t: "L'âge des cathédrales",
        p: "Vers 1140, à Saint-Denis, l'abbé Suger invente un style neuf : l'art gothique, avec arcs brisés, voûtes sur croisée d'ogives, arcs-boutants et immenses vitraux. Notre-Dame de Paris est commencée en 1163, Chartres, Reims et Amiens suivent. Notre-Dame, ravagée par l'incendie de 2019, a rouvert en décembre 2024." },
      { d: "1337 – 1453", t: "Cent ans de guerre",
        p: "Le roi d'Angleterre Édouard III réclame la couronne de France. Les Français sont battus à Crécy (1346) et à Poitiers (1356), où le roi Jean II est capturé. La peste noire frappe le pays. À Azincourt, en 1415, la chevalerie française est de nouveau écrasée. Mais sous Charles VII, la reconquête s'achève à Castillon, en 1453." },
      { d: "1429 – 1431", t: "Jeanne d'Arc",
        p: "Jeune paysanne de Domrémy, Jeanne affirme entendre des voix. Elle convainc Charles VII à Chinon, délivre Orléans le 8 mai 1429 et le conduit au sacre à Reims le 17 juillet. Capturée à Compiègne, livrée aux Anglais, elle est brûlée à Rouen le 30 mai 1431. Un procès la réhabilite en 1456 ; elle est canonisée en 1920." }
    ],
    tf: [
      { q: "Notre-Dame de Paris est une cathédrale de style roman.", a: false,
        e: "C'est l'un des chefs-d'œuvre de l'art gothique, avec ses arcs-boutants, sa voûte sur croisée d'ogives et ses grandes rosaces." },
      { q: "La guerre de Cent Ans a duré exactement cent ans.", a: false,
        e: "De 1337 à 1453, elle dure 116 ans, avec de longues périodes de trêve. Le nom lui a été donné bien plus tard, par les historiens." },
      { q: "Jeanne d'Arc a conduit Charles VII au sacre, à Reims.", a: true,
        e: "Le 17 juillet 1429, Charles VII est sacré à Reims, ville du baptême de Clovis. Ce sacre confirme sa légitimité face au roi anglais." }
    ],
    order: [
      { q: "Remets ces événements dans l'ordre chronologique.",
        items: [{ t: "Hugues Capet est élu roi", y: "987" }, { t: "Victoire de Bouvines", y: "1214" }, { t: "Défaite de Crécy", y: "1346" }, { t: "Jeanne d'Arc délivre Orléans", y: "1429" }, { t: "Bataille de Castillon", y: "1453" }] }
    ],
    match: [
      { q: "Associe chaque nom à son rôle.",
        pairs: [["Philippe Auguste", "Vainqueur de Bouvines"], ["Saint Louis", "Fait bâtir la Sainte-Chapelle"], ["Jean II le Bon", "Capturé à Poitiers en 1356"], ["Suger", "Abbé de Saint-Denis, père du gothique"]] }
    ],
    year: [
      { q: "En quelle année Jeanne d'Arc délivre-t-elle Orléans ?", y: 1429, min: 1350, max: 1500, tol: 3,
        e: "Le 8 mai 1429, après sept mois de siège. Cette victoire relance le camp français." },
      { q: "En quelle année a lieu la bataille d'Azincourt ?", y: 1415, min: 1350, max: 1500, tol: 3,
        e: "Le 25 octobre 1415, le roi anglais Henri V y écrase l'armée française, sur un terrain boueux, grâce à ses archers." },
      { q: "En quelle année Philippe Auguste remporte-t-il la bataille de Bouvines ?", y: 1214, min: 1150, max: 1300, tol: 3,
        e: "Le 27 juillet 1214, il bat une coalition menée par l'empereur Otton IV et le roi d'Angleterre Jean sans Terre." }
    ]
  }
};
