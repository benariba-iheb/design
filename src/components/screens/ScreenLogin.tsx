import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, LogIn, UserPlus, Sparkles, Store, Coins, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { PlaystationMirageCanvas } from "../common/PlaystationMirageCanvas";
import { GasraLogo } from "../common/GasraLogo";
import { CelestialThemeToggle } from "../common/CelestialThemeToggle";
import { DEMO_ACCOUNTS, login, signup, resetDemo } from "../../data/accounts";

/** Page d'arrivée : connexion / inscription (comptes de démo fictifs). */
export const ScreenLogin: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const go = () => {
    setLoading(true);
    setTimeout(() => (window.location.href = "/"), 450);
  };

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) return setError("Saisis ton identifiant et ton mot de passe.");
    if (!login(identifier, password)) return setError("Identifiant ou mot de passe incorrect.");
    go();
  };

  const onSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Indique ton nom.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Adresse e-mail invalide.");
    if (password.length < 6) return setError("Le mot de passe doit faire au moins 6 caractères.");
    const r = signup(name, email, password);
    if ("error" in r) return setError(r.error);
    go();
  };

  const fill = (i: number) => {
    const a = DEMO_ACCOUNTS[i];
    setMode("login");
    setIdentifier(a.login);
    setPassword(a.password);
    setError(null);
  };

  const field =
    "w-full px-4 py-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30";

  return (
    <div className="relative min-h-screen flex flex-col text-gasra-text">
      <PlaystationMirageCanvas />
      <header className="flex items-center justify-between px-5 sm:px-8 py-4">
        <GasraLogo size="md" />
        <CelestialThemeToggle />
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        {/* Présentation */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hidden lg:block space-y-6">
          <h1 className="text-5xl font-black tracking-tight leading-[1.05]">
            De ton quartier,
            <br />
            <span className="login-gradient-text">à ton pays.</span>
          </h1>
          <p className="text-lg text-gasra-text-secondary max-w-md">Le réseau social local qui fait gagner les gens de la houma : bons plans, missions, boutiques et lives.</p>
          <div className="space-y-3">
            {[
              { icon: Coins, t: "Gagne des dinars en partageant les bons plans de ton quartier" },
              { icon: Store, t: "Ouvre ta boutique en ligne et vends partout en Algérie" },
              { icon: MapPin, t: "Découvre ce qui se passe autour de toi en temps réel" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-3 text-sm text-gasra-text-secondary">
                <span className="w-9 h-9 shrink-0 rounded-xl bg-gasra-accent/12 flex items-center justify-center">
                  <Icon size={17} />
                </span>
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-md mx-auto">
          <div className="gasra-card-glass rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="lg:hidden text-center space-y-1">
              <h1 className="text-3xl font-black tracking-tight">
                De ton quartier, <span className="login-gradient-text">à ton pays.</span>
              </h1>
            </div>
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={`relative z-10 py-2 text-sm font-semibold transition-colors ${mode === m ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}
                >
                  {mode === m && <motion.span layoutId="login-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                  {m === "login" ? "Connexion" : "Créer un compte"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={mode === "login" ? onLogin : onSignup}
                className="space-y-3"
              >
                <div>
                  <h2 className="text-xl font-bold">{mode === "login" ? "Content de te revoir 👋" : "Bienvenue sur Gasra ✨"}</h2>
                  <p className="text-sm text-gasra-text-muted">{mode === "login" ? "Connecte-toi à ton compte" : "Crée ton compte en 30 secondes"}</p>
                </div>

                {mode === "signup" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom et nom" className={field} autoComplete="name" />}
                {mode === "login" ? (
                  <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Identifiant ou e-mail" className={field} autoComplete="username" />
                ) : (
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse e-mail" className={field} autoComplete="email" />
                )}
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className={`${field} pe-11`}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute end-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gasra-surface-subtle" aria-label={show ? "Masquer" : "Afficher"}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl btn-gasra-primary text-sm disabled:opacity-60">
                  {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {loading ? "Connexion…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
                </button>
                {mode === "login" && <p className="text-center text-xs text-gasra-text-muted">Mot de passe oublié ? Contacte le support Gasra.</p>}
              </motion.form>
            </AnimatePresence>

            {/* Comptes de démonstration */}
            <div className="pt-4 border-t border-gasra-surface-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gasra-text-secondary">
                <Sparkles size={13} /> Comptes de démonstration
              </div>
              {[
                { i: 0, title: "Amine — Influenceur certifié", sub: "Boutique, amis, gains, missions", icon: ShieldCheck },
                { i: 1, title: "Yasmine — Nouvelle inscrite", sub: "Compte vide, découverte de Gasra", icon: UserPlus },
              ].map(({ i, title, sub, icon: Icon }) => (
                <button key={i} type="button" onClick={() => fill(i)} className="login-demo w-full text-start flex items-center gap-3 p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                  <span className="w-9 h-9 shrink-0 rounded-xl bg-gasra-accent/12 flex items-center justify-center">
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-gasra-text">{title}</span>
                    <span className="block text-[11px] text-gasra-text-muted">{sub}</span>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  resetDemo();
                  window.location.reload();
                }}
                className="w-full text-center text-[11px] text-gasra-text-muted hover:text-gasra-text pt-1"
              >
                Réinitialiser la démo (remet les comptes à zéro)
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
