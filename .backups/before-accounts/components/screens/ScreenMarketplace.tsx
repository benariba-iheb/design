import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Search,
  Filter,
  Check,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Lock,
  Eye,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_MARKETPLACE, MarketplaceItem } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";
import { MarketplaceHome } from "./MarketplaceHome";

export const ScreenMarketplace: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { language, user } = useApp();
  const isAr = language === "ar";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [escrowModalOpen, setEscrowModalOpen] = useState(false);
  const [escrowSuccess, setEscrowSuccess] = useState(false);

  // If specific item selected
  const activeItem: MarketplaceItem | undefined = id
    ? MOCK_MARKETPLACE.find((item) => item.id === id)
    : undefined;

  const categories = [
    { id: "all", labelFr: "Tout le souk", labelAr: "كل السوق" },
    { id: "Véhicules", labelFr: "Véhicules", labelAr: "مركبات" },
    { id: "Téléphonie", labelFr: "Téléphones", labelAr: "هواتف" },
    { id: "Artisanat & Décoration", labelFr: "Artisanat", labelAr: "صناعة تقليدية" },
  ];

  const filteredItems = MOCK_MARKETPLACE.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wilaya.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEscrowConfirm = () => {
    setEscrowSuccess(true);
    setTimeout(() => {
      setEscrowSuccess(false);
      setEscrowModalOpen(false);
    }, 2000);
  };

  // IF DETAILED ITEM VIEW
  if (activeItem) {
    return (
      <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
        {/* Back Navigation */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gasra-surface-border">
          <button
            onClick={() => navigate("/marketplace")}
            className="p-2 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text"
          >
            {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          </button>
          <span className="text-xs font-bold text-gasra-text truncate max-w-[220px]">
            {isAr ? activeItem.titleAr : activeItem.title}
          </span>
          <span className="text-[10px] font-mono text-gasra-text-muted">
            {activeItem.viewsCount} vues
          </span>
        </div>

        {/* Item Picture Placeholder */}
        <div className="w-full h-52 rounded-3xl bg-hatched border border-gasra-surface-border flex items-center justify-center text-xs text-gasra-text-muted mb-4 relative overflow-hidden">
          <span className="bg-gasra-surface/90 px-3.5 py-1.5 rounded-full font-mono shadow-xs">
            [Photo de l'article : {activeItem.title}]
          </span>

          <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-[#0B1E26] text-[#E4FF3C] text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <ShieldCheck size={12} />
            {isAr ? "مضمون بالسركوست" : "Séquestre Gasra"}
          </span>
        </div>

        {/* Product Details Header */}
        <div className="p-5 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF] uppercase">
                {activeItem.category} · {activeItem.condition}
              </span>
              <h1 className="text-base sm:text-lg font-black text-gasra-text mt-1 leading-snug">
                {isAr ? activeItem.titleAr : activeItem.title}
              </h1>
            </div>
          </div>

          <div className="text-2xl font-mono font-black text-[#3D5AFE] dark:text-[#6F86FF] my-2">
            {activeItem.priceDA.toLocaleString()}{" "}
            <span className="text-base font-sans font-bold text-gasra-text">DA</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gasra-text-muted mb-4">
            <MapPin size={13} className="text-[#E0503A]" />
            <span>{activeItem.wilaya} · {activeItem.commune}</span>
          </div>

          <p className="text-xs text-gasra-text-secondary leading-relaxed mb-4">
            {isAr ? activeItem.descriptionAr : activeItem.descriptionFr}
          </p>

          {/* Seller Card */}
          <div className="p-3.5 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border flex items-center justify-between">
            <Link to={`/profil/${activeItem.sellerId}`} className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl btn-gasra-primary flex items-center justify-center font-bold text-xs">
                {activeItem.sellerName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-bold text-xs text-gasra-text hover:underline">
                  {activeItem.sellerName}
                </div>
                <div className="text-[10px] text-gasra-text-muted">
                  {activeItem.sellerLevelTitle} · ★ {activeItem.sellerRating}
                </div>
              </div>
            </Link>

            <Link
              to="/messages"
              className="p-2 rounded-xl bg-gasra-surface hover:bg-gasra-surface-border text-gasra-text text-xs font-semibold flex items-center gap-1 border border-gasra-surface-border"
            >
              <MessageSquare size={14} />
              <span>{isAr ? "دردشة" : "Contacter"}</span>
            </Link>
          </div>
        </div>

        {/* Escrow Guarantee Box */}
        <div className="p-4 rounded-3xl bg-blue-50 dark:bg-[#162447] border border-blue-200 dark:border-[#2B458A] text-xs text-gasra-text mb-4">
          <div className="flex items-center gap-2 font-bold text-[#3D5AFE] dark:text-[#6F86FF] mb-1">
            <Lock size={15} />
            <span>{isAr ? "الحماية بالضمان المالي (Séquestre) :" : "Protection Séquestre Gasra :"}</span>
          </div>
          <p className="text-[11px] text-gasra-text-secondary leading-relaxed">
            {isAr
              ? "أموالك تبقى في أمان تام ولا تُسلّم للبائع إلا بعد معاينة الغرض واستلامه يدا بيد."
              : "Vos fonds sont bloqués de façon neutre. Le vendeur n'est payé que lorsque vous avez vérifié et validé l'article en main propre."}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEscrowModalOpen(true)}
            className="flex-1 py-3.5 rounded-2xl btn-gasra-primary font-bold text-xs shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>
              {isAr
                ? `شراء بالضمان (${activeItem.priceDA.toLocaleString()} دج)`
                : `Acheter avec Séquestre (${activeItem.priceDA.toLocaleString()} DA)`}
            </span>
          </button>
        </div>

        {/* Escrow Modal */}
        {escrowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-gasra-surface p-6 border border-gasra-surface-border shadow-2xl text-gasra-text">
              {escrowSuccess ? (
                <div className="py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <Check size={32} />
                  </div>
                  <h3 className="text-base font-bold text-gasra-text mb-1">
                    {isAr ? "تم حجز المبلغ في السركوست !" : "Fonds sécurisés sous séquestre !"}
                  </h3>
                  <p className="text-xs text-gasra-text-secondary">
                    {isAr
                      ? `تم تجميد ${activeItem.priceDA.toLocaleString()} دج. يمكنك الآن لقاء ${activeItem.sellerName} للمعاينة.`
                      : `Montant bloqué. Rencontrez ${activeItem.sellerName} pour tester l'article.`}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-base text-gasra-text mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#3D5AFE]" />
                    <span>{isAr ? "تأكيد الشراء بالضمان" : "Séquestre d'achat sécurisé"}</span>
                  </h3>
                  <p className="text-xs text-gasra-text-secondary mb-4">
                    {isAr
                      ? `سيتم اقتطاع ${activeItem.priceDA.toLocaleString()} دج مؤقتا وتجميدها في صندوق الأمانات.`
                      : `Le montant de ${activeItem.priceDA.toLocaleString()} DA sera mis sous séquestre jusqu'à la remise en main propre.`}
                  </p>

                  <div className="p-3 rounded-xl bg-gasra-surface-subtle text-xs mb-4 flex items-center justify-between">
                    <span>{isAr ? "رصيدك الحالي :" : "Votre solde :"}</span>
                    <span className="font-mono font-bold text-[#3D5AFE]">
                      {user.walletBalanceDA.toLocaleString()} DA
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEscrowModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-gasra-surface-subtle text-gasra-text font-bold text-xs"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleEscrowConfirm}
                      className="flex-1 py-2.5 rounded-xl btn-gasra-primary font-bold text-xs shadow-xs"
                    >
                      Confirmer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // LISTING VIEW — Marketplace en boutiques (pas de boutique = pas d'annonce)
  return <MarketplaceHome />;
};
