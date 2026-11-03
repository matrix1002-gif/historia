/* Historia — contenu des quiz.
   Pour ajouter une époque : copier un bloc de ERAS, changer l'id, puis ajouter 10 questions.
   Chaque question : q (énoncé), c (bonne réponse), w (3 mauvaises réponses), e (explication). */

const ERAS = [
  {
    id: "gaule",
    num: "I",
    title: "Gaulois & Romains",
    period: "Ier s. av. J.-C. – IVe s.",
    intro: "Avant la France, il y a la Gaule : cités celtes, légions romaines, aqueducs et premiers martyrs chrétiens.",
    accent: "#5fae86",
    icon: "helmet",
    questions: [
      {
        q: "Quel chef arverne dirige la grande révolte gauloise contre César en 52 av. J.-C. ?",
        c: "Vercingétorix",
        w: ["Brennus", "Ambiorix", "Divico"],
        e: "Vercingétorix fédère de nombreuses cités gauloises. Vaincu à Alésia, il se rend à César, reste captif plusieurs années, puis est exécuté à Rome après le triomphe de César."
      },
      {
        q: "Quelle bataille de 52 av. J.-C. met fin à la résistance gauloise organisée ?",
        c: "Alésia",
        w: ["Gergovie", "Bibracte", "Lutèce"],
        e: "César enferme Vercingétorix dans Alésia grâce à de gigantesques lignes de fortifications, puis repousse l'armée de secours gauloise."
      },
      {
        q: "Comment appelait-on les prêtres et savants de la société gauloise ?",
        c: "Les druides",
        w: ["Les bardes", "Les augures", "Les flamines"],
        e: "Les druides enseignaient, rendaient la justice et dirigeaient les cérémonies religieuses. Les bardes, eux, étaient des poètes."
      },
      {
        q: "Quelle ville, aujourd'hui française, était la capitale des Trois Gaules sous l'Empire romain ?",
        c: "Lugdunum (Lyon)",
        w: ["Lutèce (Paris)", "Burdigala (Bordeaux)", "Massalia (Marseille)"],
        e: "Fondée en 43 av. J.-C., Lugdunum devient le centre politique et religieux des provinces gauloises."
      },
      {
        q: "Quelle ville, fondée vers 600 av. J.-C. par des Grecs venus de Phocée, est la plus ancienne de France ?",
        c: "Marseille",
        w: ["Nice", "Narbonne", "Arles"],
        e: "Les Phocéens fondent Massalia, un comptoir commercial qui deviendra Marseille."
      },
      {
        q: "Quel texte, écrit par un général romain, raconte la conquête de la Gaule ?",
        c: "La Guerre des Gaules",
        w: ["L'Énéide", "Les Histoires d'Hérodote", "La Germanie"],
        e: "César rédige lui-même ses Commentaires sur la guerre des Gaules, à la fois récit militaire et outil de propagande politique."
      },
      {
        q: "À quoi servait le pont du Gard, construit par les Romains ?",
        c: "À transporter l'eau jusqu'à Nîmes",
        w: ["À relier deux voies romaines pour les chars", "À défendre la frontière contre les Germains", "À servir de marché couvert"],
        e: "C'est un pont-aqueduc d'environ 50 mètres de haut : il faisait passer l'eau au-dessus du Gardon pour alimenter la ville de Nemausus (Nîmes)."
      },
      {
        q: "Quelle jeune esclave chrétienne est martyrisée à Lyon en 177 ?",
        c: "Blandine",
        w: ["Geneviève", "Radegonde", "Clotilde"],
        e: "Blandine meurt dans l'amphithéâtre des Trois Gaules avec d'autres chrétiens de Lyon. Elle est l'une des plus célèbres martyres de la Gaule."
      },
      {
        q: "De quel peuple gaulois la ville de Paris tire-t-elle son nom ?",
        c: "Les Parisii",
        w: ["Les Éduens", "Les Arvernes", "Les Helvètes"],
        e: "Les Parisii vivaient autour de l'île de la Cité. Leur ville, Lutetia, deviendra Paris."
      },
      {
        q: "Quel empereur romain accorde la liberté de culte aux chrétiens par l'édit de Milan, en 313 ?",
        c: "Constantin",
        w: ["Néron", "Dioclétien", "Théodose"],
        e: "Constantin, avec Licinius, met fin aux persécutions. En 380, Théodose fera du christianisme la religion officielle de l'Empire."
      }
    ]
  },

  {
    id: "evangelisation",
    num: "II",
    title: "L'Europe se convertit",
    period: "IVe – XIe siècle",
    intro: "Des missionnaires parcourent routes et mers pour porter l'Évangile, de l'Irlande à Kiev.",
    accent: "#a98ad6",
    icon: "celtic",
    questions: [
      {
        q: "Quel soldat romain devenu évêque de Tours partage son manteau avec un pauvre à Amiens ?",
        c: "Martin",
        w: ["Hilaire", "Ambroise", "Germain"],
        e: "Selon la tradition, Martin coupe son manteau en deux pour couvrir un mendiant grelottant. Il devient évêque de Tours vers 371 et fonde le monastère de Ligugé."
      },
      {
        q: "Dans quelle ville Clovis est-il baptisé par l'évêque Remi ?",
        c: "Reims",
        w: ["Soissons", "Tours", "Paris"],
        e: "La tradition place le baptême à Noël 496, mais les historiens débattent de la date (entre 496 et 508). Contrairement à la plupart des rois barbares, qui étaient ariens, Clovis choisit le catholicisme."
      },
      {
        q: "Quel missionnaire du Ve siècle est considéré comme l'apôtre de l'Irlande ?",
        c: "Patrick",
        w: ["Colomban", "Brendan", "Augustin"],
        e: "Patrick, venu de Bretagne insulaire, aurait été capturé et réduit en esclavage en Irlande avant d'y revenir comme évêque missionnaire. Il est fêté le 17 mars."
      },
      {
        q: "Quel moine irlandais fonde les monastères de Luxeuil, en Gaule, puis de Bobbio, en Italie ?",
        c: "Colomban",
        w: ["Patrick", "Benoît", "Willibrord"],
        e: "Colomban quitte l'Irlande vers 590 avec quelques compagnons. Ses monastères, très rigoureux, deviennent des foyers de culture et de foi à travers l'Europe."
      },
      {
        q: "En 597, quel moine envoyé par le pape Grégoire le Grand débarque dans le royaume de Kent pour évangéliser les Anglo-Saxons ?",
        c: "Augustin",
        w: ["Boniface", "Colomban", "Wilfrid"],
        e: "Le roi Æthelberht de Kent, dont l'épouse Berthe était franque et chrétienne, accueille la mission. Augustin devient le premier archevêque de Canterbury."
      },
      {
        q: "Quel missionnaire anglo-saxon, surnommé « apôtre de la Germanie », abat le chêne sacré de Geismar vers 723 ?",
        c: "Boniface",
        w: ["Willibrord", "Alcuin", "Bède"],
        e: "Boniface détruit le chêne consacré au dieu Donar (Thor). Voyant que rien ne se passe, beaucoup de Germains se convertissent, selon ses biographes. Il est martyrisé en Frise en 754."
      },
      {
        q: "Quels frères, originaires de Thessalonique, évangélisent les Slaves au IXe siècle et leur donnent une écriture ?",
        c: "Cyrille et Méthode",
        w: ["Basile et Grégoire", "Benoît et Scholastique", "Cosme et Damien"],
        e: "Ils traduisent les textes sacrés en langue slave. Cyrille met au point l'alphabet glagolitique, dont découlera plus tard l'alphabet cyrillique."
      },
      {
        q: "En 988, quel prince de Kiev se fait baptiser et christianise la Rus' ?",
        c: "Vladimir",
        w: ["Iaroslav", "Rurik", "Oleg"],
        e: "Vladimir choisit le christianisme byzantin et épouse Anne, sœur de l'empereur Basile II. Son baptême marque un tournant pour le monde slave orthodoxe."
      },
      {
        q: "Quel moine du IXe siècle, surnommé « apôtre du Nord », prêche au Danemark et en Suède ?",
        c: "Anschaire",
        w: ["Willibrord", "Wulfila", "Gall"],
        e: "Anschaire (ou Ansgar), archevêque de Hambourg-Brême, fonde les premières églises scandinaves. La conversion durable du Nord n'aura lieu que plus tard, aux Xe et XIe siècles."
      },
      {
        q: "Quel roi, couronné en l'an 1000 ou 1001, fait de la Hongrie un royaume chrétien ?",
        c: "Étienne Ier",
        w: ["Árpád", "Mieszko Ier", "Boleslas Chrobry"],
        e: "Étienne reçoit sa couronne avec l'accord du pape. Canonisé en 1083, saint Étienne est devenu le patron de la Hongrie."
      }
    ]
  },

  {
    id: "carolingiens",
    num: "III",
    title: "Francs & Carolingiens",
    period: "Ve – Xe siècle",
    intro: "Du baptême de Clovis à l'empire de Charlemagne, les Francs bâtissent un royaume qui façonne l'Occident.",
    accent: "#e0b24f",
    icon: "crown",
    questions: [
      {
        q: "Quel roi franc, mort en 511, a réuni presque toute la Gaule sous son autorité ?",
        c: "Clovis",
        w: ["Childéric Ier", "Dagobert Ier", "Pépin le Bref"],
        e: "Clovis bat le Romain Syagrius, les Alamans, puis les Wisigoths à Vouillé en 507. À sa mort, son royaume est partagé entre ses quatre fils selon la coutume franque."
      },
      {
        q: "Dans quelle ville se déroule, vers 486, l'épisode du célèbre « vase » ?",
        c: "Soissons",
        w: ["Reims", "Tours", "Orléans"],
        e: "Selon Grégoire de Tours, un soldat brise d'un coup de hache un vase précieux que Clovis voulait rendre à l'Église. Un an plus tard, le roi se venge en lui rappelant l'épisode. Le récit a sans doute été embelli."
      },
      {
        q: "Qui remporte la bataille de Poitiers en 732 contre une armée venue d'Espagne musulmane ?",
        c: "Charles Martel",
        w: ["Pépin le Bref", "Clovis", "Eudes d'Aquitaine"],
        e: "Charles Martel, maire du palais, arrête un corps expéditionnaire venu d'al-Andalus. Les historiens relativisent aujourd'hui l'ampleur de la bataille, mais elle renforce le prestige de sa famille."
      },
      {
        q: "En 751, qui devient roi des Francs avec l'appui du pape et fonde la dynastie carolingienne ?",
        c: "Pépin le Bref",
        w: ["Charles Martel", "Carloman", "Louis le Pieux"],
        e: "Pépin le Bref, fils de Charles Martel, met fin au règne du dernier roi mérovingien, Childéric III. Le pape Étienne II renouvelle son sacre en 754."
      },
      {
        q: "Qui couronne Charlemagne empereur à Rome, la nuit de Noël de l'an 800 ?",
        c: "Le pape Léon III",
        w: ["Le pape Grégoire le Grand", "Le pape Urbain II", "L'évêque Remi"],
        e: "Charlemagne, déjà roi des Francs et des Lombards, est proclamé empereur. Le geste rapproche la papauté des Francs et irrite Byzance."
      },
      {
        q: "Quelle ville est la capitale favorite de Charlemagne, où il est enterré ?",
        c: "Aix-la-Chapelle",
        w: ["Paris", "Rome", "Reims"],
        e: "Il y fait bâtir sa chapelle palatine, dont l'octogone existe encore. Charlemagne meurt à Aix en 814."
      },
      {
        q: "Comment appelle-t-on les envoyés de Charlemagne chargés de contrôler comtes et évêques dans l'empire ?",
        c: "Les missi dominici",
        w: ["Les sénéchaux", "Les prévôts", "Les connétables"],
        e: "Ils voyagent par deux, un laïc et un ecclésiastique, pour faire respecter les capitulaires, c'est-à-dire les lois de l'empereur."
      },
      {
        q: "Quelle écriture claire, diffusée à l'époque carolingienne, est l'ancêtre de nos lettres minuscules ?",
        c: "La minuscule caroline",
        w: ["L'écriture gothique", "La capitale romaine", "L'onciale"],
        e: "Elle se répand grâce aux scriptoria, comme celui de Tours, sous l'impulsion d'Alcuin. Les humanistes de la Renaissance s'en inspireront."
      },
      {
        q: "Quel traité de 843 partage l'empire entre les trois petits-fils de Charlemagne ?",
        c: "Le traité de Verdun",
        w: ["Le traité de Meerssen", "Le serment de Strasbourg", "Le traité de Paris"],
        e: "Charles le Chauve reçoit l'ouest (la future France), Louis le Germanique l'est (la future Allemagne), et Lothaire la bande centrale avec le titre d'empereur."
      },
      {
        q: "Selon la Chanson de Roland, quel neveu de Charlemagne meurt à Roncevaux en 778 ?",
        c: "Roland",
        w: ["Olivier", "Ganelon", "Turpin"],
        e: "L'arrière-garde de Charlemagne est attaquée dans les Pyrénées. Dans l'histoire réelle, ce sont des Basques et non des Sarrasins qui l'écrasent ; le poème, rédigé vers 1100, en fait une épopée de croisade."
      }
    ]
  },

  {
    id: "moines",
    num: "IV",
    title: "Moines & monastères",
    period: "VIe – XIIe siècle",
    intro: "Prière, travail, copie des manuscrits : derrière les murs des abbayes, les moines gardent vivants la foi et le savoir.",
    accent: "#d9825f",
    icon: "book",
    questions: [
      {
        q: "Quel moine italien rédige au VIe siècle la règle qui régira la plupart des monastères d'Occident ?",
        c: "Benoît de Nursie",
        w: ["Colomban", "Bernard de Clairvaux", "Bruno"],
        e: "Fondateur du Mont-Cassin vers 529, Benoît organise la vie des moines autour de la prière, du travail et de l'obéissance."
      },
      {
        q: "Que signifie la devise bénédictine « Ora et labora » ?",
        c: "Prie et travaille",
        w: ["Écoute et obéis", "Lis et écris", "Veille et combats"],
        e: "La vie bénédictine alterne prière, travail manuel et lecture. Les monastères deviennent de grandes exploitations agricoles et des centres de culture."
      },
      {
        q: "Dans quelle région est fondée en 910 l'abbaye de Cluny, future tête d'un immense réseau de monastères ?",
        c: "La Bourgogne",
        w: ["La Normandie", "L'Alsace", "La Provence"],
        e: "Fondée par le duc Guillaume Ier d'Aquitaine, Cluny est placée directement sous l'autorité du pape. Au XIIe siècle, des centaines de maisons dépendent d'elle."
      },
      {
        q: "Quel ordre naît à Cîteaux en 1098 pour revenir à une vie plus sobre et plus austère ?",
        c: "Les cisterciens",
        w: ["Les dominicains", "Les franciscains", "Les hospitaliers"],
        e: "Robert de Molesme veut revenir à la règle de saint Benoît à la lettre. Les cisterciens bâtissent des abbayes dépouillées, comme Fontenay ou Sénanque."
      },
      {
        q: "Quel abbé de Clairvaux prêche la deuxième croisade à Vézelay en 1146 devant le roi Louis VII ?",
        c: "Bernard de Clairvaux",
        w: ["Pierre le Vénérable", "Suger", "Abélard"],
        e: "Bernard, l'un des hommes les plus influents de son temps, soutient aussi l'ordre du Temple. Il est canonisé en 1174."
      },
      {
        q: "Comment appelle-t-on l'atelier d'un monastère où les moines copient et enluminent les manuscrits ?",
        c: "Le scriptorium",
        w: ["Le réfectoire", "Le chapitre", "Le cloître"],
        e: "Les moines y copient à la main bibles, textes antiques et vies de saints, avec des enluminures parfois rehaussées d'or. Sans eux, de nombreux textes de l'Antiquité ne nous seraient pas parvenus."
      },
      {
        q: "En 793, quel monastère anglais est pillé par les Vikings, marquant le début de leurs grands raids ?",
        c: "Lindisfarne",
        w: ["Iona", "Jarrow", "Cluny"],
        e: "Le 8 juin 793, des Vikings pillent ce monastère de Northumbrie. L'événement marque traditionnellement le début de l'âge des Vikings."
      },
      {
        q: "Quelle abbesse allemande du XIIe siècle est aussi compositrice, naturaliste et visionnaire ?",
        c: "Hildegarde de Bingen",
        w: ["Héloïse", "Catherine de Sienne", "Radegonde"],
        e: "Auteure de traités de médecine et de botanique, de chants et de visions, elle conseille papes et empereurs. Elle est proclamée docteur de l'Église en 2012."
      },
      {
        q: "Quel moine fonde en 1084 la Grande Chartreuse, dans le massif alpin ?",
        c: "Bruno",
        w: ["Norbert", "Robert de Molesme", "Benoît d'Aniane"],
        e: "Bruno de Cologne et quelques compagnons s'installent dans un désert montagneux près de Grenoble. Les chartreux vivent dans le silence et la solitude."
      },
      {
        q: "Selon la tradition, quel archange apparaît à l'évêque Aubert d'Avranches en 708, à l'origine du Mont-Saint-Michel ?",
        c: "Michel",
        w: ["Gabriel", "Raphaël", "Uriel"],
        e: "Un sanctuaire est d'abord bâti sur le rocher ; des bénédictins s'y installent en 966. Le Mont devient l'un des grands lieux de pèlerinage d'Europe."
      }
    ]
  },

  {
    id: "chevaliers",
    num: "V",
    title: "Chevaliers & féodalité",
    period: "Xe – XIVe siècle",
    intro: "Seigneurs, vassaux, châteaux forts et tournois : bienvenue dans le monde de ceux qui combattent.",
    accent: "#8fa7d9",
    icon: "sword",
    questions: [
      {
        q: "Comment s'appelle la cérémonie où un jeune guerrier est fait chevalier ?",
        c: "L'adoubement",
        w: ["L'investiture", "L'hommage", "Le sacre"],
        e: "Le jeune écuyer reçoit ses armes et, souvent, un coup de plat d'épée. Il promet de défendre l'Église, les faibles et son seigneur."
      },
      {
        q: "Comment nomme-t-on la tour principale d'un château fort, dernier refuge en cas d'attaque ?",
        c: "Le donjon",
        w: ["La poterne", "Le créneau", "La herse"],
        e: "À l'origine, le donjon est souvent la résidence du seigneur. Aux XIIe et XIIIe siècles, les châteaux se dotent aussi d'enceintes, de tours et de douves."
      },
      {
        q: "Que reçoit un vassal de son seigneur en échange de son hommage et de sa fidélité ?",
        c: "Un fief",
        w: ["Une rançon", "Un blason", "Une dîme"],
        e: "Le fief est une terre ou un revenu confié au vassal. En retour, celui-ci doit à son seigneur une aide militaire et des conseils."
      },
      {
        q: "Quel mouvement soutenu par l'Église cherche, dès la fin du Xe siècle, à protéger les faibles et à limiter les guerres privées ?",
        c: "La paix et la trêve de Dieu",
        w: ["La querelle des Investitures", "Le serment de Strasbourg", "L'édit de Nantes"],
        e: "L'Église protège clercs, paysans et pauvres, et interdit les combats à certaines périodes (dimanche, grandes fêtes, carême)."
      },
      {
        q: "Quel affrontement entre chevaliers, à la fois entraînement et spectacle, est très populaire aux XIIe et XIIIe siècles ?",
        c: "Le tournoi",
        w: ["Le siège", "L'ost", "La chevauchée"],
        e: "D'abord de grandes mêlées très violentes, les tournois deviennent peu à peu plus codifiés, avec la joute : un duel à cheval, à la lance."
      },
      {
        q: "Quelle bataille de 1066 voit Guillaume de Normandie vaincre le roi anglo-saxon Harold ?",
        c: "Hastings",
        w: ["Bouvines", "Crécy", "Azincourt"],
        e: "Le 14 octobre 1066, Guillaume bat Harold, qui meurt pendant la bataille. Il est couronné roi d'Angleterre à Noël."
      },
      {
        q: "Quelle célèbre broderie de près de 70 mètres raconte la conquête de l'Angleterre en 1066 ?",
        c: "La tapisserie de Bayeux",
        w: ["La Dame à la licorne", "L'Apocalypse d'Angers", "Les Très Riches Heures"],
        e: "Elle se lit comme une immense bande dessinée de fil brodé. Elle est conservée à Bayeux, en Normandie."
      },
      {
        q: "Comment appelle-t-on les longs poèmes épiques, comme la Chanson de Roland, qui célèbrent les exploits des héros ?",
        c: "Les chansons de geste",
        w: ["Les fabliaux", "Les mystères", "Les lais"],
        e: "Chantées ou récitées devant un public, elles célèbrent des héros comme Roland ou Guillaume d'Orange. Les fabliaux, eux, sont de courts récits comiques."
      },
      {
        q: "Quel roi de France fait arrêter tous les Templiers du royaume le 13 octobre 1307 ?",
        c: "Philippe IV le Bel",
        w: ["Louis IX", "Philippe Auguste", "Charles V"],
        e: "Criblé de dettes, notamment envers l'ordre, Philippe le Bel accuse les Templiers d'hérésie. L'ordre est dissous en 1312 ; son grand maître, Jacques de Molay, est brûlé à Paris en 1314."
      },
      {
        q: "Quelle image de la société, popularisée au début du XIe siècle, distingue ceux qui prient, ceux qui combattent et ceux qui travaillent ?",
        c: "Les trois ordres",
        w: ["Les trois fiefs", "Les trois royaumes", "Les trois vœux"],
        e: "L'évêque Adalbéron de Laon la met en forme dans un poème : le clergé prie, la noblesse combat, les paysans travaillent. C'est une société idéale, plus qu'un reflet exact de la réalité."
      }
    ]
  },

  {
    id: "croisades",
    num: "VI",
    title: "Les Croisades",
    period: "1095 – 1291",
    intro: "De Clermont à Saint-Jean-d'Acre, deux siècles d'expéditions vers Jérusalem et la Terre sainte.",
    accent: "#e06a6a",
    icon: "jerusalem",
    questions: [
      {
        q: "En 1095, quel pape lance l'appel à la première croisade au concile de Clermont ?",
        c: "Urbain II",
        w: ["Grégoire VII", "Léon III", "Innocent III"],
        e: "Le 27 novembre 1095, devant une foule immense, Urbain II appelle à secourir les chrétiens d'Orient et à délivrer Jérusalem. Il promet aux participants une indulgence."
      },
      {
        q: "Quel cri les foules auraient-elles poussé en réponse à l'appel d'Urbain II ?",
        c: "« Dieu le veut ! »",
        w: ["« Montjoie Saint-Denis ! »", "« Vive le roi ! »", "« Aux armes, citoyens ! »"],
        e: "Selon plusieurs chroniqueurs, la foule répond « Deus vult ». Les participants cousent une croix sur leurs vêtements, d'où le nom de « croisés »."
      },
      {
        q: "En quelle année les croisés prennent-ils Jérusalem à l'issue de la première croisade ?",
        c: "1099",
        w: ["1066", "1187", "1204"],
        e: "La ville est prise le 15 juillet 1099 après plusieurs semaines de siège, et une grande partie de sa population est massacrée. Plusieurs États latins sont fondés en Orient."
      },
      {
        q: "Quel chef refuse le titre de roi et devient le premier dirigeant de Jérusalem après sa prise ?",
        c: "Godefroy de Bouillon",
        w: ["Raymond de Saint-Gilles", "Bohémond de Tarente", "Hugues de Vermandois"],
        e: "Godefroy prend le titre d'« avoué du Saint-Sépulcre ». À sa mort en 1100, son frère Baudouin devient le premier roi de Jérusalem."
      },
      {
        q: "Quel sultan reprend Jérusalem aux croisés en 1187, après la victoire de Hattin ?",
        c: "Saladin",
        w: ["Baybars", "Zengi", "Tamerlan"],
        e: "Saladin écrase l'armée des croisés à Hattin en juillet 1187, puis reprend Jérusalem en octobre. L'événement provoque la troisième croisade."
      },
      {
        q: "Quels trois souverains lancent la troisième croisade (1189-1192) ?",
        c: "Philippe Auguste, Richard Cœur de Lion et Frédéric Barberousse",
        w: ["Louis VII, Conrad III et Baudouin IV", "Louis IX, Henri III et Frédéric II", "Philippe IV, Édouard Ier et Rodolphe de Habsbourg"],
        e: "Barberousse se noie en 1190 en Asie Mineure, Philippe Auguste rentre en France dès 1191, et Richard Cœur de Lion négocie une trêve avec Saladin en 1192."
      },
      {
        q: "Quelle grande ville chrétienne est prise et pillée par les croisés en 1204 ?",
        c: "Constantinople",
        w: ["Antioche", "Alexandrie", "Rome"],
        e: "La quatrième croisade, détournée par des dettes envers Venise et des intrigues byzantines, s'empare de la capitale de l'Empire byzantin. L'épisode creuse le fossé entre chrétiens d'Occident et d'Orient."
      },
      {
        q: "Dans quelle ville meurt Louis IX (Saint Louis), en 1270, lors de la huitième croisade ?",
        c: "Tunis",
        w: ["Damiette", "Jérusalem", "Saint-Jean-d'Acre"],
        e: "Louis IX était déjà parti en 1248 pour la septième croisade, qui l'avait mené prisonnier en Égypte. Il meurt de maladie devant Tunis le 25 août 1270 et sera canonisé en 1297."
      },
      {
        q: "Quel ordre, fondé vers 1119 à Jérusalem, a pour première mission de protéger les pèlerins ?",
        c: "L'ordre du Temple",
        w: ["Les chevaliers teutoniques", "Les dominicains", "Les cisterciens"],
        e: "Hugues de Payns et quelques chevaliers s'installent près de l'ancien Temple de Salomon, d'où leur nom. Bernard de Clairvaux contribue à leur règle."
      },
      {
        q: "Quelle forteresse de Syrie, tenue par les Hospitaliers, est l'un des plus célèbres châteaux croisés ?",
        c: "Le Krak des Chevaliers",
        w: ["Château-Gaillard", "Carcassonne", "Montségur"],
        e: "Cette forteresse tombe en 1271 face aux Mamelouks du sultan Baybars. Elle est aujourd'hui classée au patrimoine mondial de l'UNESCO."
      }
    ]
  },

  {
    id: "capetiens",
    num: "VII",
    title: "Capétiens & Guerre de Cent Ans",
    period: "987 – 1453",
    intro: "Un royaume qui s'affirme, des rois bâtisseurs, une guerre interminable et une jeune bergère qui entre dans la légende.",
    accent: "#6fb3d9",
    icon: "lis",
    questions: [
      {
        q: "Quel seigneur est élu roi en 987, début de la dynastie capétienne ?",
        c: "Hugues Capet",
        w: ["Eudes", "Robert le Fort", "Philippe Ier"],
        e: "Duc des Francs, Hugues est élu par les grands du royaume à la place du dernier Carolingien. Sa dynastie régnera de père en fils pendant plus de trois siècles."
      },
      {
        q: "Quelle victoire de Philippe Auguste, en 1214, consolide le pouvoir du roi de France ?",
        c: "Bouvines",
        w: ["Crécy", "Hastings", "Poitiers"],
        e: "À Bouvines, le roi bat une coalition menée par l'empereur Otton IV et soutenue par Jean sans Terre, roi d'Angleterre. La victoire est célébrée dans tout le royaume."
      },
      {
        q: "Quelle chapelle parisienne Louis IX fait-il bâtir pour abriter la couronne d'épines ?",
        c: "La Sainte-Chapelle",
        w: ["Notre-Dame", "Saint-Denis", "Saint-Germain-des-Prés"],
        e: "Louis IX achète la couronne d'épines à l'empereur latin de Constantinople et fait construire ce bijou de l'art gothique, consacré en 1248."
      },
      {
        q: "Quel roi réunit en 1302 les premiers États généraux ?",
        c: "Philippe le Bel",
        w: ["Louis X", "Philippe VI", "Charles V"],
        e: "En conflit avec le pape Boniface VIII, il cherche l'appui de son royaume. Clergé, noblesse et bourgeois sont convoqués à Notre-Dame de Paris."
      },
      {
        q: "En quelle année commence la guerre de Cent Ans, selon la date traditionnelle ?",
        c: "1337",
        w: ["1250", "1415", "1429"],
        e: "En 1337, Philippe VI saisit la Guyenne ; le roi d'Angleterre Édouard III, petit-fils de Philippe le Bel par sa mère, revendique la couronne de France. La guerre durera, par épisodes, jusqu'en 1453."
      },
      {
        q: "Quelle bataille de 1346 voit les archers anglais décimer la chevalerie française ?",
        c: "Crécy",
        w: ["Bouvines", "Hastings", "Azincourt"],
        e: "Le 26 août 1346, les archers armés du long arc brisent les charges de la cavalerie de Philippe VI. La bataille montre que la chevalerie n'est plus invincible."
      },
      {
        q: "Quelle épidémie, arrivée en 1347 par les ports de la Méditerranée, emporte une grande partie de la population européenne ?",
        c: "La peste noire",
        w: ["La lèpre", "Le choléra", "La grippe espagnole"],
        e: "En quelques années, environ un tiers des Européens meurt, d'après les estimations. L'épidémie bouleverse l'économie, la société et les mentalités."
      },
      {
        q: "Quelle ville Jeanne d'Arc délivre-t-elle en mai 1429 ?",
        c: "Orléans",
        w: ["Reims", "Rouen", "Compiègne"],
        e: "Le 8 mai 1429, les Anglais lèvent le siège d'Orléans. Deux mois plus tard, Jeanne conduit Charles VII au sacre, à Reims."
      },
      {
        q: "Dans quelle ville Jeanne d'Arc est-elle brûlée vive le 30 mai 1431 ?",
        c: "Rouen",
        w: ["Reims", "Orléans", "Paris"],
        e: "Condamnée par un tribunal d'Église favorable aux Anglais, elle est exécutée sur la place du Vieux-Marché. Son procès sera annulé en 1456 et elle sera canonisée en 1920."
      },
      {
        q: "Quelle bataille de 1453, où l'artillerie française joue un rôle décisif, met fin à la guerre de Cent Ans ?",
        c: "Castillon",
        w: ["Formigny", "Patay", "Azincourt"],
        e: "Le 17 juillet 1453, l'armée anglaise de Talbot est battue par l'artillerie des frères Bureau. Bordeaux se rend en octobre ; les Anglais ne gardent que Calais."
      }
    ]
  }
];

/* Rangs : seuil d'XP et titre. */
const RANKS = [
  { xp: 0,    name: "Page" },
  { xp: 100,  name: "Écuyer" },
  { xp: 250,  name: "Chevalier" },
  { xp: 450,  name: "Banneret" },
  { xp: 700,  name: "Comte" },
  { xp: 1000, name: "Duc" },
  { xp: 1400, name: "Connétable" }
];
