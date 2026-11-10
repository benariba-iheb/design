export interface Wilaya {
  code: string;
  nameFr: string;
  nameAr: string;
  communes: {
    nameFr: string;
    nameAr: string;
    quartiers: string[];
  }[];
}

export const ALGERIAN_WILAYAS: Wilaya[] = [
  {
    code: "16",
    nameFr: "Alger",
    nameAr: "الجزائر",
    communes: [
      {
        nameFr: "Bab Ezzouar",
        nameAr: "باب الزوار",
        quartiers: ["Cité Ismail Yefsah", "Sorical", "Cité 8 Mai 1945", "Cité Universitaire", "Boushaki"],
      },
      {
        nameFr: "Kouba",
        nameAr: "القبة",
        quartiers: ["Vieux Kouba", "Ben Omar", "La Croix", "Appreval", "Joly"],
      },
      {
        nameFr: "Hydra",
        nameAr: "حيدرة",
        quartiers: ["Djenane El Malik", "Paradou", "Val d'Hydra", "Cité DNC"],
      },
      {
        nameFr: "Sidi M'Hamed",
        nameAr: "سيدي امحمد",
        quartiers: ["Belcourt (Belouizdad)", "Rue Didouche Mourad", "1er Mai", "Champ de Manœuvre"],
      },
    ],
  },
  {
    code: "31",
    nameFr: "Oran",
    nameAr: "وهران",
    communes: [
      {
        nameFr: "Oran Centre",
        nameAr: "وهران وسط",
        quartiers: ["Akid Lotfi", "Front de Mer", "Sidi El Houari", "Gambetta", "Maraval"],
      },
      {
        nameFr: "Aïn El Turk",
        nameAr: "عين الترك",
        quartiers: ["Bouisseville", "Cap Falcon", "Trouville"],
      },
    ],
  },
  {
    code: "19",
    nameFr: "Sétif",
    nameAr: "سطيف",
    communes: [
      {
        nameFr: "Sétif Ville",
        nameAr: "سطيف",
        quartiers: ["Ain Fouara", "Cité 1014", "Bel Air", "Tandja", "El Hidhab"],
      },
    ],
  },
  {
    code: "25",
    nameFr: "Constantine",
    nameAr: "قسنطينة",
    communes: [
      {
        nameFr: "Constantine Ville",
        nameAr: "قسنطينة",
        quartiers: ["Bellevue", "Coudiat", "Sidi Mabrouk", "Ali Mendjeli", "Ziadia"],
      },
    ],
  },
  {
    code: "06",
    nameFr: "Béjaïa",
    nameAr: "بجاية",
    communes: [
      {
        nameFr: "Béjaïa Ville",
        nameAr: "بجاية",
        quartiers: ["Ihadaden", "Targa Ouzemour", "Brimat", "Edimco", "La Plaine"],
      },
    ],
  },
  {
    code: "13",
    nameFr: "Tlemcen",
    nameAr: "تلمسان",
    communes: [
      {
        nameFr: "Tlemcen Ville",
        nameAr: "تلمسان",
        quartiers: ["El Mechouar", "Kiffane", "Imama", "Bab El Djiad"],
      },
    ],
  },
];
