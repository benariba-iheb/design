import React from "react";
import { Link } from "react-router-dom";
import { Users, MapPin, ChevronRight, Shield, PlusCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_GROUPS } from "../../data/mockData";

export const ScreenGroupsList: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gasra-surface-border">
        <div>
          <h2 className="text-base font-bold text-gasra-text flex items-center gap-2">
            <Users size={18} className="text-[#3D5AFE] dark:text-[#6F86FF]" />
            <span>{isAr ? "مجموعات الحومة" : "Groupes & Communautés"}</span>
          </h2>
          <p className="text-[11px] text-gasra-text-muted">
            {isAr ? "مجتمعات محلية للتضامن والتجارة الآمنة" : "Échanges et entraide par commune et centre d'intérêt"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_GROUPS.map((grp) => (
          <Link
            key={grp.id}
            to={`/groupe/${grp.id}`}
            className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs hover:border-[#3D5AFE] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gasra-surface-subtle text-gasra-text-secondary">
                  {grp.category}
                </span>
                <span className="text-[11px] font-mono text-gasra-text-muted">
                  {grp.membersCount.toLocaleString()} membres
                </span>
              </div>

              <h3 className="font-bold text-sm text-gasra-text group-hover:text-[#3D5AFE] transition-colors mb-1">
                {grp.name}
              </h3>

              <p className="text-xs text-gasra-text-secondary line-clamp-2 mb-3">
                {isAr ? grp.descriptionAr : grp.descriptionFr}
              </p>
            </div>

            <div className="pt-2 border-t border-gasra-surface-border flex items-center justify-between text-xs text-gasra-text-muted">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-[#E0503A]" />
                <span>{grp.wilaya} · {grp.commune}</span>
              </span>
              <span className="text-xs font-semibold text-[#3D5AFE] dark:text-[#6F86FF] flex items-center gap-1">
                <span>{isAr ? "دخول" : "Rejoindre"}</span>
                <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
