/** Personnes de démo pour Amis / Messages */
export interface Person {
  id: string;
  name: string;
  initials: string;
  wilaya: string;
  levelNumber: number;
  bio: string;
  mutual: number;
  online?: boolean;
  hue: string; // couleur de l'avatar
}

export const PEOPLE: Person[] = [
  { id: "user-karim", name: "Karim Benchikh", initials: "KB", wilaya: "Sétif", levelNumber: 3, bio: "Citoyen actif, suit la vie de sa ville", mutual: 8, online: true, hue: "#5E47D1" },
  { id: "user-samia", name: "Samia Mansouri", initials: "SM", wilaya: "Oran", levelNumber: 1, bio: "Gérante du salon El Bahia", mutual: 5, hue: "#DB57C5" },
  { id: "p-ines", name: "Ines Boudiaf", initials: "IB", wilaya: "Alger", levelNumber: 2, bio: "Photographe de quartier", mutual: 12, online: true, hue: "#0DCCF2" },
  { id: "p-samy", name: "Samy Haddad", initials: "SH", wilaya: "Alger", levelNumber: 2, bio: "Foot le vendredi à la cité 5 Juillet", mutual: 6, hue: "#2fddcb" },
  { id: "p-leila", name: "Leïla Kaci", initials: "LK", wilaya: "Oran", levelNumber: 3, bio: "Bons plans & sorties à Oran", mutual: 3, online: true, hue: "#FF8552" },
  { id: "p-yacine", name: "Yacine Ferhat", initials: "YF", wilaya: "Blida", levelNumber: 1, bio: "Étudiant en informatique", mutual: 2, hue: "#22C55E" },
  { id: "p-nour", name: "Nour El Houda", initials: "NH", wilaya: "Tlemcen", levelNumber: 2, bio: "Artisanat et décoration", mutual: 4, hue: "#A855F7" },
  { id: "p-rafik", name: "Rafik Mebarki", initials: "RM", wilaya: "Constantine", levelNumber: 4, bio: "Ambassadeur Gasra de sa wilaya", mutual: 9, online: true, hue: "#3B82F6" },
  { id: "p-amina", name: "Amina Zerrouki", initials: "AZ", wilaya: "Alger", levelNumber: 2, bio: "Toujours au courant des nouveautés", mutual: 7, hue: "#F43F5E" },
];

export const LEVEL_TITLES: Record<number, string> = {
  1: "Jar",
  2: "Weld el Houma",
  3: "Sahb el Kelma",
  4: "Kbir el Houma",
};
