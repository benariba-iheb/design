import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import {
  Layers,
  MapPin,
  Tag,
  Zap,
  Store,
  Calendar,
  Navigation,
  Check,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_DEALS } from "../../data/mockData";

interface MapPlace {
  id: string;
  name: string;
  type: "deal" | "mission" | "business" | "event";
  lat: number;
  lng: number;
  category: string;
  detail: string;
  actionText: string;
  distance: string;
  color: string;
}

const MAP_PLACES: MapPlace[] = [
  {
    id: "p1",
    name: "Sandwicherie El Forno",
    type: "deal",
    lat: 36.718,
    lng: 3.182,
    category: "Restauration",
    detail: "Bon -30% Chawarma XL (Comm: 120 DA)",
    actionText: "Rani jay",
    distance: "3 min · 240m",
    color: "#E0503A",
  },
  {
    id: "p2",
    name: "Pharmacie de garde El Afia",
    type: "mission",
    lat: 36.721,
    lng: 3.185,
    category: "Santé",
    detail: "Mission photo horaires : +120 pts (180 DA)",
    actionText: "Prendre la mission",
    distance: "5 min · 400m",
    color: "#3D5AFE",
  },
  {
    id: "p3",
    name: "Café des Frères Kouba",
    type: "business",
    lat: 36.715,
    lng: 3.178,
    category: "Café Traditionnel",
    detail: "Avis vérifiés : 4.8/5 (Sahb el Kelma)",
    actionText: "Voir la vitrine",
    distance: "7 min · 600m",
    color: "#0B1E26",
  },
  {
    id: "p4",
    name: "Stade de Proximité Cité 5 Juillet",
    type: "event",
    lat: 36.724,
    lng: 3.189,
    category: "Sport & Jeunesse",
    detail: "Tournoi inter-quartiers ce vendredi à 16h30",
    actionText: "Rani jay",
    distance: "10 min · 850m",
    color: "#E4FF3C",
  },
];

export const ScreenExploreMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const { language, triggerRaniJay } = useApp();
  const isAr = language === "ar";

  const [activeFilter, setActiveFilter] = useState<"all" | "deal" | "mission" | "business" | "event">("all");
  const [selectedPlace, setSelectedPlace] = useState<MapPlace>(MAP_PLACES[0]);
  const [raniJayTriggered, setRaniJayTriggered] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    // Leaflet OpenStreetMap centered on Bab Ezzouar / Algiers
    const map = L.map(mapContainerRef.current, {
      center: [36.718, 3.182],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers on filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      activeFilter === "all"
        ? MAP_PLACES
        : MAP_PLACES.filter((p) => p.type === activeFilter);

    filtered.forEach((place) => {
      // Custom styled HTML marker pin
      const iconHtml = `
        <div style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: ${place.type === "deal" ? "#E0503A" : place.type === "mission" ? "#3D5AFE" : "#0B1E26"};
          border: 3px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          ${place.type === "deal" ? "🏷️" : place.type === "mission" ? "⚡" : "📍"}
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-gasra-pin",
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedPlace(place);
        setRaniJayTriggered(false);
        map.panTo([place.lat, place.lng]);
      });

      markersRef.current.push(marker);
    });
  }, [activeFilter]);

  const handleActionClick = () => {
    if (selectedPlace.actionText === "Rani jay") {
      triggerRaniJay(selectedPlace.id);
      setRaniJayTriggered(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full bg-gasra-bg overflow-hidden text-gasra-text">
      {/* Top Floating Filter Pills */}
      <div className="absolute top-3 start-3 end-3 z-30 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 shadow-md transition-all ${
            activeFilter === "all"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26]"
              : "bg-gasra-surface text-gasra-text hover:bg-gasra-surface-subtle"
          }`}
        >
          {isAr ? "الكل" : "Tout voir"}
        </button>

        <button
          onClick={() => setActiveFilter("deal")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 shadow-md flex items-center gap-1 transition-all ${
            activeFilter === "deal"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26]"
              : "bg-gasra-surface text-[#E0503A] hover:bg-gasra-surface-subtle"
          }`}
        >
          <Tag size={13} />
          <span>{isAr ? "البونات" : "Bons (-30%)"}</span>
        </button>

        <button
          onClick={() => setActiveFilter("mission")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 shadow-md flex items-center gap-1 transition-all ${
            activeFilter === "mission"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26]"
              : "bg-gasra-surface text-[#3D5AFE] hover:bg-gasra-surface-subtle"
          }`}
        >
          <Zap size={13} />
          <span>{isAr ? "المهام" : "Missions (pts)"}</span>
        </button>

        <button
          onClick={() => setActiveFilter("business")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 shadow-md flex items-center gap-1 transition-all ${
            activeFilter === "business"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26]"
              : "bg-gasra-surface text-gasra-text hover:bg-gasra-surface-subtle"
          }`}
        >
          <Store size={13} />
          <span>{isAr ? "المحلات" : "Commerces"}</span>
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />

      {/* Bottom Floating Place Preview Card */}
      {selectedPlace && (
        <div className="absolute bottom-20 start-3 end-3 z-30 p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-gasra-surface-subtle text-gasra-text-secondary font-bold">
                  {selectedPlace.category}
                </span>
                <span className="text-[11px] font-mono text-[#E0503A] font-bold">
                  {selectedPlace.distance}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gasra-text mt-1">
                {selectedPlace.name}
              </h4>
            </div>

            <span className="w-8 h-8 rounded-xl bg-gasra-surface-subtle flex items-center justify-center text-sm">
              {selectedPlace.type === "deal" ? "🏷️" : selectedPlace.type === "mission" ? "⚡" : "🏪"}
            </span>
          </div>

          <p className="text-xs text-gasra-text-secondary mb-3">
            {selectedPlace.detail}
          </p>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleActionClick}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                raniJayTriggered
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] hover:opacity-95"
              }`}
            >
              {raniJayTriggered ? (
                <>
                  <Check size={14} />
                  <span>{isAr ? "تم إبلاغ المحل بوصولك !" : "Visite signalée !"}</span>
                </>
              ) : (
                <>
                  <Navigation size={14} />
                  <span>
                    {isAr
                      ? selectedPlace.actionText === "Rani jay"
                        ? "راني جاي"
                        : "متابعة"
                      : selectedPlace.actionText}
                  </span>
                </>
              )}
            </button>

            <Link
              to="/commerce"
              className="p-2.5 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text text-xs font-semibold flex items-center gap-1"
            >
              <span>Fiche</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
