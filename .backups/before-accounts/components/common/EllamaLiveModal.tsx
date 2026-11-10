import React, { useEffect, useState } from "react";
import { X, Radio, Users, Mic, MicOff, Video, VideoOff, Heart, Send } from "lucide-react";
import { useApp } from "../../context/AppContext";

/** Démo du live "ELLAMA" (maquette, aucun flux réel). */
export const EllamaLiveModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const isAr = language === "ar";
  const [live, setLive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!isOpen) { setLive(false); setSeconds(0); setViewers(0); }
  }, [isOpen]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      setSeconds((s) => s + 1);
      setViewers((v) => Math.min(v + Math.floor(Math.random() * 4), 312));
    }, 1000);
    return () => clearInterval(t);
  }, [live]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const comments = [
    { n: "Ines", t: "Salam la Houma 👋" },
    { n: "Samy", t: "Wach rakoum ?" },
    { n: "Leïla", t: "On est là depuis Oran !" },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md gasra-card-glass rounded-3xl shadow-2xl">
        <div className="p-4 space-y-3 max-h-[92vh] overflow-y-auto">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="ellama-wordmark text-lg font-black tracking-[0.18em]">ELLAMA</span>
              {live && (
                <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE {mm}:{ss}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Fermer">
              <X size={18} />
            </button>
          </div>

          {/* Écran vidéo (maquette) */}
          <div className="relative h-[42vh] max-h-[380px] min-h-[220px] rounded-2xl overflow-hidden ellama-stage">
            {cam ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full story-ring-animated p-[3px]">
                  <div className="w-full h-full rounded-full bg-black/40 flex items-center justify-center text-2xl font-black text-white">AR</div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/70 text-xs font-bold">
                {isAr ? "الكاميرا مطفأة" : "Caméra coupée"}
              </div>
            )}

            {live && (
              <>
                <div className="absolute top-2 end-2 flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-black/45 text-white">
                  <Users size={12} /> {viewers}
                </div>
                <div className="absolute bottom-2 start-2 end-12 space-y-1">
                  {comments.slice(0, Math.min(3, Math.floor(seconds / 2))).map((c) => (
                    <div key={c.n} className="text-[11px] text-white bg-black/40 rounded-xl px-2 py-1 w-fit">
                      <b>{c.n}</b> {c.t}
                    </div>
                  ))}
                </div>
                <Heart size={22} className="absolute bottom-3 end-3 text-pink-400 animate-bounce" />
              </>
            )}
          </div>

          {!live && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? "عنوان اللمة..." : "Titre de ton Ellama (ex. Soirée foot à la Houma)"}
              className="w-full px-3 py-2 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none"
            />
          )}

          {/* Contrôles */}
          <div className="flex items-center gap-2">
            <button onClick={() => setMic(!mic)} className="p-2.5 rounded-2xl btn-gasra-secondary" aria-label="Micro">
              {mic ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button onClick={() => setCam(!cam)} className="p-2.5 rounded-2xl btn-gasra-secondary" aria-label="Caméra">
              {cam ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            {live ? (
              <button onClick={() => setLive(false)} className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-black transition-colors">
                {isAr ? "إنهاء اللمة" : "Terminer l'Ellama"}
              </button>
            ) : (
              <button onClick={() => setLive(true)} className="flex-1 py-2.5 rounded-2xl ellama-cta text-white text-sm font-black flex items-center justify-center gap-2">
                <Radio size={16} /> {isAr ? "ابدأ اللمة" : "Lancer l'Ellama"}
              </button>
            )}
            {live && (
              <button className="p-2.5 rounded-2xl btn-gasra-secondary" aria-label="Partager">
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
