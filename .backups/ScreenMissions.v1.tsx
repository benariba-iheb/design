import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Trophy,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  Coins,
  ShieldCheck,
  Users,
  Sparkles,
  Camera,
  ArrowRight,
  Zap,
  Flame,
  Check,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Mission {
  id: string;
  titleFr: string;
  titleAr: string;
  descFr: string;
  descAr: string;
  rewardDA: number;
  rewardPoints: number;
  category: "commerce" | "citoyen" | "solidarite" | "urgent";
  location: string;
  wilaya: string;
  timeLimit: string;
  totalSpots: number;
  spotsTaken: number;
  status: "available" | "in_progress" | "completed";
  isBerraniBonus?: boolean;
}

const INITIAL_MISSIONS: Mission[] = [
  {
    id: "m-1",
    titleFr: "Photographier les horaires et tarifs de la nouvelle laverie automatique",
    titleAr: "تصوير أوقات العمل وأسعار المغسلة الآلية الجديدة",
    descFr: "Vérifier sur place l'ouverture effective et prendre une photo nette du tableau des tarifs pour informer les habitants du quartier.",
    descAr: "التأكد ميدانياً من افتتاح المحل وأخذ صورة واضحة لقائمة الأسعار لإفادة سكان الحي.",
    rewardDA: 180,
    rewardPoints: 120,
    category: "commerce",
    location: "Cité Ismail Yefsah, face à la mosquée",
    wilaya: "16 - Alger",
    timeLimit: "Expire aujourd'hui à 18h",
    totalSpots: 5,
    spotsTaken: 2,
    status: "available",
  },
  {
    id: "m-2",
    titleFr: "Signaler le candélabre défaillant au rond-point Cité 8 Mai",
    titleAr: "التبليغ عن مصباح الإنارة المعطل بمحور دوران حي 8 ماي",
    descFr: "Prendre une photo géolocalisée du lampadaire éteint pour transmission rapide aux services de voirie de la commune.",
    descAr: "أخذ صورة مع تحديد الموقع للعمود المنطفئ لإرسالها لمصالح الصيانة بالبلدية.",
    rewardDA: 120,
    rewardPoints: 90,
    category: "urgent",
    location: "Rond-point 8 Mai 1945",
    wilaya: "16 - Alger",
    timeLimit: "Urgent · 4h restantes",
    totalSpots: 2,
    spotsTaken: 1,
    status: "available",
  },
  {
    id: "m-3",
    titleFr: "Avis vérifié sur la boulangerie artisanale Le Pain Doré",
    titleAr: "تقييم مؤكد للمخبزة التقليدية لو بان دوري",
    descFr: "Tester la qualité des baguettes traditionnelles et partager un retour objectif avec photos des produits.",
    descAr: "تجربة جودة الخبز التقليدي ومشاركة تقييم موضوعي ومفيد مع صور.",
    rewardDA: 250,
    rewardPoints: 150,
    category: "commerce",
    location: "Boulevard Akid Lotfi",
    wilaya: "31 - Oran",
    timeLimit: "En cours cette semaine",
    totalSpots: 6,
    spotsTaken: 4,
    status: "available",
    isBerraniBonus: true,
  },
  {
    id: "m-4",
    titleFr: "Guide d'accueil des étudiants nouveaux arrivants à l'USTHB",
    titleAr: "دليل إرشادي للطلبة الجدد بجامعة باب الزوار",
    descFr: "Rédiger 3 recommandations clés de transport et restauration abordable pour les étudiants venus d'autres wilayas.",
    descAr: "كتابة 3 نصائح أساسية حول النقل والمطاعم المناسبة للطلبة القادمين من ولايات أخرى.",
    rewardDA: 400,
    rewardPoints: 280,
    category: "solidarite",
    location: "Campus USTHB / Cité U",
    wilaya: "16 - Alger",
    timeLimit: "3 jours restants",
    totalSpots: 8,
    spotsTaken: 6,
    status: "available",
  },
  {
    id: "m-5",
    titleFr: "Recensement des pharmacies de garde du weekend",
    titleAr: "حصر الصيدليات المناوبة لعطلة نهاية الأسبوع",
    descFr: "Confirmer la liste affichée sur la porte de la pharmacie principale et la reporter sur Gasra.",
    descAr: "تأكيد قائمة المداومة المعلقة ونشرها على تطبيق قصرة لتسهيل بحث الجيران.",
    rewardDA: 150,
    rewardPoints: 110,
    category: "citoyen",
    location: "Bab Ezzouar centre",
    wilaya: "16 - Alger",
    timeLimit: "Avant vendredi 14h",
    totalSpots: 3,
    spotsTaken: 1,
    status: "available",
  },
];

export const ScreenMissions: React.FC = () => {
  const { language, user } = useApp();
  const isAr = language === "ar";

  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [selectedProofMission, setSelectedProofMission] = useState<Mission | null>(null);

  const handleJoinMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, status: "in_progress", spotsTaken: m.spotsTaken + 1 }
          : m
      )
    );
    const target = missions.find((m) => m.id === missionId);
    showToast(isAr ? `انضممت للمهمة بنجاح ! أرسل الإثبات عند الإنجاز` : `Mission rejointe ! Envoie ta preuve une fois terminée.`);
  };

  const handleValidateProof = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId ? { ...m, status: "completed" } : m
      )
    );
    const target = missions.find((m) => m.id === missionId);
    setSelectedProofMission(null);
    showToast(
      isAr
        ? `مبروك ! تمت المصادقة على الإثبات وأضيف +${target?.rewardDA || 150} دج لرصيدك !`
        : `Bravo ! Preuve validée : +${target?.rewardDA || 150} DA & +${target?.rewardPoints || 100} pts crédités !`
    );
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filteredMissions = missions.filter((m) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "my") return m.status === "in_progress" || m.status === "completed";
    return m.category === activeCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-gasra-accent text-gasra-on-accent font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top duration-300">
          <CheckCircle size={20} className="shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Banner with Algerian gamification context */}
      <div className="gasra-card-glass rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gasra-accent/15 border border-gasra-accent/30 text-gasra-accent text-xs font-bold">
              <Target size={14} />
              <span>{isAr ? "مهام وتحديات الحومة" : "Missions & Quêtes Citoyennes"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gasra-text tracking-tight">
              {isAr ? "ساعد حومتك، اكسب الدنانير و علّي قيمتك" : "Agis pour ta houma, gagne des Dinars et fais monter ta réputation"}
            </h1>
            <p className="text-xs sm:text-sm text-gasra-text-secondary leading-relaxed">
              {isAr
                ? "مهام حقيقية وميدانية معتمدة من الجيران والمتاجر. كل مهمة تنجزها تمنحك دنانير فورية في محفظتك ونقاطاً لترقية لقبك في الولاية."
                : "Des missions concrètes proposées par le quartier et les commerces locaux. Gagne des Dinars (DA) directement retirables vers Edahabia et deviens un héros de ta houma."}
            </p>
          </div>

          {/* User gamification scoreboard pill */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gasra-surface-subtle/90 border border-gasra-surface-border flex flex-col gap-3 shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gasra-text-muted">
                {isAr ? "رصيد المهام" : "Solde & Points"}
              </span>
              <span className="text-xs font-mono font-bold text-gasra-accent bg-gasra-accent/15 px-2 py-0.5 rounded-lg">
                Niv. {user.levelNumber}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-gasra-text">
                {user.walletBalanceDA.toLocaleString()} DA
              </span>
              <span className="text-xs font-mono font-bold text-gasra-accent">
                +{user.points} pts
              </span>
            </div>
            <div className="pt-2 border-t border-gasra-surface-border/60 flex items-center justify-between text-[11px] text-gasra-text-secondary">
              <span>{user.levelTitleFr}</span>
              <span className="text-amber-400 font-bold">★ Weld el Houma</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {[
          { id: "all", labelFr: "Toutes les missions", labelAr: "كل المهام", icon: Target },
          { id: "urgent", labelFr: "Urgentes / Aujourd'hui", labelAr: "عاجلة اليوم", icon: Flame },
          { id: "commerce", labelFr: "Commerces & Vérification", labelAr: "المتاجر والأسعار", icon: Zap },
          { id: "solidarite", labelFr: "Solidarité & Houma", labelAr: "تضامن وأخوة", icon: Users },
          { id: "my", labelFr: "Mes missions", labelAr: "مهامي", icon: CheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all shrink-0 ${
                activeCategory === tab.id
                  ? "btn-gasra-primary shadow-sm"
                  : "gasra-card-glass text-gasra-text-secondary hover:text-gasra-accent"
              }`}
            >
              <Icon size={15} />
              <span>{isAr ? tab.labelAr : tab.labelFr}</span>
            </button>
          );
        })}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const progressPercent = Math.min(100, Math.round((mission.spotsTaken / mission.totalSpots) * 100));

          return (
            <div
              key={mission.id}
              className={`gasra-card-glass rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                mission.status === "completed"
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : mission.status === "in_progress"
                  ? "border-gasra-accent shadow-md"
                  : "border-gasra-surface-border hover:border-gasra-accent/40"
              }`}
            >
              <div>
                {/* Card Top: Badges & Rewards */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gasra-accent/15 text-gasra-accent border border-gasra-accent/30">
                      {mission.category === "commerce"
                        ? isAr ? "متاجر" : "Commerce"
                        : mission.category === "urgent"
                        ? isAr ? "عاجل" : "Urgent"
                        : isAr ? "تضامن" : "Solidarité"}
                    </span>

                    {mission.isBerraniBonus && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30">
                        {isAr ? "منحة براني +50%" : "Prime Berrani +50%"}
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base sm:text-lg font-mono font-black text-gasra-accent">
                      +{mission.rewardDA} DA
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gasra-text-muted">
                      +{mission.rewardPoints} pts
                    </div>
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="text-sm sm:text-base font-bold text-gasra-text mb-1.5 leading-snug">
                  {isAr ? mission.titleAr : mission.titleFr}
                </h3>
                <p className="text-xs text-gasra-text-secondary leading-relaxed mb-4">
                  {isAr ? mission.descAr : mission.descFr}
                </p>

                {/* Location & Time Limit */}
                <div className="space-y-1.5 mb-4 text-[11px] text-gasra-text-muted">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-gasra-accent shrink-0" />
                    <span className="truncate">{mission.location} ({mission.wilaya})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-400 shrink-0" />
                    <span>{mission.timeLimit}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Progress & Action Button */}
              <div className="pt-3 border-t border-gasra-surface-border/60">
                <div className="flex items-center justify-between text-[11px] text-gasra-text-muted mb-2 font-medium">
                  <span>
                    {isAr
                      ? `${mission.spotsTaken} من ${mission.totalSpots} أماكن محجوزة`
                      : `${mission.spotsTaken} / ${mission.totalSpots} places réservées`}
                  </span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-gasra-surface-subtle overflow-hidden mb-3">
                  <div
                    className="h-full bg-linear-to-r from-[#0DCCF2] to-[#FC56C1] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Status action buttons */}
                {mission.status === "completed" ? (
                  <div className="w-full py-2 rounded-2xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30">
                    <Check size={16} />
                    <span>{isAr ? "مهمة منجزة و معتمدة ✓" : "Mission accomplie & récompensée ✓"}</span>
                  </div>
                ) : mission.status === "in_progress" ? (
                  <button
                    onClick={() => setSelectedProofMission(mission)}
                    className="w-full py-2.5 rounded-2xl btn-gasra-primary text-xs font-black shadow-md flex items-center justify-center gap-2"
                  >
                    <Camera size={15} />
                    <span>{isAr ? "إرسال الإثبات (صورة / إفادة)" : "Envoyer ma preuve (Photo / Rapport)"}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinMission(mission.id)}
                    className="w-full py-2.5 rounded-2xl bg-gasra-accent/15 hover:bg-gasra-accent hover:text-gasra-on-accent text-gasra-accent border border-gasra-accent/40 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Target size={15} />
                    <span>{isAr ? "المشاركة في المهمة" : "Participer à la mission"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Modal */}
      {selectedProofMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProofMission(null)}
          />
          <div className="relative w-full max-w-md gasra-card-glass rounded-3xl p-6 border border-gasra-surface-border shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gasra-surface-border">
              <h3 className="font-black text-base text-gasra-text flex items-center gap-2">
                <Camera size={18} className="text-gasra-accent" />
                <span>{isAr ? "إثبات إنجاز المهمة" : "Validation de la preuve"}</span>
              </h3>
              <button
                onClick={() => setSelectedProofMission(null)}
                className="p-1 rounded-xl hover:bg-gasra-surface-subtle text-gasra-text-muted"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gasra-text-secondary leading-snug">
              {isAr ? selectedProofMission.titleAr : selectedProofMission.titleFr}
            </p>

            <div className="p-4 rounded-2xl border-2 border-dashed border-gasra-accent/40 bg-gasra-accent/5 text-center cursor-pointer hover:bg-gasra-accent/10 transition-colors">
              <Camera size={28} className="mx-auto mb-2 text-gasra-accent" />
              <div className="text-xs font-bold text-gasra-text">
                {isAr ? "تحميل صورة واضحة من الميدان" : "Joindre une photo nette du lieu"}
              </div>
              <div className="text-[10px] text-gasra-text-muted mt-1">
                Formats acceptés: JPG, PNG · Géolocalisation automatique
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono font-bold text-gasra-accent">
                Récompense : +{selectedProofMission.rewardDA} DA
              </div>
              <button
                onClick={() => handleValidateProof(selectedProofMission.id)}
                className="px-5 py-2.5 rounded-2xl btn-gasra-primary text-xs font-black shadow-md"
              >
                {isAr ? "تأكيد واستلام الدنانير" : "Valider et encaisser"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="gasra-card-glass rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-gasra-text">
              {isAr ? "أبطال الحومة هذا الشهر" : "Héros du quartier ce mois-ci"}
            </h2>
          </div>
          <span className="text-xs font-bold text-gasra-text-muted">
            Bab Ezzouar · Alger
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "Amine Rezgui", rank: "1er", pts: "1 420 pts", reward: "+12 000 DA gagnés", avatar: "🥇" },
            { name: "Ines Hamdi", rank: "2ème", pts: "1 180 pts", reward: "+9 500 DA gagnés", avatar: "🥈" },
            { name: "Samy Khelif", rank: "3ème", pts: "940 pts", reward: "+7 200 DA gagnés", avatar: "🥉" },
          ].map((hero, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border flex items-center gap-3"
            >
              <div className="text-2xl">{hero.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gasra-text truncate">{hero.name}</div>
                <div className="text-[11px] font-mono text-gasra-accent font-bold">{hero.pts}</div>
                <div className="text-[10px] text-gasra-text-muted">{hero.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
