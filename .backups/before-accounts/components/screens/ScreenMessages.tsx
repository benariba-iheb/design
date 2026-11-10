import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, ArrowLeft, CheckCheck, Phone, Search, SquarePen, Sparkles, UserPlus, Clock, Users, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_CONVERSATIONS, Conversation } from "../../data/mockData";
import { PEOPLE } from "../../data/people";
import { useSocial, social } from "../../hooks/useSocial";
import { PersonAvatar } from "../common/PersonAvatar";

type Box = "principal" | "demandes" | "groupes";
type Conv = Conversation & { box: Box };

const EXTRA: Conv[] = [
  {
    id: "conv-req-1",
    participantId: "p-yacine",
    participantName: "Yacine Ferhat",
    participantRole: "Blida · Jar",
    participantAvatar: "YF",
    lastMessage: "Salam, tu vends toujours le casque ?",
    lastMessageTime: "09:12",
    unreadCount: 1,
    box: "demandes",
    messages: [{ id: "r1", senderId: "p-yacine", text: "Salam, tu vends toujours le casque ?", time: "09:12", isMine: false }],
  },
  {
    id: "conv-grp-1",
    participantId: "grp-houma",
    participantName: "Houma Bab Ezzouar",
    participantRole: "Groupe · 128 membres",
    participantAvatar: "HB",
    lastMessage: "Ines : Le match de vendredi est décalé à 17h ⚽",
    lastMessageTime: "Hier",
    unreadCount: 3,
    box: "groupes",
    messages: [
      { id: "g1", senderId: "p-samy", text: "Qui vient au match vendredi ?", time: "Hier 18:02", isMine: false },
      { id: "g2", senderId: "p-ines", text: "Le match de vendredi est décalé à 17h ⚽", time: "Hier 19:40", isMine: false },
    ],
  },
];

const QUICK_REPLIES = ["Saha 👍", "Rani jay !", "C'est noté, merci", "On se voit au café ?"];

export const ScreenMessages: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { language } = useApp();
  const isAr = language === "ar";
  const social$ = useSocial();

  const [convs, setConvs] = useState<Conv[]>(() => [...MOCK_CONVERSATIONS.map((c) => ({ ...c, box: "principal" as Box })), ...EXTRA]);
  const [box, setBox] = useState<Box>("principal");
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(id || null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = convs.find((c) => c.id === activeId) || null;
  const list = convs.filter((c) => c.box === box && (!q.trim() || c.participantName.toLowerCase().includes(q.trim().toLowerCase())));
  const unread = (b: Box) => convs.filter((c) => c.box === b).reduce((n, c) => n + c.unreadCount, 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [active?.messages.length, typing]);

  const open = (cid: string) => {
    setActiveId(cid);
    setConvs((cs) => cs.map((c) => (c.id === cid ? { ...c, unreadCount: 0 } : c)));
  };

  const send = (text: string) => {
    if (!active || !text.trim()) return;
    const msg = { id: `m-${Date.now()}`, senderId: "me", text: text.trim(), time: "À l'instant", isMine: true };
    const cid = active.id;
    setConvs((cs) => cs.map((c) => (c.id === cid ? { ...c, box: c.box === "demandes" ? "principal" : c.box, lastMessage: msg.text, lastMessageTime: "À l'instant", messages: [...c.messages, msg] } : c)));
    setInput("");
    // petite réponse simulée pour la démo
    setTimeout(() => setTyping(true), 600);
    setTimeout(() => {
      setTyping(false);
      const reply = { id: `r-${Date.now()}`, senderId: "them", text: "Saha khoya, je te tiens au courant 👍", time: "À l'instant", isMine: false };
      setConvs((cs) => cs.map((c) => (c.id === cid ? { ...c, lastMessage: reply.text, messages: [...c.messages, reply] } : c)));
    }, 2200);
  };

  const startWith = (pid: string) => {
    const p = PEOPLE.find((x) => x.id === pid)!;
    const existing = convs.find((c) => c.participantId === pid);
    if (existing) return open(existing.id);
    const conv: Conv = { id: `conv-${pid}`, participantId: pid, participantName: p.name, participantRole: `${p.wilaya}`, participantAvatar: p.initials, lastMessage: "", lastMessageTime: "", unreadCount: 0, box: "principal", messages: [] };
    setConvs((cs) => [conv, ...cs]);
    setBox("principal");
    setActiveId(conv.id);
  };

  const suggestions = PEOPLE.filter((p) => !social$.friends.includes(p.id)).slice(0, 6);
  const personFor = (c: Conv) => PEOPLE.find((p) => p.id === c.participantId);

  const Avatar = ({ c, size = 44 }: { c: Conv; size?: number }) => {
    const p = personFor(c);
    if (p) return <PersonAvatar p={p} size={size} />;
    return (
      <span className="shrink-0 rounded-full flex items-center justify-center font-bold text-xs msg-avatar" style={{ width: size, height: size }}>
        {c.box === "groupes" ? <Users size={size * 0.4} /> : c.participantAvatar}
      </span>
    );
  };

  return (
    <div className="w-full p-3 sm:p-5">
      <div className="gasra-card-glass rounded-3xl overflow-hidden grid lg:grid-cols-[360px_minmax(0,1fr)] min-h-[calc(100vh-11rem)]">
        {/* ---------------- Colonne gauche ---------------- */}
        <aside className={`${active ? "hidden lg:flex" : "flex"} flex-col border-e border-gasra-surface-border min-w-0`}>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-gasra-text tracking-tight">Messages</h1>
              <button className="p-2 rounded-xl hover:bg-gasra-surface-subtle transition-colors" aria-label="Nouvelle conversation" onClick={() => setBox("principal")}>
                <SquarePen size={18} />
              </button>
            </div>
            <div className="relative">
              <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gasra-text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isAr ? "ابحث عن محادثة..." : "Rechercher une conversation..."} className="w-full ps-9 pe-3 py-2.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30" />
            </div>
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
              {(["principal", "demandes", "groupes"] as Box[]).map((b) => {
                const activeB = box === b;
                const n = unread(b);
                return (
                  <button key={b} onClick={() => setBox(b)} className={`relative z-10 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold transition-colors ${activeB ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
                    {activeB && <motion.span layoutId="msg-box" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                    {b === "principal" ? (isAr ? "الرئيسية" : "Principal") : b === "demandes" ? (isAr ? "الطلبات" : "Demandes") : isAr ? "المجموعات" : "Groupes"}
                    {n > 0 && <span className="min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{n}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {list.length ? (
              list.map((c) => {
                const sel = c.id === activeId;
                return (
                  <button key={c.id} onClick={() => open(c.id)} className={`msg-row w-full text-start flex items-center gap-3 p-3 rounded-2xl transition-colors ${sel ? "is-active" : ""}`}>
                    <Avatar c={c} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${c.unreadCount ? "font-bold text-gasra-text" : "font-semibold text-gasra-text"}`}>{c.participantName}</span>
                        <span className="shrink-0 text-[10px] text-gasra-text-muted">{c.lastMessageTime}</span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`truncate text-xs ${c.unreadCount ? "text-gasra-text" : "text-gasra-text-muted"}`}>{c.lastMessage || (isAr ? "محادثة جديدة" : "Nouvelle conversation")}</span>
                        {c.unreadCount > 0 && <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-gasra-accent text-gasra-on-accent text-[10px] font-bold flex items-center justify-center">{c.unreadCount}</span>}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-10 flex flex-col items-center gap-2 text-center">
                <MessageCircle size={32} />
                <span className="text-sm text-gasra-text-muted">{isAr ? "لا توجد رسائل" : "Aucun message"}</span>
              </div>
            )}

            {/* Suggestions */}
            {box === "principal" && suggestions.length > 0 && (
              <div className="mt-3 px-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gasra-text mb-2">
                  <Sparkles size={13} /> {isAr ? "أشخاص قد تعرفهم" : "Personnes que tu pourrais connaître"}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {suggestions.map((p) => {
                    const sent = social$.sent.includes(p.id);
                    return (
                      <div key={p.id} className="shrink-0 w-36 p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface flex flex-col items-center text-center gap-1.5">
                        <PersonAvatar p={p} size={44} />
                        <span className="w-full truncate text-xs font-bold text-gasra-text">{p.name}</span>
                        <span className="text-[10px] text-gasra-text-muted -mt-1">{p.mutual} en commun</span>
                        <button onClick={() => (sent ? social.cancelRequest(p.id) : social.sendRequest(p.id))} className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold ${sent ? "bg-gasra-surface-subtle text-gasra-text-secondary" : "btn-gasra-primary"}`}>
                          {sent ? <Clock size={12} /> : <UserPlus size={12} />} {sent ? "Envoyée" : "Ajouter"}
                        </button>
                        <button onClick={() => startWith(p.id)} className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gasra-surface-subtle text-[11px] font-semibold text-gasra-text">
                          <MessageCircle size={12} /> Message
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ---------------- Colonne droite ---------------- */}
        <section className={`${active ? "flex" : "hidden lg:flex"} flex-col min-w-0`}>
          {active ? (
            <>
              <header className="flex items-center gap-3 p-4 border-b border-gasra-surface-border">
                <button onClick={() => setActiveId(null)} className="lg:hidden p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Retour">
                  <ArrowLeft size={18} />
                </button>
                <Avatar c={active} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-gasra-text truncate">{active.participantName}</div>
                  <div className="text-[11px] text-gasra-text-muted truncate">{typing ? (isAr ? "يكتب..." : "écrit...") : active.participantRole}</div>
                </div>
                <button className="p-2 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Appeler">
                  <Phone size={17} />
                </button>
              </header>

              {active.box === "demandes" && (
                <div className="mx-4 mt-3 p-3 rounded-2xl bg-gasra-surface-subtle text-xs text-gasra-text-secondary flex items-center gap-2">
                  <ShieldCheck size={15} /> {isAr ? "شخص لا تعرفه. ردّك ينقل المحادثة إلى الرئيسية." : "Cette personne ne fait pas partie de tes amis. Répondre déplace la conversation dans Principal."}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                <AnimatePresence initial={false}>
                  {active.messages.map((m) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex flex-col ${m.isMine ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.isMine ? "msg-mine rounded-br-md" : "msg-theirs rounded-bl-md"}`}>{m.text}</div>
                      <span className="text-[10px] text-gasra-text-muted mt-1 px-1 flex items-center gap-1">
                        {m.time}
                        {m.isMine && <CheckCheck size={12} />}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {active.messages.length === 0 && (
                  <p className="text-center text-xs text-gasra-text-muted py-10">{isAr ? "قل سلام 👋" : "Dis salam 👋"}</p>
                )}
                {typing && (
                  <div className="flex">
                    <div className="msg-theirs rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gasra-text-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
                {QUICK_REPLIES.map((r) => (
                  <button key={r} onClick={() => send(r)} className="shrink-0 px-3 py-1.5 rounded-full bg-gasra-surface-subtle text-xs text-gasra-text-secondary hover:text-gasra-text transition-colors">
                    {r}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 p-4 pt-2"
              >
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={isAr ? "اكتب رسالة..." : "Écrire un message..."} className="flex-1 px-4 py-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30" />
                <button type="submit" disabled={!input.trim()} className="p-3 rounded-2xl btn-gasra-primary disabled:opacity-40 transition-opacity" aria-label="Envoyer">
                  <Send size={17} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-8">
              <span className="w-14 h-14 rounded-2xl bg-gasra-accent/12 flex items-center justify-center">
                <MessageCircle size={26} />
              </span>
              <h2 className="text-lg font-bold text-gasra-text">{isAr ? "محادثاتك" : "Tes conversations"}</h2>
              <p className="text-sm text-gasra-text-muted max-w-xs">
                {isAr ? "اختر محادثة على اليسار أو ابدأ واحدة جديدة." : "Sélectionne une conversation à gauche, ou démarre-en une nouvelle avec un voisin ou un commerce."}
              </p>
              <button onClick={() => suggestions[0] && startWith(suggestions[0].id)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-gasra-primary text-sm">
                <Users size={16} /> {isAr ? "محادثة جديدة" : "Nouvelle conversation"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
