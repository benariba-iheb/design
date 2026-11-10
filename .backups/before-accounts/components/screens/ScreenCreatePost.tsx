import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Camera,
  Video,
  Clock,
  Star,
  Flame,
  HelpCircle,
  BarChart3,
  FileText,
  Radio,
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Plus,
  X,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_DEALS } from "../../data/mockData";
import { EllamaLiveModal } from "../common/EllamaLiveModal";

type PostKind = "photo" | "video" | "story" | "avis" | "bonplan" | "question" | "sondage" | "article";

const KINDS: {
  id: PostKind;
  fr: string;
  ar: string;
  subFr: string;
  subAr: string;
  icon: React.ComponentType<{ size?: number }>;
  from: string;
  to: string;
}[] = [
  { id: "photo", fr: "Photo", ar: "صورة", subFr: "Photo ou carrousel", subAr: "صورة أو ألبوم", icon: Camera, from: "#0EA5FF", to: "#00C8FF" },
  { id: "video", fr: "Vidéo", ar: "فيديو", subFr: "Partagez un moment", subAr: "شارك لحظة", icon: Video, from: "#FF3D6E", to: "#F0207A" },
  { id: "story", fr: "Story", ar: "ستوري", subFr: "Éphémère 24h", subAr: "مؤقتة 24 ساعة", icon: Clock, from: "#A855F7", to: "#D946EF" },
  { id: "avis", fr: "Avis", ar: "رأي", subFr: "Notez un commerce", subAr: "قيّم محلاً", icon: Star, from: "#FFB020", to: "#FF7A00" },
  { id: "bonplan", fr: "Bon Plan", ar: "بون", subFr: "Partagez une offre", subAr: "شارك عرضاً", icon: Flame, from: "#22C55E", to: "#10B981" },
  { id: "question", fr: "Question", ar: "سؤال", subFr: "Demandez à la communauté", subAr: "اسأل أهل الحومة", icon: HelpCircle, from: "#3B82F6", to: "#6366F1" },
  { id: "sondage", fr: "Sondage", ar: "استطلاع", subFr: "2 à 4 options", subAr: "من 2 إلى 4 خيارات", icon: BarChart3, from: "#14B8A6", to: "#06B6D4" },
  { id: "article", fr: "Article", ar: "مقال", subFr: "Contenu long", subAr: "محتوى طويل", icon: FileText, from: "#6B7280", to: "#9CA3AF" },
];

const Tile: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number }>;
  from: string;
  to: string;
  onClick: () => void;
  index: number;
  wide?: boolean;
  live?: boolean;
}> = ({ title, subtitle, icon: Icon, from, to, onClick, index, wide, live }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.3 }}
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.97 }}
    className={`create-tile group text-start flex ${wide ? "col-span-2 flex-row items-center gap-4" : "flex-col gap-3"} p-4 sm:p-5 rounded-2xl border border-gasra-surface-border bg-gasra-surface`}
  >
    <span
      className="create-tile-icon relative shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 6px 18px ${from}40` }}
    >
      <Icon size={20} />
      {live && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white animate-pulse" />}
    </span>
    <span className="min-w-0">
      <span className={`block font-bold text-gasra-text ${live ? "tracking-[0.16em]" : ""}`}>{title}</span>
      <span className="block text-xs text-gasra-text-muted mt-0.5">{subtitle}</span>
    </span>
    {wide && <ArrowRight size={18} className="ms-auto text-gasra-text-muted" />}
  </motion.button>
);

export const ScreenCreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { language, currentQuartier } = useApp();
  const isAr = language === "ar";

  const [kind, setKind] = useState<PostKind | null>(null);
  const [ellamaOpen, setEllamaOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Champs
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [business, setBusiness] = useState(MOCK_DEALS[0].businessName);
  const [selectedDealId, setSelectedDealId] = useState(MOCK_DEALS[0].id);
  const [dealScansEstimate, setDealScansEstimate] = useState(15);
  const [options, setOptions] = useState<string[]>(["", ""]);

  const selectedDeal = MOCK_DEALS.find((d) => d.id === selectedDealId) || MOCK_DEALS[0];
  const estimatedCommission = selectedDeal.creatorCommissionDA * dealScansEstimate;
  const meta = KINDS.find((k) => k.id === kind);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => navigate("/"), 1500);
  };

  const fieldCls =
    "w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30";

  const MediaZone = ({ label, hint }: { label: string; hint: string }) => (
    <div className="p-6 rounded-2xl border-2 border-dashed border-gasra-surface-border bg-gasra-surface flex flex-col items-center justify-center text-center gap-1">
      <ImagePlus size={26} />
      <span className="text-sm font-semibold text-gasra-text">{label}</span>
      <span className="text-[11px] text-gasra-text-muted">{hint}</span>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-5 text-gasra-text">
      <AnimatePresence mode="wait">
        {/* ---------------- Étape 1 : choisir le type ---------------- */}
        {!kind && (
          <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{isAr ? "إنشاء محتوى" : "Créer du contenu"}</h1>
              <p className="flex items-center gap-1 text-xs text-gasra-text-muted mt-1">
                <MapPin size={12} />
                {currentQuartier}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Tile
                wide
                live
                index={0}
                title="ELLAMA"
                subtitle={isAr ? "ابدأ بثاً مباشراً" : "Lancer un live"}
                icon={Radio}
                from="#FF3D6E"
                to="#5E47D1"
                onClick={() => setEllamaOpen(true)}
              />
              {KINDS.map((k, i) => (
                <Tile
                  key={k.id}
                  index={i + 1}
                  title={isAr ? k.ar : k.fr}
                  subtitle={isAr ? k.subAr : k.subFr}
                  icon={k.icon}
                  from={k.from}
                  to={k.to}
                  onClick={() => setKind(k.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------------- Étape 2 : composer ---------------- */}
        {kind && meta && (
          <motion.div key="compose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setKind(null);
                  setIsSuccess(false);
                }}
                className="p-2 rounded-xl bg-gasra-surface hover:bg-gasra-surface-subtle transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft size={18} />
              </button>
              <span
                className="create-tile-icon w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}
              >
                <meta.icon size={18} />
              </span>
              <div>
                <h1 className="text-lg font-bold leading-tight">{isAr ? meta.ar : meta.fr}</h1>
                <p className="text-[11px] text-gasra-text-muted">{isAr ? meta.subAr : meta.subFr}</p>
              </div>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="gasra-card-glass rounded-3xl p-8 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 size={34} />
                </div>
                <h3 className="text-lg font-bold mb-1">{isAr ? "تم النشر !" : "Publication mise en ligne !"}</h3>
                <p className="text-xs text-gasra-text-secondary">
                  {isAr ? "منشورك مرئي لجيرانك الآن." : "Visible immédiatement par tes voisins."}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handlePublish} className="gasra-card-glass rounded-3xl p-4 sm:p-5 space-y-4">
                {(kind === "photo" || kind === "video" || kind === "story") && (
                  <MediaZone
                    label={
                      kind === "photo"
                        ? isAr ? "أضف صورة أو عدة صور" : "Ajouter une ou plusieurs photos"
                        : kind === "video"
                        ? isAr ? "أضف فيديو" : "Ajouter une vidéo"
                        : isAr ? "أضف صورة أو فيديو قصير" : "Ajouter une photo ou une courte vidéo"
                    }
                    hint={kind === "story" ? (isAr ? "تختفي بعد 24 ساعة" : "Disparaît après 24 h · format vertical") : isAr ? "من الهاتف أو الكاميرا" : "Depuis ta galerie ou ta caméra"}
                  />
                )}

                {kind === "avis" && (
                  <div className="space-y-3">
                    <select value={business} onChange={(e) => setBusiness(e.target.value)} className={fieldCls}>
                      {MOCK_DEALS.map((d) => (
                        <option key={d.id} value={d.businessName}>
                          {d.businessName}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{isAr ? "تقييمك" : "Ta note"}</span>
                      <div className="flex gap-1 text-amber-400 text-2xl">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button type="button" key={s} onClick={() => setRating(s)} className="hover:scale-110 transition-transform">
                            {s <= rating ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-400/10 text-xs text-amber-300 flex items-center justify-between">
                      <span>{isAr ? "رتبتك : ولد الحومة" : "Pondération : Weld el Houma (Niveau 2)"}</span>
                      <span className="font-mono font-bold">+85 pts (~125 DA)</span>
                    </div>
                  </div>
                )}

                {kind === "bonplan" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold block">{isAr ? "اختر البون" : "Sélectionner un bon du quartier"}</label>
                    <select value={selectedDealId} onChange={(e) => setSelectedDealId(e.target.value)} className={fieldCls}>
                      {MOCK_DEALS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.businessName} — {d.titleFr} ({d.discount} · {d.creatorCommissionDA} DA/scan)
                        </option>
                      ))}
                    </select>

                    {/* Simulateur de gains créateur */}
                    <div className="gains-sim p-4 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{isAr ? "محاكي أرباحك" : "Simulateur de gains créateur"}</span>
                        <motion.span
                          key={estimatedCommission}
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          className="font-mono font-black text-lg text-gasra-accent whitespace-nowrap"
                        >
                          {estimatedCommission.toLocaleString()} DA
                        </motion.span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gasra-text-secondary">
                        <span className="whitespace-nowrap">
                          {dealScansEstimate} {isAr ? "جار يمسح الكود" : "voisins scannent le QR"}
                        </span>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="5"
                          value={dealScansEstimate}
                          onChange={(e) => setDealScansEstimate(Number(e.target.value))}
                          className="gains-range flex-1"
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-gasra-text-muted">
                        {isAr
                          ? "العمولة تدخل رصيدك فور مسح الزبون للكود في المحل."
                          : "Tu touches ta commission dès que le QR est scanné en magasin."}
                      </p>
                    </div>
                  </div>
                )}

                {kind === "sondage" && (
                  <div className="space-y-2.5">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isAr ? "سؤالك..." : "Ta question..."} className={fieldCls} />
                    {options.map((o, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={o}
                          onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
                          placeholder={`${isAr ? "خيار" : "Option"} ${i + 1}`}
                          className={fieldCls}
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setOptions(options.filter((_, j) => j !== i))}
                            className="p-2 rounded-xl hover:bg-gasra-surface-subtle"
                            aria-label="Retirer"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {options.length < 4 && (
                      <button
                        type="button"
                        onClick={() => setOptions([...options, ""])}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gasra-accent px-1 py-1"
                      >
                        <Plus size={14} />
                        {isAr ? "إضافة خيار" : "Ajouter une option"}
                      </button>
                    )}
                  </div>
                )}

                {kind === "article" && (
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isAr ? "عنوان المقال" : "Titre de l'article"} className={`${fieldCls} text-base font-semibold`} />
                )}

                {kind !== "sondage" && (
                  <textarea
                    rows={kind === "article" ? 10 : 4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      kind === "question"
                        ? isAr ? "اطرح سؤالك على أهل الحومة..." : "Pose ta question aux gens du quartier..."
                        : kind === "avis"
                        ? isAr ? "احكِ تجربتك..." : "Raconte ton expérience..."
                        : kind === "bonplan"
                        ? isAr ? "اشرح البون لجيرانك..." : "Explique le bon plan à tes voisins..."
                        : kind === "article"
                        ? isAr ? "اكتب مقالك..." : "Écris ton article..."
                        : isAr ? "أضف وصفاً..." : "Ajoute une légende..."
                    }
                    className={`${fieldCls} resize-none`}
                  />
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl btn-gasra-primary text-sm flex items-center justify-center gap-2"
                >
                  <span>{kind === "story" ? (isAr ? "نشر الستوري" : "Publier la story") : isAr ? "نشر في قصرة" : "Publier sur Gasra"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <EllamaLiveModal isOpen={ellamaOpen} onClose={() => setEllamaOpen(false)} />
    </div>
  );
};
