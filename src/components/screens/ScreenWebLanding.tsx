import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  QrCode,
  Video,
  EyeOff,
  Store,
  ArrowRight,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { GasraLogo } from "../common/GasraLogo";
import { QRCodeModal } from "../common/QRCodeModal";

export const ScreenWebLanding: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-gasra-bg text-gasra-text">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-gasra-surface-border bg-linear-to-b from-gasra-surface to-gasra-bg">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Headlines & CTA */}
          <div className="max-w-2xl text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gasra-surface border border-gasra-surface-border text-xs font-bold text-[#E0503A] dark:text-[#FF8A78] mb-4">
              <Sparkles size={14} />
              <span>{isAr ? "المنصة الاجتماعية الجزائرية الأولى" : "L'économie locale algérienne sur mobile"}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-gasra-text mb-3">
              Gasra <span className="text-[#3D5AFE] dark:text-[#6F86FF]">قصرة</span>
            </h1>

            <div className="mb-4">
              <div className="text-3xl sm:text-5xl font-extrabold text-[#E0503A] dark:text-[#FF8A78] font-serif mb-1">
                « من حومتك، لبلادك »
              </div>
              <div className="text-base sm:text-xl font-medium text-gasra-text-secondary">
                « De ton quartier, à ton pays »
              </div>
            </div>

            <p className="text-lg sm:text-2xl font-bold text-gasra-text mb-4">
              « {isAr ? "حومتك تخلصك." : "Ton quartier te paie."} »
            </p>

            <p className="text-sm sm:text-base text-gasra-text-secondary leading-relaxed mb-8 max-w-xl">
              {isAr
                ? "قصرة تحول الوقت الذي تقضيه على هاتفك في المقهى إلى دخل حقيقي بالدينار الجزائري، يصلك مباشرة على بطاقتك الذهبية عبر ترويج عروض حومتك ومشاركة الآراء الموثقة."
                : "Gasra transforme le temps passé sur smartphone au café en revenu local régulier en Dinars Algériens. Les commerces paient pour être racontés, l'argent arrive directement sur votre carte Edahabia."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/"
                className="px-6 py-3.5 rounded-2xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] font-bold text-sm shadow-lg hover:opacity-95 transition-transform active:scale-98 flex items-center gap-2"
              >
                <span>{isAr ? "فتح التطبيق المباشر" : "Tester l'App Mobile"}</span>
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => setShowQRModal(true)}
                className="px-5 py-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-gasra-text font-bold text-sm shadow-xs hover:bg-gasra-surface-subtle flex items-center gap-2"
              >
                <QrCode size={16} className="text-[#3D5AFE] dark:text-[#6F86FF]" />
                <span>{isAr ? "رمز الهاتف للجنة التحكيم" : "QR Code pour le Jury"}</span>
              </button>

              <Link
                to="/explorer"
                className="px-4 py-3.5 rounded-2xl text-gasra-text-secondary hover:text-gasra-text font-semibold text-xs flex items-center gap-1.5"
              >
                <span>{isAr ? "استكشف الخريطة" : "Explorer la carte"}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero QR Code Banner for Test on Phone */}
          <div className="w-full max-w-sm rounded-3xl bg-gasra-surface border-2 border-gasra-surface-border p-6 shadow-2xl text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1E26] text-[#E4FF3C] text-xs font-bold mb-3">
              <Smartphone size={14} />
              <span>{isAr ? "تجربة الهاتف الذكي" : "Testez sur votre téléphone"}</span>
            </div>

            <h3 className="text-base font-bold text-gasra-text mb-1">
              {isAr ? "امسح بالكاميرا وافتح قصرة" : "Scannez avec votre appareil photo"}
            </h3>
            <p className="text-xs text-gasra-text-secondary mb-4">
              {isAr
                ? "مخصص للجنة التحكيم لتجربة الواجهة النقالة والشاشة الكاملة."
                : "Idéal pour le jury : Gasra s'ouvre directement comme une vraie application."}
            </p>

            {/* Simulated styled QR Code box */}
            <div
              onClick={() => setShowQRModal(true)}
              className="p-4 bg-white rounded-2xl border border-slate-200 cursor-pointer shadow-inner hover:scale-102 transition-transform group"
            >
              <div className="w-48 h-48 mx-auto flex items-center justify-center relative">
                <QrCode size={180} className="text-[#0B1E26]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/70 rounded-xl transition-opacity text-white text-xs font-bold">
                  Cliquez pour agrandir
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-2 block">
                QR Code Live App
              </span>
            </div>

            <p className="mt-4 text-[11px] text-gasra-text-muted">
              {isAr
                ? "متوافق مع أجهزة آيفون وأندرويد بدون أي تثبيت من المتجر."
                : "Compatible iOS Safari & Android Chrome en PWA."}
            </p>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section : Créateurs / Contributeurs / Commerces */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gasra-text tracking-tight mb-2">
            {isAr ? "ثلاث طرق للتفاعل مع حومتك" : "Comment Gasra fonctionne"}
          </h2>
          <p className="text-xs sm:text-sm text-gasra-text-secondary">
            {isAr
              ? "منظومة محلية متوازنة تكافئ من يصنع المحتوى، من يقدم المعلومة، ومن يدير محلا تجاريا."
              : "Un écosystème qui aligne créateurs, contributeurs discrets et commerçants de quartier."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Créateurs */}
          <div className="p-6 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs flex flex-col justify-between hover:border-[#3D5AFE] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#162447] text-[#3D5AFE] dark:text-[#6F86FF] flex items-center justify-center mb-4">
                <Video size={24} />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF] uppercase">
                {isAr ? "للشباب وصناع المحتوى" : "Pour les Créateurs"}
              </span>
              <h3 className="text-lg font-bold text-gasra-text mt-1 mb-2">
                {isAr ? "روّج البونات واربح بالدينار" : "Les Bons du Quartier"}
              </h3>
              <p className="text-xs text-gasra-text-secondary leading-relaxed mb-4">
                {isAr
                  ? "لست بحاجة لآلاف المتابعين. انشر فيديو سريع عن مطعم أو صالون في حومتك. كلما مسح جارك رمز التخفيض في المحل، تدخل عمولتك فورا في رصيدك."
                  : "Pas besoin de 100k abonnés. Faites une story sur le commerce du coin. Chaque voisin qui scanne le bon en magasin vous rapporte une commission en Dinars."}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gasra-surface-subtle text-[11px] font-semibold text-gasra-text">
              Exemple : 15 scans = 1 800 DA sur Edahabia
            </div>
          </div>

          {/* Card 2: Contributeurs */}
          <div className="p-6 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs flex flex-col justify-between hover:border-[#E4FF3C] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4">
                <EyeOff size={24} />
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 uppercase">
                {isAr ? "للمساهمين بدون تصوير" : "Pour les Contributeurs"}
              </span>
              <h3 className="text-lg font-bold text-gasra-text mt-1 mb-2">
                {isAr ? "نقاط الحومة وكاش الولاية" : "La Cagnotte des Points"}
              </h3>
              <p className="text-xs text-gasra-text-secondary leading-relaxed mb-4">
                {isAr
                  ? "شارك دون أن تظهر وجهك : اكتب آراء موثقة، صوّر ساعات عمل صيدلية المناوبة، وشارك في التنبيهات. نقاطك تتحول أسبوعيا إلى دنانير من كاش الولاية."
                  : "Restez discret : avis vérifiés, photos de menus, alertes de garde. Vos points sont convertis chaque semaine en Dinars via la cagnotte territoriale de votre wilaya."}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gasra-surface-subtle text-[11px] font-semibold text-gasra-text">
              Rangs : Jar → Weld el Houma → L'Ancien
            </div>
          </div>

          {/* Card 3: Commerces */}
          <div className="p-6 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs flex flex-col justify-between hover:border-[#E0503A] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-[#421D17] text-[#E0503A] dark:text-[#FF8A78] flex items-center justify-center mb-4">
                <Store size={24} />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#E0503A] dark:text-[#FF8A78] uppercase">
                {isAr ? "لأصحاب المحلات والخدمات" : "Pour les Commerces"}
              </span>
              <h3 className="text-lg font-bold text-gasra-text mt-1 mb-2">
                {isAr ? "زبائن حقيقيون بدون بطاقة فيزا" : "Visibilité 100% en Dinars"}
              </h3>
              <p className="text-xs text-gasra-text-secondary leading-relaxed mb-4">
                {isAr
                  ? "توقف عن إضاعة وقتك في البحث عن بطاقات بنكية دولية. أطلق عروضك وادفع بالدينار عبر الذهبية أو فليكسي. ولا تدفع عمولة الصانع إلا إذا جاء الزبون فعليا لمجلك."
                  : "Plus besoin de carte Visa internationale ou de devises. Lancez des bons payables en DA via Edahabia ou flexy. Ne payez la commission que quand le client est en caisse."}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gasra-surface-subtle text-[11px] font-semibold text-gasra-text">
              Bouton prédictif « Rani jay » inclus
            </div>
          </div>
        </div>
      </section>

      {/* QR Modal for Jury */}
      <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </div>
  );
};
