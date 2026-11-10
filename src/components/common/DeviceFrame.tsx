import React from "react";
import { useApp } from "../../context/AppContext";
import { Smartphone, Monitor } from "lucide-react";

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileOnly?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileOnly = true }) => {
  const { deviceMode, setDeviceMode } = useApp();

  // If mode is responsive (desktop full width):
  if (deviceMode === "responsive") {
    return (
      <div className="w-full min-h-[calc(100vh-3.5rem)] max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    );
  }

  // If deviceMode is mobile-frame on desktop:
  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] py-4 sm:py-8 flex flex-col items-center justify-center bg-slate-100/70 dark:bg-[#07151B]/80 px-2">
      {/* Device frame header indicator */}
      <div className="hidden lg:flex items-center gap-3 mb-3 text-xs text-gasra-text-muted">
        <span className="flex items-center gap-1.5 font-medium">
          <Smartphone size={14} />
          Cadre mobile iPhone 14 (390 × 844)
        </span>
        <button
          onClick={() => setDeviceMode("responsive")}
          className="underline hover:text-gasra-text transition-colors flex items-center gap-1"
        >
          <Monitor size={12} />
          Passer en plein écran
        </button>
      </div>

      {/* Realistic Phone Bezel */}
      <div
        className="w-full max-w-[390px] h-[844px] max-h-[92vh] bg-gasra-bg rounded-[44px] shadow-2xl border-[9px] border-[#18262D] dark:border-[#0E1A20] overflow-hidden flex flex-col relative ring-1 ring-black/10"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Notch / Dynamic Island */}
        <div className="w-full h-8 bg-transparent flex items-center justify-center pt-2 relative z-50 shrink-0 select-none">
          <div className="w-28 h-4 bg-black rounded-full flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111]" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 w-full overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full h-5 bg-gasra-bg flex items-center justify-center pb-1 shrink-0 z-50">
          <div className="w-32 h-1 bg-gasra-text-muted/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
