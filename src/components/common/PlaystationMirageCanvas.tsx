import React from "react";

/**
 * Fond animé Gasra — dégradé "mesh" aux couleurs de la marque
 * (cyan #0DCCF2 → violet #5E47D1 → rose #DB57C5), 100 % CSS.
 * Remplace l'ancien mirage WebGL (copie dans .backups/PlaystationMirageCanvas.webgl.tsx).
 * Le nom du composant est conservé pour ne rien changer ailleurs dans le site.
 */
export const PlaystationMirageCanvas: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`gasra-mesh-bg ${className}`} aria-hidden="true" />
);

export default PlaystationMirageCanvas;
