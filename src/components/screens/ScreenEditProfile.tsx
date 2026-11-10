import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Camera, CheckCircle2, Link2, Check, Instagram, Facebook, Youtube, Music2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

const INTERESTS = [
  { k: "Food", e: "🍕" },
  { k: "Cafés", e: "☕" },
  { k: "Mode", e: "👗" },
  { k: "Tech", e: "💻" },
  { k: "Sport", e: "⚽" },
  { k: "Nightlife", e: "🌙" },
  { k: "Bons plans", e: "💰" },
  { k: "Beauté", e: "💄" },
  { k: "Culture", e: "🎭" },
  { k: "Immobilier", e: "🏠" },
  { k: "Auto", e: "🚗" },
  { k: "Santé", e: "💊" },
];
const SOCIALS = [
  { k: "instagram", name: "Instagram", icon: Instagram, color: "#E1306C" },
  { k: "tiktok", name: "TikTok", icon: Music2, color: "#25F4EE" },
  { k: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2" },
  { k: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000" },
];

export const ScreenEditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useApp();
  const [form, setForm] = useState({
    name: user.name,
    handle: user.handle || "",
    bio: user.bio || "",
    city: user.originWilayaName,
    phone: user.phone || "",
    interests: user.interests || [],
    socials: user.socials || {},
  });
  const [saved, setSaved] = useState(false);

  const toggleInterest = (k: string) => setForm((f) => ({ ...f, interests: f.interests.includes(k) ? f.interests.filter((x) => x !== k) : [...f.interests, k] }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = form.name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    updateUser({
      name: form.name.trim() || user.name,
      avatarInitials: initials || user.avatarInitials,
      handle: form.handle.trim().replace(/^@/, ""),
      bio: form.bio,
      originWilayaName: form.city,
      phone: form.phone,
      interests: form.interests,
      socials: form.socials,
      isNew: user.isNew && !(form.bio && form.interests.length) ? true : false,
    });
    setSaved(true);
    setTimeout(() => navigate("/profil"), 900);
  };

  const field = "w-full px-4 py-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30";
  const label = "block text-sm font-bold text-gasra-text mb-1.5";

  return (
    <form onSubmit={save} className="w-full max-w-2xl mx-auto p-3 sm:p-5 space-y-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Retour">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-black text-gasra-text tracking-tight">Modifier le profil</h1>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="relative">
          <span className="story-ring-animated p-[3px] rounded-full inline-flex">
            <span className="profile-avatar w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black">{user.avatarInitials}</span>
          </span>
          <button type="button" className="absolute bottom-0 end-0 w-9 h-9 rounded-full btn-gasra-primary flex items-center justify-center" aria-label="Changer la photo">
            <Camera size={16} />
          </button>
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-gasra-accent">
          <CheckCircle2 size={14} /> E-mail confirmé · {user.email || "—"}
        </span>
      </div>

      <div>
        <label className={label}>Nom</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
      </div>
      <div>
        <label className={label}>Pseudo</label>
        <input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} className={field} placeholder="ton.pseudo" />
      </div>
      <div>
        <label className={label}>Bio</label>
        <textarea value={form.bio} maxLength={160} rows={3} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${field} resize-none`} placeholder="Parle de toi..." />
        <div className="text-end text-[11px] text-gasra-text-muted">{form.bio.length}/160</div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Ville</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label}>Téléphone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} placeholder="05 xx xx xx xx" inputMode="tel" />
        </div>
      </div>

      <div>
        <label className={label}>Centres d'intérêt</label>
        <p className="text-xs text-gasra-text-muted mb-2">Choisis tes centres d'intérêt pour personnaliser ton fil</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const on = form.interests.includes(i.k);
            return (
              <motion.button
                type="button"
                key={i.k}
                whileTap={{ scale: 0.92 }}
                onClick={() => toggleInterest(i.k)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${on ? "bg-gasra-accent text-gasra-on-accent" : "bg-gasra-surface text-gasra-text-secondary border border-gasra-surface-border"}`}
              >
                {i.e} {i.k}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <label className={label}>Réseaux sociaux</label>
        <p className="text-xs text-gasra-text-muted mb-2">Connecte tes réseaux pour augmenter ton score d'influence</p>
        <div className="space-y-2">
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            const on = !!form.socials[s.k];
            return (
              <div key={s.k} className="flex items-center gap-3 p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                <span className="social-icon w-10 h-10 rounded-xl flex items-center justify-center" style={{ ["--sc" as any]: s.color }}>
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold text-gasra-text">{s.name}</span>
                <button type="button" onClick={() => setForm({ ...form, socials: { ...form.socials, [s.k]: !on } })} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${on ? "bg-emerald-500/15 text-emerald-400" : "border border-gasra-surface-border bg-gasra-surface text-gasra-text"}`}>
                  {on ? <Check size={14} /> : <Link2 size={14} />} {on ? "Connecté" : "Connecter"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-24 lg:bottom-28 z-10">
        <button type="submit" className="w-full py-3.5 rounded-2xl btn-gasra-primary text-sm shadow-xl flex items-center justify-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                <CheckCircle2 size={16} /> Enregistré
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                Enregistrer les modifications
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </form>
  );
};
