import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Award,
  Wallet,
  TrendingUp,
  MapPin,
  Shield,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Coffee,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CONTRIBUTOR_LEVELS, PERSONAS } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";
import { CoffeeModal } from "../common/CoffeeModal";

export const ScreenProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user, language } = useApp();
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"wilayas" | "gains" | "avis">("wilayas");
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);

  // If viewing someone else's profile
  const isOther = userId && userId !== "me" && userId !== "user-amine";
  const targetPersona = isOther ? PERSONAS.find((p) => p.id === userId) || PERSONAS[2] : null;

  const profileName = isOther ? targetPersona!.name : user.name;
  const profileInitials = isOther ? targetPersona!.avatarInitials : user.avatarInitials;
  const profileRole = isOther ? targetPersona!.role : user.role;
  const profileLevelNumber = isOther ? targetPersona!.levelNumber : user.levelNumber;
  const profileLocation = isOther ? targetPersona!.location : `${user.originWilayaName} (${user.originWilayaCode}) · ${user.commune}`;

  const currentLevel = CONTRIBUTOR_LEVELS.find((l) => l.levelNumber === profileLevelNumber) || CONTRIBUTOR_LEVELS[1];
  const nextLevel = CONTRIBUTOR_LEVELS.find((l) => l.levelNumber === profileLevelNumber + 1);

  const progressPercent = nextLevel
    ? Math.min(100, Math.round(((user.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100))
    : 100;

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Back button if visiting another profile */}
      {isOther && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text"
          >
            {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          </button>
          <span className="text-xs text-gasra-text-muted">
            {isAr ? "الرجوع" : "Retour"}
          </span>
        </div>
      )}

      {/* Top Banner / Identity */}
      <div className="p-5 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl btn-gasra-primary flex items-center justify-center font-black text-xl shadow-inner border border-gasra-surface-border">
              {profileInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gasra-text">{profileName}</h2>
                <LevelBadge
                  levelNumber={profileLevelNumber}
                  size="sm"
                  isBerrani={false}
                />
              </div>
              <div className="text-xs text-[#3D5AFE] dark:text-[#6F86FF] font-semibold mt-0.5">
                {profileRole}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gasra-text-muted mt-0.5">
                <MapPin size={12} className="text-[#E0503A]" />
                <span>{profileLocation}</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gasra-surface-subtle font-bold text-gasra-text-secondary">
            {isAr ? "موثق" : "Certifié"}
          </span>
        </div>

        {/* Action Buttons if viewing another user */}
        {isOther ? (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              to="/messages"
              className="py-2.5 px-3 rounded-xl btn-gasra-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageSquare size={14} />
              <span>{isAr ? "مراسلة" : "Envoyer un message"}</span>
            </Link>

            <button
              onClick={() => setCoffeeModalOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100"
            >
              <Coffee size={14} />
              <span>{isAr ? "خلّص عليه قهوة" : "9ahwa Tal3a"}</span>
            </button>
          </div>
        ) : (
          /* Level Progression Bar if viewing own profile */
          <div className="p-3.5 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="text-gasra-text flex items-center gap-1">
                <Award size={14} className="text-[#3D5AFE] dark:text-[#6F86FF]" />
                <span>
                  {isAr ? `الرتبة : ${currentLevel.titleArM}` : `Niveau : ${currentLevel.titleFrM}`}
                </span>
              </span>
              <span className="text-xs font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF]">
                {user.points} / {nextLevel ? nextLevel.minPoints : user.points} pts
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-gasra-surface-border overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#3D5AFE] to-[#E4FF3C] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {nextLevel && (
              <div className="mt-2 text-[11px] text-gasra-text-secondary flex items-center justify-between">
                <span>
                  {isAr
                    ? `باقي ${nextLevel.minPoints - user.points} نقطة للوصول إلى « ${nextLevel.titleArM} »`
                    : `Encore ${nextLevel.minPoints - user.points} pts pour devenir « ${nextLevel.titleFrM} »`}
                </span>
                <span className="font-mono font-bold text-gasra-text">{progressPercent}%</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {!isOther && (
            <Link
              to="/portefeuille"
              className="p-3 rounded-2xl bg-blue-50 dark:bg-[#162447] border border-blue-200 dark:border-[#2B458A] flex flex-col justify-between hover:opacity-95"
            >
              <span className="text-[11px] text-[#3D5AFE] dark:text-[#6F86FF] font-semibold flex items-center gap-1">
                <Wallet size={12} />
                {isAr ? "رصيد المحفظة" : "Solde DA"}
              </span>
              <span className="text-lg font-mono font-black text-gasra-text mt-1">
                {user.walletBalanceDA.toLocaleString()} DA
              </span>
            </Link>
          )}

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
            <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
              <TrendingUp size={12} />
              {isAr ? "مضاعف النقاط" : "Multiplicateur"}
            </span>
            <span className="text-lg font-mono font-black text-gasra-text mt-1">
              {currentLevel.multiplier}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("wilayas")}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === "wilayas"
              ? "btn-gasra-primary shadow-xs"
              : "bg-gasra-surface text-gasra-text-secondary"
          }`}
        >
          {isAr ? "السمعة حسب الولاية" : "Réputation par Wilaya"}
        </button>
        <button
          onClick={() => setActiveTab("gains")}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === "gains"
              ? "btn-gasra-primary shadow-xs"
              : "bg-gasra-surface text-gasra-text-secondary"
          }`}
        >
          {isAr ? "النشاط والعروض" : "Activité locale"}
        </button>
      </div>

      {/* Wilaya Reputations Section */}
      {activeTab === "wilayas" && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[#E0503A] dark:text-[#FF8A78]">
                {isAr ? "قاعدة قصرة الذهبية :" : "Règle d'or territoriale Gasra :"}
              </span>
            </div>
            <p className="text-gasra-text-secondary text-[11px] leading-relaxed">
              {isAr
                ? "مكانتك الاجتماعية تعيش في ولايتك. عندما تسافر تصبح « براني »، وتستفيد من منحة البراني (+50%) لتشجيعك على استكشاف المحلات الموثوقة."
                : "Votre statut n'est valable que dans votre wilaya d'origine. En voyage, vous devenez « Berrani » et bénéficiez de la Prime du Berrani (+50%)."}
            </p>
          </div>

          <div className="space-y-2">
            {user.wilayaReputations.map((rep) => (
              <div
                key={rep.wilayaCode}
                className="p-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      rep.isBerrani
                        ? "bg-gasra-surface-subtle text-gasra-text-secondary"
                        : "btn-gasra-primary"
                    }`}
                  >
                    {rep.wilayaCode}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gasra-text">
                      {rep.wilayaName}
                    </div>
                    <div className="text-[11px] text-gasra-text-secondary mt-0.5">
                      {isAr ? rep.levelTitleAr : rep.levelTitleFr}
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  {rep.primeBerraniActive && (
                    <span className="text-[10px] font-bold text-[#E0503A] dark:text-[#FF8A78] bg-[#FFF1EF] dark:bg-[#421D17] px-2 py-0.5 rounded-full block mb-1">
                      {isAr ? "منحة البراني +50%" : "Prime Berrani +50%"}
                    </span>
                  )}
                  <span className="font-mono text-xs font-bold text-gasra-text">
                    {rep.pointsInWilaya} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Section */}
      {activeTab === "gains" && (
        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gasra-text">Sandwicherie El Forno</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+1 800 DA</span>
            </div>
            <p className="text-[11px] text-gasra-text-secondary">
              15 voisins ont scanné le bon au comptoir (120 DA / scan).
            </p>
          </div>
        </div>
      )}

      {/* Coffee Modal */}
      {coffeeModalOpen && (
        <CoffeeModal
          isOpen={coffeeModalOpen}
          onClose={() => setCoffeeModalOpen(false)}
          recipientName={profileName}
          postId="profile-tip"
        />
      )}
    </div>
  );
};
