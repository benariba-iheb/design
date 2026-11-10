/**
 * Comptes de démonstration Gasra (fictifs) + session locale.
 * Tout est gardé dans le navigateur (localStorage) — aucune donnée réelle.
 */
export type Plan = "gratuit" | "premium" | "influenceur";

export interface WilayaRep {
  wilayaCode: string;
  wilayaName: string;
  levelTitleFr: string;
  levelTitleAr: string;
  isBerrani: boolean;
  primeBerraniActive: boolean;
  pointsInWilaya: number;
}

export interface Account {
  id: string;
  login: string;
  email: string;
  password: string;
  name: string;
  avatarInitials: string;
  handle: string;
  role: string;
  bio: string;
  phone: string;
  originWilayaCode: string;
  originWilayaName: string;
  commune: string;
  quartier: string;
  levelNumber: number;
  levelTitleFr: string;
  levelTitleAr: string;
  points: number;
  walletBalanceDA: number;
  plan: Plan;
  certified: boolean;
  isNew: boolean;
  followers: number;
  following: number;
  postsCount: number;
  interests: string[];
  socials: Record<string, boolean>;
  wilayaReputations: WilayaRep[];
}

const AMINE: Account = {
  id: "amine",
  login: "amine.rezgui",
  email: "amine@gasra.dz",
  password: "Gasra2026!",
  name: "Amine Rezgui",
  avatarInitials: "AR",
  handle: "amine.rezgui",
  role: "Influenceur certifié · Créateur local",
  bio: "Je teste les bons plans de la houma et je les partage. Fondateur de Amine Tech Corner 📱",
  phone: "0555 12 34 56",
  originWilayaCode: "16",
  originWilayaName: "Alger",
  commune: "Bab Ezzouar",
  quartier: "Cité Ismail Yefsah",
  levelNumber: 3,
  levelTitleFr: "Sahb el Kelma",
  levelTitleAr: "صاحب الكلمة",
  points: 1420,
  walletBalanceDA: 12450,
  plan: "influenceur",
  certified: true,
  isNew: false,
  followers: 2340,
  following: 186,
  postsCount: 48,
  interests: ["Food", "Tech", "Bons plans", "Sport"],
  socials: { instagram: true, tiktok: true, facebook: false, youtube: false },
  wilayaReputations: [
    { wilayaCode: "16", wilayaName: "Alger (الجزائر)", levelTitleFr: "Sahb el Kelma (Niv. 3)", levelTitleAr: "صاحب الكلمة (المستوى 3)", isBerrani: false, primeBerraniActive: false, pointsInWilaya: 1240 },
    { wilayaCode: "31", wilayaName: "Oran (وهران)", levelTitleFr: "Berrani actif (البراني)", levelTitleAr: "براني نشط", isBerrani: true, primeBerraniActive: true, pointsInWilaya: 150 },
    { wilayaCode: "19", wilayaName: "Sétif (سطيف)", levelTitleFr: "Berrani nouveau", levelTitleAr: "براني جديد", isBerrani: true, primeBerraniActive: true, pointsInWilaya: 30 },
  ],
};

const newAccountTemplate = (id: string, name: string, login: string, email: string, password: string): Account => ({
  id,
  login,
  email,
  password,
  name,
  avatarInitials: name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  handle: login,
  role: "Nouveau voisin",
  bio: "",
  phone: "",
  originWilayaCode: "16",
  originWilayaName: "Alger",
  commune: "Kouba",
  quartier: "Kouba",
  levelNumber: 1,
  levelTitleFr: "Jar",
  levelTitleAr: "جار",
  points: 0,
  walletBalanceDA: 0,
  plan: "gratuit",
  certified: false,
  isNew: true,
  followers: 0,
  following: 0,
  postsCount: 0,
  interests: [],
  socials: { instagram: false, tiktok: false, facebook: false, youtube: false },
  wilayaReputations: [
    { wilayaCode: "16", wilayaName: "Alger (الجزائر)", levelTitleFr: "Jar (Niv. 1)", levelTitleAr: "جار (المستوى 1)", isBerrani: false, primeBerraniActive: false, pointsInWilaya: 0 },
  ],
});

const YASMINE = newAccountTemplate("yasmine", "Yasmine Hadj", "yasmine.hadj", "yasmine@gasra.dz", "Bienvenue2026!");

export const DEMO_ACCOUNTS: Account[] = [AMINE, YASMINE];

/* ------------------------------------------------------------------ */
const SESSION = "gasra.session";
const CUSTOM = "gasra.customAccounts";
const read = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const allBase = (): Account[] => [...DEMO_ACCOUNTS, ...read<Account[]>(CUSTOM, [])];

export function getSessionId(): string | null {
  try {
    return localStorage.getItem(SESSION);
  } catch {
    return null;
  }
}

/** Clé de stockage propre au compte connecté */
export const acctKey = (k: string) => `gasra.${k}.${getSessionId() || "anon"}`;

export function getAccount(id: string | null = getSessionId()): Account | null {
  if (!id) return null;
  const base = allBase().find((a) => a.id === id);
  if (!base) return null;
  return { ...base, ...read<Partial<Account>>(`gasra.account.${id}`, {}) };
}

export function saveAccount(partial: Partial<Account>) {
  const id = getSessionId();
  if (!id) return;
  const prev = read<Partial<Account>>(`gasra.account.${id}`, {});
  write(`gasra.account.${id}`, { ...prev, ...partial });
}

/** Données de départ (boutique, amis…) écrites à la première connexion */
function seed(acc: Account) {
  const k = (x: string) => `gasra.${x}.${acc.id}`;
  if (localStorage.getItem(k("seeded"))) return;
  if (acc.id === "amine") {
    write(k("myShop"), {
      shop: { id: "mine", name: "Amine Tech Corner", description: "Accessoires smartphone, audio et objets connectés — livraison dans tout Alger", category: "electronique", wilaya: "Alger", rating: 4.8, verified: true, mine: true },
      products: [
        { id: "am1", shopId: "mine", key: "ecouteurs", name: "Écouteurs sans fil Pro", priceDA: 5500, category: "electronique", emoji: "🎧" },
        { id: "am2", shopId: "mine", key: "chargeur", name: "Chargeur rapide 33W", priceDA: 2300, category: "electronique", emoji: "🔌" },
        { id: "am3", shopId: "mine", key: "powerbank", name: "Batterie externe 20 000 mAh", priceDA: 3900, category: "electronique", emoji: "🔋" },
        { id: "am4", shopId: "mine", key: "montre", name: "Montre connectée Sport", priceDA: 8500, category: "electronique", emoji: "⌚" },
      ],
    });
    write(k("social"), { friends: ["user-karim", "p-ines", "p-rafik", "p-samy", "p-leila"], sent: [], incoming: ["p-amina"] });
  } else {
    write(k("social"), { friends: [], sent: [], incoming: [] });
  }
  localStorage.setItem(k("seeded"), "1");
}

export function login(identifier: string, password: string): Account | null {
  const id = identifier.trim().toLowerCase();
  const acc = allBase().find((a) => (a.login.toLowerCase() === id || a.email.toLowerCase() === id) && a.password === password);
  if (!acc) return null;
  localStorage.setItem(SESSION, acc.id);
  seed(acc);
  return acc;
}

export function signup(name: string, email: string, password: string): Account | { error: string } {
  const e = email.trim().toLowerCase();
  if (allBase().some((a) => a.email.toLowerCase() === e)) return { error: "Un compte existe déjà avec cet e-mail." };
  const login = e.split("@")[0].replace(/[^a-z0-9.]/g, "") || "voisin";
  const acc = newAccountTemplate(`u${Date.now()}`, name.trim(), login, e, password);
  write(CUSTOM, [...read<Account[]>(CUSTOM, []), acc]);
  localStorage.setItem(SESSION, acc.id);
  seed(acc);
  return acc;
}

export function logout() {
  try {
    localStorage.removeItem(SESSION);
  } catch {}
}

/** Remet un compte de démo dans son état d'origine */
export function resetDemo() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("gasra.") && k !== "gasra.theme")
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}
