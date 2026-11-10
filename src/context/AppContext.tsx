import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_POSTS, MOCK_DEALS, MOCK_NOTIFICATIONS, NEW_USER_NOTIFICATIONS, Post, Deal, GasraNotification } from "../data/mockData";
import { getAccount, saveAccount, logout } from "../data/accounts";

export type Language = "fr" | "ar";
export type Theme = "light" | "dark";
export type DeviceMode = "mobile-frame" | "responsive";

export interface UserProfile {
  accountId?: string;
  email?: string;
  handle?: string;
  bio?: string;
  phone?: string;
  plan?: "gratuit" | "premium" | "influenceur";
  certified?: boolean;
  isNew?: boolean;
  followers?: number;
  following?: number;
  postsCount?: number;
  interests?: string[];
  socials?: Record<string, boolean>;
  name: string;
  avatarInitials: string;
  role: string;
  originWilayaCode: string;
  originWilayaName: string;
  commune: string;
  quartier: string;
  levelNumber: number;
  levelTitleFr: string;
  levelTitleAr: string;
  points: number;
  walletBalanceDA: number;
  isCreatorPreference: boolean;
  wilayaReputations: {
    wilayaCode: string;
    wilayaName: string;
    levelTitleFr: string;
    levelTitleAr: string;
    isBerrani: boolean;
    primeBerraniActive: boolean;
    pointsInWilaya: number;
  }[];
}

interface AppContextType {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  deviceMode: DeviceMode;
  setDeviceMode: (m: DeviceMode) => void;
  currentWilaya: string;
  setCurrentWilaya: (w: string) => void;
  currentQuartier: string;
  setCurrentQuartier: (q: string) => void;
  user: UserProfile;
  posts: Post[];
  deals: Deal[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebarCollapsed: () => void;
  notifications: import("../data/mockData").GasraNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  reactToPost: (postId: string, reactionId: string) => void;
  sendCoffeeTip: (postId: string, amountDA: number) => boolean;
  claimDeal: (dealId: string) => void;
  triggerRaniJay: (targetId: string) => void;
  convertPointsToDA: () => void;
  withdrawToEdahabia: (amount: number) => boolean;
  updateUser: (partial: Partial<UserProfile>) => void;
  signOut: () => void;
}

const initialUser: UserProfile = {
  name: "Amine Rezgui",
  avatarInitials: "AR",
  role: "Créateur & Voisin actif",
  originWilayaCode: "16",
  originWilayaName: "Alger",
  commune: "Bab Ezzouar",
  quartier: "Cité Ismail Yefsah",
  levelNumber: 2,
  levelTitleFr: "Weld el Houma",
  levelTitleAr: "ولد الحومة",
  points: 580,
  walletBalanceDA: 4250,
  isCreatorPreference: true,
  wilayaReputations: [
    {
      wilayaCode: "16",
      wilayaName: "Alger (الجزائر)",
      levelTitleFr: "Weld el Houma (Niv. 2)",
      levelTitleAr: "ولد الحومة (المستوى 2)",
      isBerrani: false,
      primeBerraniActive: false,
      pointsInWilaya: 490,
    },
    {
      wilayaCode: "31",
      wilayaName: "Oran (وهران)",
      levelTitleFr: "Berrani actif (البراني)",
      levelTitleAr: "براني نشط",
      isBerrani: true,
      primeBerraniActive: true,
      pointsInWilaya: 90,
    },
    {
      wilayaCode: "19",
      wilayaName: "Sétif (سطيف)",
      levelTitleFr: "Berrani nouveau",
      levelTitleAr: "براني جديد",
      isBerrani: true,
      primeBerraniActive: true,
      pointsInWilaya: 0,
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("fr");
  // Sombre par défaut ; le choix de l'utilisateur est mémorisé (lu aussi par index.html avant l'affichage)
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("gasra.theme") as Theme) || "dark";
    } catch {
      return "dark";
    }
  });
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("responsive");
  const [currentWilaya, setCurrentWilaya] = useState<string>("16 - Alger");
  const [currentQuartier, setCurrentQuartier] = useState<string>(() => {
    const acc = getAccount();
    if (!acc) return "Bab Ezzouar — Cité Ismail Yefsah";
    return acc.quartier && acc.quartier !== acc.commune ? `${acc.commune} — ${acc.quartier}` : acc.commune;
  });
  // Utilisateur = compte connecté (démo) ; à défaut, le profil historique
  const [user, setUser] = useState<UserProfile>(() => {
    const acc = getAccount();
    if (!acc) return initialUser;
    const { password, login, id, ...rest } = acc;
    return { ...initialUser, ...rest, accountId: id, isCreatorPreference: acc.plan !== "gratuit" } as UserProfile;
  });
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  // Notifications du compte connecté (un nouveau compte ne reçoit que la bienvenue)
  const [notifications, setNotifications] = useState<GasraNotification[]>(() => (getAccount()?.isNew ? NEW_USER_NOTIFICATIONS : MOCK_NOTIFICATIONS));

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const dir = language === "ar" ? "rtl" : "ltr";

  // Sync HTML attributes
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
  }, [language, dir]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("gasra.theme", theme);
    } catch {}
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const reactToPost = (postId: string, reactionId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const currentReactions = { ...post.reactions };
        const previousReaction = post.userReaction;

        if (previousReaction === reactionId) {
          // Toggle off
          currentReactions[reactionId] = Math.max(0, (currentReactions[reactionId] || 1) - 1);
          return {
            ...post,
            reactions: currentReactions,
            userReaction: undefined,
          };
        } else {
          // Decrement previous if existed
          if (previousReaction && currentReactions[previousReaction]) {
            currentReactions[previousReaction] = Math.max(0, currentReactions[previousReaction] - 1);
          }
          currentReactions[reactionId] = (currentReactions[reactionId] || 0) + 1;
          return {
            ...post,
            reactions: currentReactions,
            userReaction: reactionId,
          };
        }
      })
    );
  };

  const sendCoffeeTip = (postId: string, amountDA: number): boolean => {
    if (user.walletBalanceDA < amountDA) {
      return false;
    }
    setUser((prev) => ({
      ...prev,
      walletBalanceDA: prev.walletBalanceDA - amountDA,
    }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              coffeeTipsDA: p.coffeeTipsDA + amountDA,
              reactions: {
                ...p.reactions,
                ya3tik_saha: (p.reactions.ya3tik_saha || 0) + 1,
              },
            }
          : p
      )
    );
    return true;
  };

  const claimDeal = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, claimedCount: Math.min(d.maxCount, d.claimedCount + 1) }
          : d
      )
    );
  };

  const triggerRaniJay = (targetId: string) => {
    // Increment rani_jay for matching post or deal
    setPosts((prev) =>
      prev.map((p) =>
        p.id === targetId || p.dealRef?.id === targetId
          ? {
              ...p,
              reactions: {
                ...p.reactions,
                rani_jay: (p.reactions.rani_jay || 0) + 1,
              },
            }
          : p
      )
    );
  };

  const convertPointsToDA = () => {
    if (user.points <= 0) return;
    // Calculation: 1 point = 1.5 DA at Level 2 (multiplier 1.25x applied)
    const convertedDA = Math.floor(user.points * 1.5);
    setUser((prev) => ({
      ...prev,
      points: 0,
      walletBalanceDA: prev.walletBalanceDA + convertedDA,
    }));
  };

  const withdrawToEdahabia = (amount: number): boolean => {
    if (amount <= 0 || user.walletBalanceDA < amount) return false;
    setUser((prev) => ({
      ...prev,
      walletBalanceDA: prev.walletBalanceDA - amount,
    }));
    return true;
  };

  // Sauvegarde des changements de solde / points / profil sur le compte
  useEffect(() => {
    if (!user.accountId) return;
    const { accountId, isCreatorPreference, ...rest } = user as any;
    saveAccount(rest);
  }, [user]);

  const updateUser = (partial: Partial<UserProfile>) => setUser((prev) => ({ ...prev, ...partial }));

  const signOut = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <AppContext.Provider
      value={{
        language,
        dir,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        deviceMode,
        setDeviceMode,
        currentWilaya,
        setCurrentWilaya,
        currentQuartier,
        setCurrentQuartier,
        user,
        posts,
        deals,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebarCollapsed,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        reactToPost,
        sendCoffeeTip,
        claimDeal,
        triggerRaniJay,
        convertPointsToDA,
        withdrawToEdahabia,
        updateUser,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
