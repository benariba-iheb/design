import React from "react";

interface ReactionIconProps {
  id: string;
  className?: string;
  size?: number;
}

export const ReactionIcon: React.FC<ReactionIconProps> = ({ id, className = "", size = 20 }) => {
  switch (id) {
    case "ya3tik_saha":
      // Main sur le cœur (Hand on heart)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-emerald-500 ${className}`}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 9v4" strokeWidth="2.5" />
          <path d="M10 11h4" strokeWidth="2.5" />
        </svg>
      );

    case "hbel":
      // Hbel (Flamme / explosion d'énergie)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-amber-400 ${className}`}
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5Z" />
        </svg>
      );

    case "hhhh":
      // Hhhh (Rire)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-yellow-400 ${className}`}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 9.5c.5-.5 1.5-.5 2 0" />
          <path d="M14 9.5c.5-.5 1.5-.5 2 0" />
          <path d="M8 14c1.5 2 6.5 2 8 0" strokeWidth="2.5" />
        </svg>
      );

    case "ya_hasra":
      // Ya hasra (Sablier / nostalgie)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-amber-600 dark:text-amber-300 ${className}`}
        >
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      );

    case "wach_hada":
      // Wach hada (Questionnement / étonnement)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-sky-400 ${className}`}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" strokeWidth="3" />
        </svg>
      );

    case "nervi":
      // Nervi (Langue mordue entre les dents)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-rose-500 ${className}`}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 9h2" />
          <path d="M14 9h2" />
          <path d="M8 15h8" strokeWidth="2.5" />
          <rect x="10.5" y="15" width="3" height="3" fill="currentColor" rx="1" />
        </svg>
      );

    case "m3ak":
      // M3ak (Solidaire / poignées de mains / alliés)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-indigo-400 ${className}`}
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "rani_jay":
      // Rani jay (J'arrive ! Flash navigation / intent to visit)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[#E0503A] dark:text-[#FF8A78] ${className}`}
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    default:
      return null;
  }
};
