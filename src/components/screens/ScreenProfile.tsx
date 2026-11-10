import React, { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Settings,
  Sparkles,
  LifeBuoy,
  LogOut,
  Store,
  Crown,
  Gift,
  Copy,
  Share2,
  Users,
  MessageCircle,
  UserPlus,
  Check,
  Sprout,
  Hand,
  Award,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { acctKey } from "../../data/accounts";
import { CONTRIBUTOR_LEVELS, PERSONAS, MOCK_POSTS } from "../../data/mockData";
import { CoffeeModal } from "../common/CoffeeModal";
import { LevelBadge } from "../common/LevelBadge";

type Tab = "posts" | "avis" | "stats";

const REVIEWS = [
  { id: "r1", shop: "Sandwicherie El Forno", rating: 5, text: "Chawarma XL généreux, le bon -30% fonctionne bien au comptoir.", date: "Il y a 3 j" },
  { id: "r2", shop: "Café des Frères", rating: 4, text: "Ambiance de quartier, bon café. Un peu de monde le soir.", date: "Il y a 1 sem" },
];

export const ScreenProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user, language, signOut } = useApp();
  const isAr = language === "ar";
  const [tab, setTab] = useState<Tab>("posts");
  const [coffeeOpen, setCoffeeOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOther = !!userId && userId !== "me" && userId !== user.accountId && !(user.accountId === "amine" && userId === "user-amine");
  const persona = isOther ? PERSONAS.find((p) => p.id === userId) || PERSONAS[2] : null;

  const name = persona ? persona.name : user.name;
  const initials = persona ? persona.avatarInitials : user.avatarInitials;
  const levelNumber = persona ? persona.levelNumber : user.levelNumber;
  const location = persona ? persona.location : `${user.commune}, ${user.originWilayaName}`;
  const slug = (t: string) => t.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
  const handle = "@" + (persona ? slug(name) : user.handle || slug(name));
  const certified = persona ? true : !!user.certified;
  const isNewUser = !persona && !!user.isNew;
  const points = persona ? 1200 : user.points;

  const level = CONTRIBUTOR_LEVELS.find((l) => l.levelNumber === levelNumber) || CONTRIBUTOR_LEVELS[1];
  const next = CONTRIBUTOR_LEVELS.find((l) => l.levelNumber === levelNumber + 1);
  const progress = next ? Math.min(100, Math.max(4, Math.round(((points - level.minPoints) / (next.minPoints - level.minPoints)) * 100))) : 100;
  const influence = Math.min(100, Math.round(points / 25));

  const myPosts = useMemo(() => MOCK_POSTS.filter((p) => p.authorName === name), [name]);
  const posts = isNewUser ? [] : myPosts.length ? myPosts : MOCK_POSTS.slice(0, 2);

  const myShop = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(acctKey("myShop")) || "null")?.shop?.name as string | undefined;
    } catch {
      return undefined;
    }
  }, []);

  const code = "GASRA-" + initials + "16";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const stats = [
    { label: isAr ? "منشورات" : "Posts", value: persona ? 24 : user.postsCount ?? 0 },
    { label: isAr ? "متابِعون" : "Abonnés", value: (persona ? 348 : user.followers ?? 0) + (following ? 1 : 0) },
    { label: isAr ? "متابَعون" : "Abonnements", value: persona ? 127 : user.following ?? 0 },
    { label: "pts", value: points, accent: true },
  ];

  const journey = [
    { n: 1, icon: Sprout, fr: CONTRIBUTOR_LEVELS[0]?.titleFrM || "Jar" },
    { n: 2, icon: Hand, fr: CONTRIBUTOR_LEVELS[1]?.titleFrM || "Weld el Houma" },
    { n: 3, icon: Award, fr: CONTRIBUTOR_LEVELS[2]?.titleFrM || "Sahb el Kelma" },
    { n: 4, icon: Crown, fr: CONTRIBUTOR_LEVELS[3]?.titleFrM || "Kbir el Houma" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-5 space-y-4">
      {isOther && (
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
          <ArrowLeft size={16} /> {isAr ? "رجوع" : "Retour"}
        </button>
      )}

      {/* ---------- En-tête ---------- */}
      <div className="flex items-center gap-4">
        <span className="story-ring-animated p-[3px] rounded-full shrink-0">
          <span className="profile-avatar w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-black">{initials}</span>
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gasra-text tracking-tight">{name}</h1>
            {certified ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent">
                <ShieldCheck size={12} /> {isAr ? "موثق" : "Influenceur certifié"}
              </span>
            ) : isNewUser ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gasra-surface-subtle text-gasra-text-secondary">✨ Nouveau</span>
            ) : null}
          </div>
          <div className="text-sm text-gasra-text-muted">{handle}</div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gasra-text-secondary">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {location}
            </span>
            <LevelBadge levelNumber={levelNumber} size="sm" />
          </div>
        </div>
      </div>

      {/* ---------- Chiffres ---------- */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="py-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-center">
            <div className={`text-lg sm:text-xl font-black font-mono ${s.accent ? "text-gasra-accent" : "text-gasra-text"}`}>{s.value.toLocaleString("fr-FR")}</div>
            <div className="text-[11px] text-gasra-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ---------- Score d'influence ---------- */}
      <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-gasra-text-secondary">{isAr ? "درجة التأثير" : "Score d'influence"}</span>
          <span className="text-gasra-accent font-mono">{influence}/100</span>
        </div>
        <div className="relative h-2 rounded-full bg-gasra-surface-subtle overflow-hidden">
          <motion.div className="influence-bar absolute inset-y-0 left-0 rounded-full" initial={{ width: 0 }} animate={{ width: `${influence}%` }} transition={{ duration: 1, ease: "easeOut" }} />
        </div>
        <div className="flex justify-between text-xs mt-1.5">
          <span>🌱</span>
          <span>✨</span>
          <span>🔥</span>
          <span>👑</span>
        </div>
      </div>

      {/* ---------- Parcours citoyen ---------- */}
      <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gasra-text-secondary">{isAr ? "المسار المواطن في قصرة" : "Parcours citoyen Gasra"}</span>
          <span className="text-gasra-accent">{level.titleFrM}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-gasra-surface-subtle overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gasra-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((levelNumber - 1) / (journey.length - 1)) * 100 + (progress / 100) * (100 / (journey.length - 1))}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {journey.map((j) => {
            const Icon = j.icon;
            const state = j.n < levelNumber ? "done" : j.n === levelNumber ? "current" : "todo";
            return (
              <div key={j.n} className={`journey-step flex flex-col items-center gap-1 py-2.5 rounded-xl text-center ${state}`}>
                <Icon size={17} />
                <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">{j.fr}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-gasra-text-muted text-center">
          {next ? `${next.minPoints - points > 0 ? next.minPoints - points : 0} pts avant ${next.titleFrM} · multiplicateur ${level.multiplier}` : "Niveau maximum atteint"}
        </p>
      </div>

      {/* ---------- Actions ---------- */}
      {isOther ? (
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setFollowing((f) => !f)} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold ${following ? "bg-gasra-surface-subtle text-gasra-text" : "btn-gasra-primary"}`}>
            {following ? <Check size={16} /> : <UserPlus size={16} />} {following ? "Abonné" : "Suivre"}
          </button>
          <Link to="/messages" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gasra-surface-border bg-gasra-surface text-sm font-semibold text-gasra-text">
            <MessageCircle size={16} /> Message
          </Link>
          <button onClick={() => setCoffeeOpen(true)} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/15 text-amber-400 text-sm font-semibold">
            ☕ 9ahwa Tal3a
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link to="/profil/modifier" className="profile-action flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gasra-surface-border bg-gasra-surface text-sm font-semibold text-gasra-text">
              <Settings size={16} /> {isAr ? "تعديل" : "Modifier"}
            </Link>
            <Link to="/influenceur" className="profile-action flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gasra-accent/40 bg-gasra-accent/10 text-sm font-semibold text-gasra-accent">
              <Sparkles size={16} /> {isAr ? "فضاء المؤثر" : "Espace influenceur"}
            </Link>
            <Link to="/parametres" className="profile-action flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gasra-surface-border bg-gasra-surface text-sm font-semibold text-gasra-text">
              <LifeBuoy size={16} /> {isAr ? "المساعدة" : "Aide et support"}
            </Link>
            <button onClick={signOut} className="profile-logout flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10">
              <LogOut size={16} /> {isAr ? "خروج" : "Déconnexion"}
            </button>
          </div>

          <Link to={myShop ? "/boutique/gestion" : "/marketplace"} className="profile-action flex items-center gap-3 p-3.5 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
            <span className="w-10 h-10 rounded-xl bg-gasra-accent/12 flex items-center justify-center">
              <Store size={18} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-gasra-text">{isAr ? "إدارة متاجري" : "Gérer mes boutiques"}</span>
              <span className="block text-[11px] text-gasra-text-muted">{myShop ? myShop : isAr ? "لا يوجد متجر بعد" : "Aucune boutique — crée la tienne pour vendre"}</span>
            </span>
          </Link>
          <Link to="/abonnements" className="profile-action flex items-center gap-3 p-3.5 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
            <span className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center">
              <Crown size={18} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-gasra-text">{isAr ? "إدارة اشتراكي" : "Gérer mon abonnement"}</span>
              <span className="block text-[11px] text-gasra-text-muted">{user.plan === "influenceur" ? "Influenceur Certifié · 3 000 DA / mois" : user.plan === "premium" ? "Premium · 800 DA / mois" : "Plan Gratuit · découvre Premium"}</span>
            </span>
          </Link>

          {/* Parrainage */}
          <div className="gasra-card-glass rounded-3xl p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-gasra-text">
              <Gift size={18} /> {isAr ? "ادعُ أصدقاءك" : "Invite tes amis"}
            </div>
            <p className="text-sm text-gasra-text-secondary">
              Gagne <b className="text-gasra-accent">100 pts</b> pour chaque ami qui rejoint Gasra avec ton code !
            </p>
            <div className="flex gap-2">
              <div className="flex-1 py-3 rounded-2xl bg-gasra-surface-subtle text-center font-mono font-bold tracking-[0.2em] text-gasra-accent">{code}</div>
              <button onClick={copy} className="px-3.5 rounded-2xl border border-gasra-surface-border bg-gasra-surface" aria-label="Copier">
                {copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-gasra-text-muted">
                <Users size={13} /> {isNewUser ? 0 : 3} amis invités
              </span>
              <span className="font-semibold text-gasra-accent">+{isNewUser ? 0 : 300} pts gagnés</span>
            </div>
            <button
              onClick={() => (navigator as any).share?.({ title: "Gasra", text: `Rejoins-moi sur Gasra avec mon code ${code}` }) ?? copy()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl btn-gasra-primary text-sm"
            >
              <Share2 size={16} /> {isAr ? "شارك رابطي" : "Partager mon lien"}
            </button>
          </div>
        </>
      )}

      {/* ---------- Onglets ---------- */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
        {(["posts", "avis", "stats"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} className={`relative z-10 py-2 text-sm font-semibold transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
              {active && <motion.span layoutId="profile-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              {t === "posts" ? "Posts" : t === "avis" ? "Avis" : "Stats"}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-2.5">
          {tab === "posts" && posts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gasra-surface-border py-12 flex flex-col items-center gap-3 text-center">
              <Sparkles size={26} />
              <p className="text-sm text-gasra-text-secondary">{isAr ? "لم تنشر بعد" : "Tu n'as encore rien publié."}</p>
              <Link to="/creer" className="px-4 py-2 rounded-xl btn-gasra-primary text-sm">{isAr ? "انشر أول منشور" : "Créer ma première publication"}</Link>
            </div>
          )}
          {tab === "posts" &&
            posts.map((p) => (
              <Link key={p.id} to={`/post/${p.id}`} className="block p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface hover:bg-gasra-surface-subtle transition-colors">
                <div className="text-[11px] text-gasra-text-muted mb-1">
                  {p.currentWilaya} · {p.timeAgo}
                </div>
                <p className="text-sm text-gasra-text line-clamp-3">{isAr ? p.contentAr : p.contentFr}</p>
                <div className="flex gap-3 mt-2 text-[11px] text-gasra-text-muted">
                  <span>{p.commentsCount} commentaires</span>
                  <span>{p.sharesCount} partages</span>
                  {p.coffeeTipsDA > 0 && <span>☕ {p.coffeeTipsDA} DA</span>}
                </div>
              </Link>
            ))}

          {tab === "avis" && isNewUser && (
            <div className="rounded-3xl border border-dashed border-gasra-surface-border py-12 text-center text-sm text-gasra-text-muted">
              {isAr ? "لا توجد آراء بعد" : "Aucun avis pour l'instant. Note un commerce de ta houma !"}
            </div>
          )}
          {tab === "avis" &&
            !isNewUser &&
            REVIEWS.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gasra-text">{r.shop}</span>
                  <span className="text-amber-400 text-sm">{"★".repeat(r.rating)}<span className="text-gasra-text-muted">{"★".repeat(5 - r.rating)}</span></span>
                </div>
                <p className="text-sm text-gasra-text-secondary mt-1">{r.text}</p>
                <div className="text-[11px] text-gasra-text-muted mt-1.5">{r.date}</div>
              </div>
            ))}

          {tab === "stats" && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                  <div className="text-[11px] text-gasra-text-muted">Gains créateur</div>
                  <div className="font-mono font-bold text-lg text-emerald-400">+{isNewUser ? 0 : "12 000"} DA</div>
                  <div className="text-[11px] text-gasra-text-muted">{isNewUser ? "Promeus un bon pour gagner" : "186 scans de bons ce mois"}</div>
                </div>
                <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                  <div className="text-[11px] text-gasra-text-muted">{isAr ? "رصيد المحفظة" : "Solde portefeuille"}</div>
                  <div className="font-mono font-bold text-lg text-gasra-text">{user.walletBalanceDA.toLocaleString("fr-FR")} DA</div>
                  <div className="text-[11px] text-gasra-text-muted">Multiplicateur {level.multiplier}</div>
                </div>
              </div>

              {/* Réputation par wilaya (règle d'or Gasra) */}
              <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface space-y-2.5">
                <div className="font-bold text-sm text-gasra-text">{isAr ? "السمعة حسب الولاية" : "Réputation par wilaya"}</div>
                <p className="text-[11px] text-gasra-text-muted">
                  {isAr
                    ? "مكانتك تعيش في ولايتك. في السفر تصبح « براني » مع منحة +50%."
                    : "Ton statut vaut dans ta wilaya d'origine. En voyage, tu deviens « Berrani » et profites de la Prime du Berrani (+50 %)."}
                </p>
                {user.wilayaReputations.map((rep) => (
                  <div key={rep.wilayaCode} className="flex items-center gap-3 p-2.5 rounded-xl bg-gasra-surface-subtle">
                    <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${rep.isBerrani ? "bg-gasra-surface text-gasra-text-secondary" : "bg-gasra-accent/15 text-gasra-accent"}`}>{rep.wilayaCode}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-gasra-text">{rep.wilayaName}</span>
                      <span className="block text-[11px] text-gasra-text-muted">{isAr ? rep.levelTitleAr : rep.levelTitleFr}</span>
                    </span>
                    <span className="text-end">
                      {rep.primeBerraniActive && <span className="block text-[10px] font-bold text-[#FF8552]">Prime Berrani +50%</span>}
                      <span className="font-mono text-xs font-bold text-gasra-text">{rep.pointsInWilaya} pts</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {coffeeOpen && <CoffeeModal isOpen={coffeeOpen} onClose={() => setCoffeeOpen(false)} recipientName={name} postId="profile" />}
    </div>
  );
};
