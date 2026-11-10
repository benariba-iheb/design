import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Masque la barre de navigation quand on descend le fil d'actualité.
 * - réapparaît instantanément dès qu'on remonte
 * - réapparaît aussi après `idleMs` sans défilement (6 s par défaut)
 * - uniquement sur le fil d'actualité ("/")
 */
export function useAutoHideNav(idleMs = 6000): boolean {
  const location = useLocation();
  const onFeed = location.pathname === "/" || location.pathname === "/feed";
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idleTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setHidden(false);
    if (!onFeed) return;

    const readY = (e: Event) => {
      const t = e.target as HTMLElement | Document;
      if (t && t !== document && (t as HTMLElement).scrollTop !== undefined) {
        return (t as HTMLElement).scrollTop;
      }
      return window.scrollY || document.documentElement.scrollTop;
    };

    const onScroll = (e: Event) => {
      const y = readY(e);
      const delta = y - lastY.current;
      lastY.current = y;

      if (y < 40 || delta < -2) {
        setHidden(false); // on remonte (ou tout en haut) → retour immédiat
      } else if (delta > 4) {
        setHidden(true); // on descend
      }

      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setHidden(false), idleMs);
    };

    lastY.current = window.scrollY;
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true } as any);
      window.clearTimeout(idleTimer.current);
    };
  }, [onFeed, idleMs]);

  return onFeed && hidden;
}
