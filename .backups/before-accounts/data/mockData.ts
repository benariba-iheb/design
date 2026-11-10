export interface Reaction {
  id: string;
  labelFr: string;
  labelAr: string;
  iconName: string;
  isSpecial?: boolean; // e.g. rani_jay
  descriptionFr: string;
}

export const GASRA_REACTIONS: Reaction[] = [
  {
    id: "ya3tik_saha",
    labelFr: "Ya3tik saha",
    labelAr: "يعطيك الصحة",
    iconName: "heart-hand",
    descriptionFr: "Main sur le cœur — réaction par défaut de gratitude et bienveillance",
  },
  {
    id: "hbel",
    labelFr: "Hbel",
    labelAr: "هبل",
    iconName: "flame",
    descriptionFr: "Exceptionnel, génial, incroyable",
  },
  {
    id: "hhhh",
    labelFr: "Hhhh",
    labelAr: "هههه",
    iconName: "smile",
    descriptionFr: "Rire et humour algérien",
  },
  {
    id: "ya_hasra",
    labelFr: "Ya hasra",
    labelAr: "يا حسرة",
    iconName: "history",
    descriptionFr: "Nostalgie, souvenirs du bon vieux temps",
  },
  {
    id: "wach_hada",
    labelFr: "Wach hada",
    labelAr: "واش هذا",
    iconName: "help-circle",
    descriptionFr: "Étonnement, incompréhension, questionnement",
  },
  {
    id: "nervi",
    labelFr: "Nervi",
    labelAr: "نرفي",
    iconName: "frown",
    descriptionFr: "Langue mordue entre les dents, agacement face aux abus",
  },
  {
    id: "m3ak",
    labelFr: "M3ak",
    labelAr: "معاك",
    iconName: "users",
    descriptionFr: "Solidaire, à fond avec toi",
  },
  {
    id: "rani_jay",
    labelFr: "Rani jay",
    labelAr: "راني جاي",
    iconName: "navigation",
    isSpecial: true,
    descriptionFr: "J'arrive ! Signal d'intention concrète de visite pour le commerçant",
  },
];

export interface ContributorLevel {
  levelNumber: number;
  titleFrM: string;
  titleFrF: string;
  titleArM: string;
  titleArF: string;
  subtitleFr: string;
  minPoints: number;
  multiplier: string;
  badgeColor: string;
}

export const CONTRIBUTOR_LEVELS: ContributorLevel[] = [
  {
    levelNumber: 1,
    titleFrM: "Jar",
    titleFrF: "Jara",
    titleArM: "جار",
    titleArF: "جارة",
    subtitleFr: "Le Voisin — Débutant dans son quartier",
    minPoints: 0,
    multiplier: "1.0x",
    badgeColor: "#859CA4",
  },
  {
    levelNumber: 2,
    titleFrM: "Weld el Houma",
    titleFrF: "Bent el Houma",
    titleArM: "ولد الحومة",
    titleArF: "بنت الحومة",
    subtitleFr: "L'Enfant du Quartier — Actif et reconnu",
    minPoints: 250,
    multiplier: "1.25x",
    badgeColor: "#3D5AFE",
  },
  {
    levelNumber: 3,
    titleFrM: "Sahb el Kelma",
    titleFrF: "Sahbat el Kelma",
    titleArM: "صاحب الكلمة",
    titleArF: "صاحبة الكلمة",
    subtitleFr: "Celui dont la parole compte — Avis certifié et influent",
    minPoints: 800,
    multiplier: "1.6x",
    badgeColor: "#0B1E26",
  },
  {
    levelNumber: 4,
    titleFrM: "Dalil",
    titleFrF: "Dalila",
    titleArM: "دليل",
    titleArF: "دليلة",
    subtitleFr: "Le Guide — Référent de la commune",
    minPoints: 2000,
    multiplier: "2.0x",
    badgeColor: "#E0503A",
  },
  {
    levelNumber: 5,
    titleFrM: "L'Ancien",
    titleFrF: "L'Ancienne",
    titleArM: "كبير الحومة",
    titleArF: "كبيرة الحومة",
    subtitleFr: "Kbir el Houma — Super contributeur respecté de la wilaya",
    minPoints: 4500,
    multiplier: "2.5x",
    badgeColor: "#E4FF3C",
  },
];

export interface Persona {
  id: string;
  name: string;
  age: number;
  location: string;
  role: string;
  bioFr: string;
  avatarInitials: string;
  stats: string;
  painPointFr: string;
  gasraSolutionFr: string;
  cardType: string;
  levelNumber: number;
}

export const PERSONAS: Persona[] = [
  {
    id: "user-amine",
    name: "Amine Rezgui",
    age: 24,
    location: "Bab Ezzouar (Alger)",
    role: "Créateur local / Voisin actif",
    bioFr: "Diplômé sans emploi fixe, passe son temps libre dans les cafés de la cité Ismail Yefsah. Possède une carte Edahabia et BaridiMob.",
    avatarInitials: "AR",
    stats: "Niveau 2 : Weld el Houma · 580 pts",
    painPointFr: "Fait des vidéos TikTok et des stories sans jamais toucher un centime car il n'a pas 100k abonnés.",
    gasraSolutionFr: "Fait 1 vidéo de 20s sur la sandwicherie du coin. 15 voisins scannent le bon : 1 800 DA crédités direct sur sa carte Edahabia.",
    cardType: "Edahabia",
    levelNumber: 2,
  },
  {
    id: "user-samia",
    name: "Samia Mansouri",
    age: 31,
    location: "Akid Lotfi (Oran)",
    role: "Commerçante Pro / Gérante de salon",
    bioFr: "Gérante du salon d'esthétique « El Bahia ». Budget mensuel de 5 000 à 10 000 DA pour attirer de nouvelles clientes locales.",
    avatarInitials: "SM",
    stats: "Vitrine Pro · 4.9/5 étoiles",
    painPointFr: "Impossible de payer les pubs Facebook/Instagram sans carte internationale ou devises au marché noir.",
    gasraSolutionFr: "Crée un Bon « -25% Soin Visage » en DA via CIB/flexy. Ne paie la commission aux créateurs que quand la cliente vient au salon !",
    cardType: "CIB / Flexy",
    levelNumber: 1,
  },
  {
    id: "user-karim",
    name: "Karim Benchikh",
    age: 45,
    location: "Sétif Centre (Sétif)",
    role: "Contributeur discret & Citoyen",
    bioFr: "Cadre moyen, père de famille. Veut suivre la vie de sa ville, les ouvertures, les alertes travaux et vendre sa vieille moto sans arnaque.",
    avatarInitials: "KB",
    stats: "Niveau 3 : Sahb el Kelma · 1 200 pts",
    painPointFr: "Perdu au milieu des groupes Facebook chaotiques remplis de spams, d'arnaques et d'annonces de gens hors wilaya.",
    gasraSolutionFr: "Lit « Le Pouls du quartier » le matin en 2 min. Signale une pharmacie de garde. Sa moto se vend via le séquestre sécurisé Gasra.",
    cardType: "Séquestre",
    levelNumber: 3,
  },
];

export interface Deal {
  id: string;
  businessName: string;
  businessId: string;
  titleFr: string;
  titleAr: string;
  discount: string;
  originalPrice: number;
  dealPrice: number;
  creatorCommissionDA: number;
  claimedCount: number;
  maxCount: number;
  wilaya: string;
  quartier: string;
  category: string;
  expiryDate: string;
}

export const MOCK_DEALS: Deal[] = [
  {
    id: "deal-1",
    businessName: "Sandwicherie El Forno",
    businessId: "biz-1",
    titleFr: "Menu Chawarma XL + Boisson Hamoud",
    titleAr: "قائمة شاورما إكس إل + مشروب حمود",
    discount: "-30%",
    originalPrice: 800,
    dealPrice: 560,
    creatorCommissionDA: 120,
    claimedCount: 42,
    maxCount: 100,
    wilaya: "Alger (16)",
    quartier: "Bab Ezzouar - Cité Ismail Yefsah",
    category: "Restauration",
    expiryDate: "Dans 3 jours",
  },
  {
    id: "deal-2",
    businessName: "Salon Coiffure El Bahia",
    businessId: "biz-2",
    titleFr: "Coupe & Brushing Pro VIP",
    titleAr: "قصة واستشوار في آي بي",
    discount: "-25%",
    originalPrice: 2400,
    dealPrice: 1800,
    creatorCommissionDA: 250,
    claimedCount: 18,
    maxCount: 40,
    wilaya: "Oran (31)",
    quartier: "Akid Lotfi",
    category: "Beauté",
    expiryDate: "Dans 5 jours",
  },
  {
    id: "deal-3",
    businessName: "Café des Amis Kouba",
    businessId: "biz-3",
    titleFr: "Formule Petit-Déjeuner Traditionnel Msemen + Café Presse",
    titleAr: "فطور الصباح مسمن مقرمش + قهوة بريس",
    discount: "-20%",
    originalPrice: 350,
    dealPrice: 280,
    creatorCommissionDA: 50,
    claimedCount: 75,
    maxCount: 150,
    wilaya: "Alger (16)",
    quartier: "Vieux Kouba",
    category: "Café",
    expiryDate: "Dans 2 jours",
  },
];

export interface PostComment {
  id: string;
  authorName: string;
  authorInitials: string;
  authorLevelNumber: number;
  authorLevelTitle: string;
  timeAgo: string;
  text: string;
  likesCount: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorLevel: {
    levelNumber: number;
    titleFr: string;
    titleAr: string;
  };
  wilayaOrigin: string;
  currentWilaya: string;
  isBerrani: boolean;
  timeAgo: string;
  contentFr: string;
  contentAr: string;
  type: "standard" | "deal_promo" | "review" | "alert";
  dealRef?: Deal;
  reviewRating?: number;
  reactions: Record<string, number>;
  userReaction?: string;
  commentsCount: number;
  sharesCount: number;
  coffeeTipsDA: number;
  comments: PostComment[];
}

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    authorId: "user-amine",
    authorName: "Amine Rezgui",
    authorRole: "Créateur local",
    authorLevel: {
      levelNumber: 2,
      titleFr: "Weld el Houma",
      titleAr: "ولد الحومة",
    },
    wilayaOrigin: "16 - Alger",
    currentWilaya: "16 - Alger",
    isBerrani: false,
    timeAgo: "Il y a 25 min",
    contentFr: "Les frères de Bab Ezzouar ! La sandwicherie El Forno vient de sortir son nouveau four à bois. J'ai négocié avec Ammi Rachid un bon exclusif Gasra de -30% sur le menu XL. Scannez le code au comptoir et régalez-vous !",
    contentAr: "يا خاوتنا في باب الزوار ! مطعم الفرنو دار فور جديد بالحطب. تفاهمنالكم مع عمي رشيد على بون تخفيض -30% خاص بقصرة. سكاني الكود عند الكاسة وبصحتكم مسبقا !",
    type: "deal_promo",
    dealRef: MOCK_DEALS[0],
    reactions: {
      ya3tik_saha: 38,
      hbel: 19,
      hhhh: 4,
      m3ak: 12,
      rani_jay: 27,
    },
    commentsCount: 3,
    sharesCount: 9,
    coffeeTipsDA: 350,
    comments: [
      {
        id: "c-1",
        authorName: "Yacine Belkacem",
        authorInitials: "YB",
        authorLevelNumber: 2,
        authorLevelTitle: "Weld el Houma",
        timeAgo: "Il y a 15 min",
        text: "يعطيك الصحة يا أمين ! جربتو البارح والشاورما بالخبز التقليدي قمة. كود التخفيض جاز عند الكاسة بدون أي مشكل.",
        likesCount: 6,
      },
      {
        id: "c-2",
        authorName: "Karim Benchikh",
        authorInitials: "KB",
        authorLevelNumber: 3,
        authorLevelTitle: "Sahb el Kelma",
        timeAgo: "Il y a 10 min",
        text: "مبادرة شابة بزاف. أصحاب المحلات يستاهلو التشجيع وخصوصا عمي رشيد معروف بنظافتو في الحومة.",
        likesCount: 4,
      },
      {
        id: "c-3",
        authorName: "Nassim Bab Ezzouar",
        authorInitials: "NB",
        authorLevelNumber: 1,
        authorLevelTitle: "Jar",
        timeAgo: "Il y a 4 min",
        text: "راني جاي دوك نضرب فيها غدا قبل ما يكمل الستوك !",
        likesCount: 2,
      },
    ],
  },
  {
    id: "post-2",
    authorId: "user-karim",
    authorName: "Karim Benchikh",
    authorRole: "Contributeur",
    authorLevel: {
      levelNumber: 3,
      titleFr: "Sahb el Kelma",
      titleAr: "صاحب الكلمة",
    },
    wilayaOrigin: "19 - Sétif",
    currentWilaya: "16 - Alger",
    isBerrani: true,
    timeAgo: "Il y a 1 h",
    contentFr: "[Avis Berrani vérifié] De passage à Alger pour le travail, testé le Café des Frères à Kouba. Accueil impeccable, thé à la menthe parfait et Wi-Fi rapide pour bosser. Mérite amplement sa réputation dans la commune !",
    contentAr: "[رأي براني موثق] جيت للعاصمة للخدمة وجوزت على مقهى الإخوة في القبة. استقبال هايل، أتاي بالنعناع حطة وكونيكسيون خفيفة. يستاهل السمعة الطيبة في الحومة !",
    type: "review",
    reviewRating: 5,
    reactions: {
      ya3tik_saha: 45,
      m3ak: 22,
      ya_hasra: 8,
      rani_jay: 6,
    },
    commentsCount: 2,
    sharesCount: 3,
    coffeeTipsDA: 150,
    comments: [
      {
        id: "c-4",
        authorName: "Mourad Kouba",
        authorInitials: "MK",
        authorLevelNumber: 2,
        authorLevelTitle: "Weld el Houma",
        timeAgo: "Il y a 45 min",
        text: "مرحبا بك خويا كريم في القبة ! دارك ومطرحك. قهوة الإخوة هي أقدم قهوة في الحومة.",
        likesCount: 8,
      },
    ],
  },
  {
    id: "post-3",
    authorId: "user-samia",
    authorName: "Samia Mansouri",
    authorRole: "Commerçante Pro",
    authorLevel: {
      levelNumber: 1,
      titleFr: "Jara Pro",
      titleAr: "جارة محترفة",
    },
    wilayaOrigin: "31 - Oran",
    currentWilaya: "31 - Oran",
    isBerrani: false,
    timeAgo: "Il y a 3 h",
    contentFr: "Bonjour à toutes les habitantes d'Akid Lotfi ! Pour célébrer la rénovation du salon El Bahia, voici notre bon découverte réservé à la communauté Gasra. N'oubliez pas d'appuyer sur 'Rani jay' pour que nous puissions préparer votre créneau !",
    contentAr: "صباح الخير على كل جاراتنا في عقيد لطفي ! بمناسبة تجديد صالون الباهية، هذا بون خاص لبنات قصرة. ما تنساوش تكليكيو على 'راني جاي' باش نوجدو موعدكم في أحسن الظروف !",
    type: "deal_promo",
    dealRef: MOCK_DEALS[1],
    reactions: {
      ya3tik_saha: 52,
      hbel: 31,
      rani_jay: 41,
    },
    commentsCount: 1,
    sharesCount: 16,
    coffeeTipsDA: 0,
    comments: [
      {
        id: "c-5",
        authorName: "Fatima Oran",
        authorInitials: "FO",
        authorLevelNumber: 2,
        authorLevelTitle: "Bent el Houma",
        timeAgo: "Il y a 2 h",
        text: "ألف مبروك التجديد سامية ! كليكيت على راني جاي وغدوة راني عندك في الصالون إن شاء الله.",
        likesCount: 5,
      },
    ],
  },
];

export interface GroupCommunity {
  id: string;
  name: string;
  wilaya: string;
  commune: string;
  category: string;
  membersCount: number;
  descriptionFr: string;
  descriptionAr: string;
  rules: string[];
  bannerHatched: string;
  postsCount: number;
}

export const MOCK_GROUPS: GroupCommunity[] = [
  {
    id: "grp-bab-ezzouar",
    name: "Les Voisins de Bab Ezzouar & Cités",
    wilaya: "16 - Alger",
    commune: "Bab Ezzouar",
    category: "Entraide & Vie de Quartier",
    membersCount: 1420,
    descriptionFr: "Le groupe officiel d'entraide, d'alertes citoyennes et de bons plans entre résidents de Bab Ezzouar (Ismail Yefsah, Sorical, 8 Mai 1945).",
    descriptionAr: "المجموعة الرسمية للتضامن والتنبيهات وتبادل الأخبار بين سكان بلدية باب الزوار.",
    rules: [
      "Respect mutuel et esprit de Houma",
      "Pas de publicité hors commune ou arnaques",
      "Paiements d'objets via séquestre Gasra uniquement",
    ],
    bannerHatched: "Quartier Ismail Yefsah",
    postsCount: 184,
  },
  {
    id: "grp-chineurs-alger",
    name: "Chineurs & Occasions Alger Centre",
    wilaya: "16 - Alger",
    commune: "Alger Centre",
    category: "Marketplace & Bonnes affaires",
    membersCount: 3890,
    descriptionFr: "Achat, vente et troc d'objets de seconde main avec garantie séquestre Gasra.",
    descriptionAr: "بيع وشراء وتبادل الأغراض المستعملة بالضمان المالي لقصرة.",
    rules: [
      "Photos réelles obligatoires",
      "Prix affiché obligatoirement en Dinars (DA)",
    ],
    bannerHatched: "Alger Centre Didouche",
    postsCount: 520,
  },
  {
    id: "grp-oran-bahia",
    name: "Sorties & Adresses El Bahia (Oran)",
    wilaya: "31 - Oran",
    commune: "Oran Centre",
    category: "Tourisme & Gastronomie",
    membersCount: 2150,
    descriptionFr: "Les meilleures adresses gourmandes, sorties et bons plans vérifiés par les Berranis et enfants d'Oran.",
    descriptionAr: "أحسن العناوين والمطاعم والنشاطات الموثقة في الباهية وهران.",
    rules: [
      "Avis vérifiés avec photos",
      "Partage des bons Gasra bienvenu",
    ],
    bannerHatched: "Front de Mer Oran",
    postsCount: 290,
  },
];

export interface MarketplaceItem {
  id: string;
  title: string;
  titleAr: string;
  priceDA: number;
  sellerId: string;
  sellerName: string;
  sellerLevelTitle: string;
  sellerRating: number;
  wilaya: string;
  commune: string;
  category: string;
  condition: string;
  isEscrowProtected: boolean;
  descriptionFr: string;
  descriptionAr: string;
  viewsCount: number;
  status: "disponible" | "en_sequestre" | "vendu";
}

export const MOCK_MARKETPLACE: MarketplaceItem[] = [
  {
    id: "item-scooter-karim",
    title: "Scooter Piaggio Liberty 125cc (Très bon état)",
    titleAr: "دراجة نارية بياجيو ليبرتي 125 سم مكعب بحالة ممتازة",
    priceDA: 185000,
    sellerId: "user-karim",
    sellerName: "Karim Benchikh",
    sellerLevelTitle: "Sahb el Kelma (Niv. 3)",
    sellerRating: 5.0,
    wilaya: "19 - Sétif",
    commune: "Sétif Ville",
    category: "Véhicules",
    condition: "Occasion certifiée",
    isEscrowProtected: true,
    descriptionFr: "Scooter entretenu chez concessionnaire, vidange récente, papiers en règle. Possibilité de remise en main propre avec vérification mécanique. Paiement 100% protégé par séquestre Gasra.",
    descriptionAr: "دراجة نقية ومحافظ عليها، الوثائق كاملة مسوية. المعاينة الميدانية والدفع بالضمان الآمن لقصرة.",
    viewsCount: 340,
    status: "disponible",
  },
  {
    id: "item-iphone",
    title: "iPhone 13 128Go Batterie 91% avec boîte",
    titleAr: "آيفون 13 سعة 128 جيغا بطارية 91% بالعلبة الأصلية",
    priceDA: 82000,
    sellerId: "user-amine",
    sellerName: "Amine Rezgui",
    sellerLevelTitle: "Weld el Houma (Niv. 2)",
    sellerRating: 4.8,
    wilaya: "16 - Alger",
    commune: "Bab Ezzouar",
    category: "Téléphonie",
    condition: "Excellent état",
    isEscrowProtected: true,
    descriptionFr: "Vendu avec chargeur d'origine et 2 coques. Jamais ouvert ni réparé. Test sur place possible au café de la cité Ismail Yefsah.",
    descriptionAr: "هاتف نقي بدون أي خدش، كل الأكسسوارات الأصلية متوفرة.",
    viewsCount: 512,
    status: "disponible",
  },
  {
    id: "item-tapis",
    title: "Tapis Berbère artisanal pure laine fait main",
    titleAr: "زرابية أمازيغية تقليدية صوف طبيعي 100%",
    priceDA: 24000,
    sellerId: "user-samia",
    sellerName: "Samia Mansouri",
    sellerLevelTitle: "Jara Pro",
    sellerRating: 4.9,
    wilaya: "31 - Oran",
    commune: "Akid Lotfi",
    category: "Artisanat & Décoration",
    condition: "Neuf d'artisanat",
    isEscrowProtected: true,
    descriptionFr: "Tissé à la main par une coopérative locale de femmes artisanes. Dimensions 2m x 1.4m. Motifs traditionnels.",
    descriptionAr: "صناعة يدوية تقليدية أصلية من الصوف الخالص بجودة عالية.",
    viewsCount: 189,
    status: "disponible",
  },
];

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: {
    id: string;
    senderId: string;
    text: string;
    time: string;
    isMine: boolean;
  }[];
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participantId: "biz-1",
    participantName: "Ammi Rachid (El Forno)",
    participantRole: "Gérant Sandwicherie Bab Ezzouar",
    participantAvatar: "EF",
    lastMessage: "Marhba bik ya Amine ! Le bon -30% a ramené 15 voisins ce midi.",
    lastMessageTime: "14:15",
    unreadCount: 1,
    messages: [
      {
        id: "m-1",
        senderId: "user-amine",
        text: "Salem Ammi Rachid ! J'ai partagé le bon de -30% sur mon fil Gasra avec le lien du QR.",
        time: "11:30",
        isMine: true,
      },
      {
        id: "m-2",
        senderId: "biz-1",
        text: "Marhba bik ya Amine ! Le bon -30% a ramené 15 voisins ce midi, la commission a été validée au scan en caisse.",
        time: "14:15",
        isMine: false,
      },
    ],
  },
  {
    id: "conv-2",
    participantId: "user-karim",
    participantName: "Karim Benchikh",
    participantRole: "Sahb el Kelma (Sétif)",
    participantAvatar: "KB",
    lastMessage: "La moto est toujours disponible. On peut bloquer le séquestre quand tu veux.",
    lastMessageTime: "Hier",
    unreadCount: 0,
    messages: [
      {
        id: "m-3",
        senderId: "user-amine",
        text: "Salem Si Karim, la Vespa est encore disponible ?",
        time: "Hier 16:00",
        isMine: true,
      },
      {
        id: "m-4",
        senderId: "user-karim",
        text: "Salem khoya ! Oui, elle est garée à Alger chez mon frère. On passe par le séquestre Gasra pour la sécurité de l'argent.",
        time: "Hier 16:45",
        isMine: false,
      },
    ],
  },
];

export interface GasraNotification {
  id: string;
  type: "money" | "coffee" | "level" | "deal" | "comment";
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  timeAgo: string;
  isRead: boolean;
  link?: string;
  badgeAmount?: string;
}

export const MOCK_NOTIFICATIONS: GasraNotification[] = [
  {
    id: "notif-1",
    type: "money",
    titleFr: "Commission créditée !",
    titleAr: "تم تحويل العمولة !",
    descriptionFr: "+360 DA versés sur votre portefeuille suite au scan de votre bon à la Sandwicherie El Forno.",
    descriptionAr: "+360 دج دخلت محفظتك بعد مسح الزبائن للبون في مطعم الفرنو.",
    timeAgo: "Il y a 10 min",
    isRead: false,
    badgeAmount: "+360 DA",
  },
  {
    id: "notif-2",
    type: "coffee",
    titleFr: "Karim B. vous a offert un café ☕",
    titleAr: "كريم خلص عليك قهوة ☕",
    descriptionFr: "Un pourboire de 100 DA a été ajouté à votre solde.",
    descriptionAr: "وصلك تشجيع بقيمة 100 دج في رصيدك.",
    timeAgo: "Il y a 45 min",
    isRead: false,
    badgeAmount: "+100 DA",
  },
  {
    id: "notif-3",
    type: "level",
    titleFr: "Nouveau titre de réputation !",
    titleAr: "ترقية جديدة في الحومة !",
    descriptionFr: "Vous êtes désormais Weld el Houma (ولد الحومة) à Bab Ezzouar ! Vos points valent x1.25.",
    descriptionAr: "مبروك أصبحت رسميا ولد الحومة في باب الزوار وقيمة نقاطك زادت !",
    timeAgo: "Hier",
    isRead: true,
  },
  {
    id: "notif-4",
    type: "deal",
    titleFr: "Nouveau Bon du Quartier à 300m",
    titleAr: "بون جديد قريب منك",
    descriptionFr: "Salon El Bahia propose -25% à Akid Lotfi.",
    descriptionAr: "صالون الباهية أطلق تخفيض -25% في عقيد لطفي.",
    timeAgo: "Hier",
    isRead: true,
  },
];

export interface NeighborhoodPulse {
  wilayaName: string;
  communeName: string;
  news: {
    id: string;
    tag: string;
    textFr: string;
    textAr: string;
    time: string;
  }[];
  activeMission: {
    id: string;
    titleFr: string;
    titleAr: string;
    rewardPoints: number;
    equivalentDA: number;
    timeLimit: string;
    spotsLeft: number;
  };
  highlightDeal: Deal;
  upcomingEvent: {
    titleFr: string;
    titleAr: string;
    locationFr: string;
    locationAr: string;
    date: string;
    attendees: number;
  };
}

export const MOCK_PULSE: NeighborhoodPulse = {
  wilayaName: "Alger (16)",
  communeName: "Bab Ezzouar",
  news: [
    {
      id: "n-1",
      tag: "Travaux",
      textFr: "Réfection du bitume rond-point Cité 8 Mai : déviation active vers le boulevard de l'Université.",
      textAr: "أشغال تعبيد محور دوران حي 8 ماي : تحويل حركة المرور نحو طريق الجامعة.",
      time: "07:30",
    },
    {
      id: "n-2",
      tag: "Santé",
      textFr: "Pharmacie de garde de nuit : Pharmacie El Afia, face à la mosquée Bilal.",
      textAr: "صيدلية المناوبة الليلية : صيدلية العافية، مقابل مسجد بلال.",
      time: "08:15",
    },
    {
      id: "n-3",
      tag: "Commerce",
      textFr: "Ouverture ce matin de la coopérative de fruits et légumes frais à la Cité Ismail Yefsah.",
      textAr: "افتتاح نقطة بيع الخضر والفواكه الطازجة بحي إسماعيل يفصح صباح اليوم.",
      time: "09:00",
    },
  ],
  activeMission: {
    id: "m-101",
    titleFr: "Mission discrète : Photographier les horaires et tarifs de la nouvelle laverie automatique",
    titleAr: "مهمة سريعة : تصوير أوقات العمل وأسعار المغسلة الآلية الجديدة",
    rewardPoints: 120,
    equivalentDA: 180,
    timeLimit: "Expire à 18h",
    spotsLeft: 3,
  },
  highlightDeal: MOCK_DEALS[0],
  upcomingEvent: {
    titleFr: "Tournoi inter-quartiers de football de rue des jeunes",
    titleAr: "دورة الأحياء لكرة القدم للشباب",
    locationFr: "Stade de proximité Cité 5 Juillet",
    locationAr: "الملعب الجواري حي 5 جويلية",
    date: "Ce vendredi à 16h30",
    attendees: 84,
  },
};
