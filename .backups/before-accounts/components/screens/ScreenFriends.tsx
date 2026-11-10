import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Users, Search, MessageCircle, UserPlus, UserCheck, Check, X, Clock, MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PEOPLE, Person } from "../../data/people";
import { useSocial, social } from "../../hooks/useSocial";
import { LevelBadge } from "../common/LevelBadge";
import { PersonAvatar } from "../common/PersonAvatar";

type Tab = "amis" | "demandes" | "decouvrir";

export const ScreenFriends: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const s = useSocial();
  const [tab, setTab] = useState<Tab>("amis");
  const [q, setQ] = useState("");

  const match = (p: Person) => !q.trim() || p.name.toLowerCase().includes(q.trim().toLowerCase()) || p.wilaya.toLowerCase().includes(q.trim().toLowerCase());
  const byId = (id: string) => PEOPLE.find((p) => p.id === id)!;
  const friends = s.friends.map(byId).filter(Boolean).filter(match);
  const incoming = s.incoming.map(byId).filter(Boolean).filter(match);
  const discover = PEOPLE.filter((p) => !s.friends.includes(p.id) && !s.incoming.includes(p.id)).filter(match).sort((a, b) => b.mutual - a.mutual);

  const tabs: { id: Tab; fr: string; ar: string; count?: number }[] = [
    { id: "amis", fr: "Amis", ar: "الأصدقاء", count: s.friends.length },
    { id: "demandes", fr: "Demandes", ar: "الطلبات", count: s.incoming.length },
    { id: "decouvrir", fr: "Découvrir", ar: "اكتشف" },
  ];

  const Empty = ({ text }: { text: string }) => (
    <div className="rounded-3xl border border-dashed border-gasra-surface-border py-14 flex flex-col items-center gap-3 text-center">
      <Users size={34} />
      <p className="text-sm text-gasra-text-secondary max-w-xs">{text}</p>
      {tab !== "decouvrir" && (
        <button onClick={() => setTab("decouvrir")} className="px-4 py-2 rounded-xl btn-gasra-primary text-sm">
          {isAr ? "اكتشف أشخاصاً" : "Découvrir des profils"}
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full p-3 sm:p-5 space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gasra-text tracking-tight flex items-center gap-2">
            <Users size={24} /> {isAr ? "أصدقائي" : "Mes amis"}
          </h1>
          <p className="text-sm text-gasra-text-muted mt-1">
            {isAr ? "أصدقاؤك، طلباتك وأشخاص جدد من حومتك." : "Retrouve tes amis, gère tes demandes et découvre des gens de ta houma."}
          </p>
        </div>
        <div className="relative sm:w-72">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gasra-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isAr ? "ابحث عن صديق..." : "Rechercher un ami ou un profil..."}
            className="w-full ps-9 pe-3 py-2.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30"
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="inline-grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border w-full sm:w-auto sm:min-w-[420px]">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-semibold transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
              {active && <motion.span layoutId="friends-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              {isAr ? t.ar : t.fr}
              {!!t.count && <span className={`text-[10px] font-bold px-1.5 rounded-full ${t.id === "demandes" ? "bg-red-500 text-white" : "bg-gasra-surface-subtle text-gasra-text-muted"}`}>{t.count}</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {/* ----- Amis ----- */}
          {tab === "amis" &&
            (friends.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {friends.map((p) => (
                  <div key={p.id} className="friend-card p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface flex items-center gap-3">
                    <PersonAvatar p={p} size={52} ring />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gasra-text truncate">{p.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <LevelBadge levelNumber={p.levelNumber} size="sm" />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gasra-text-muted mt-1">
                        <MapPin size={11} /> {p.wilaya} · {p.online ? (isAr ? "متصل" : "En ligne") : `${p.mutual} amis en commun`}
                      </div>
                    </div>
                    <Link to="/messages" className="shrink-0 p-2.5 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-accent/15 transition-colors" aria-label="Message">
                      <MessageCircle size={17} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text={isAr ? "ليس لديك أصدقاء بعد." : "Tu n'as pas encore d'amis. Découvre des profils de ta houma."} />
            ))}

          {/* ----- Demandes ----- */}
          {tab === "demandes" &&
            (incoming.length ? (
              <div className="space-y-2.5">
                {incoming.map((p) => (
                  <motion.div layout key={p.id} className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface flex items-center gap-3">
                    <PersonAvatar p={p} size={48} />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gasra-text truncate">{p.name}</div>
                      <div className="text-[11px] text-gasra-text-muted">
                        {p.wilaya} · {p.mutual} {isAr ? "أصدقاء مشتركين" : "amis en commun"}
                      </div>
                    </div>
                    <button onClick={() => social.accept(p.id)} className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl btn-gasra-primary text-xs">
                      <Check size={14} /> {isAr ? "قبول" : "Accepter"}
                    </button>
                    <button onClick={() => social.decline(p.id)} className="shrink-0 p-2 rounded-xl bg-gasra-surface-subtle hover:bg-red-500/15 transition-colors" aria-label="Refuser">
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Empty text={isAr ? "لا توجد طلبات جديدة." : "Aucune demande en attente."} />
            ))}

          {/* ----- Découvrir ----- */}
          {tab === "decouvrir" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {discover.map((p, i) => {
                const sent = s.sent.includes(p.id);
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="friend-card p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface flex flex-col items-center text-center gap-2">
                    <PersonAvatar p={p} size={64} />
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-sm text-gasra-text truncate">{p.name}</div>
                      <div className="text-[11px] text-gasra-text-muted truncate">{p.bio}</div>
                      <div className="text-[11px] text-gasra-text-muted mt-0.5">
                        {p.wilaya} · {p.mutual} en commun
                      </div>
                    </div>
                    <button
                      onClick={() => (sent ? social.cancelRequest(p.id) : social.sendRequest(p.id))}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${sent ? "bg-gasra-surface-subtle text-gasra-text-secondary" : "btn-gasra-primary"}`}
                    >
                      {sent ? <Clock size={14} /> : <UserPlus size={14} />}
                      {sent ? (isAr ? "تم الإرسال" : "Demande envoyée") : isAr ? "إضافة" : "Ajouter"}
                    </button>
                    <Link to="/messages" className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gasra-surface-subtle text-xs font-semibold text-gasra-text hover:bg-gasra-accent/12 transition-colors">
                      <MessageCircle size={14} /> Message
                    </Link>
                  </motion.div>
                );
              })}
              {discover.length === 0 && (
                <div className="col-span-full text-center py-12 text-sm text-gasra-text-muted flex flex-col items-center gap-2">
                  <UserCheck size={28} /> {isAr ? "أنت صديق للجميع !" : "Tu connais déjà tout le monde !"}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
