import React from "react";
import { Link } from "react-router-dom";

interface GasraLogoProps {
  size?: "sm" | "md" | "lg" | "hero";
  showText?: boolean;
  showSlogan?: boolean;
  className?: string;
  asLink?: boolean;
}

/**
 * Animated Logo using the user-provided graphic (globe + stylized green/blue ribbons)
 * with the flowing gradient animation from Main.dc.html.
 * Note: Written text removed as requested ("laisse juste le logo").
 */
export const GasraLogo: React.FC<GasraLogoProps> = ({
  size = "md",
  className = "",
  asLink = true,
}) => {
  const sizeMap = {
    sm: "w-9 h-6",
    md: "w-12 h-8",
    lg: "w-16 h-11",
    hero: "w-24 h-16",
  };

  const dimension = sizeMap[size];

  const content = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${dimension} ${className}`}
      style={{ isolation: "isolate" }}
      aria-label="Logo"
    >
      {/* Base Logo Image */}
      <img
        src="/assets/logo.png"
        alt="Logo"
        className="w-full h-full object-contain drop-shadow-sm select-none pointer-events-none"
        draggable={false}
      />

      {/* Animated flowing gradient overlay (from user's Main.dc.html) */}
      <div
        className="logo-flow select-none pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-gasra-accent rounded-xl transition-opacity hover:opacity-95"
        title="Accueil"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default GasraLogo;
