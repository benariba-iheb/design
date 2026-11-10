import React from "react";
import { Person } from "../../data/people";

export const PersonAvatar: React.FC<{ p: Person; size?: number; ring?: boolean }> = ({ p, size = 48, ring }) => (
  <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
    <span className={`w-full h-full rounded-full ${ring ? "story-ring-animated p-[2px]" : ""}`}>
      <span
        className="w-full h-full rounded-full flex items-center justify-center font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${p.hue}, color-mix(in srgb, ${p.hue} 55%, #0a1026))`, fontSize: size * 0.32 }}
      >
        {p.initials}
      </span>
    </span>
    {p.online && (
      <span
        className="absolute bottom-0 right-0 rounded-full bg-emerald-400 border-2 border-[var(--gasra-surface-solid,#0a1026)]"
        style={{ width: size * 0.26, height: size * 0.26 }}
      />
    )}
  </span>
);
