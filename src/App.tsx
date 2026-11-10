import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { TopNavbar } from "./components/common/TopNavbar";
import { Sidebar } from "./components/common/Sidebar";
import { BottomNav } from "./components/common/BottomNav";
import { PlaystationMirageCanvas } from "./components/common/PlaystationMirageCanvas";
import { MobileMissionsDrawer } from "./components/common/MobileMissionsDrawer";
import { DesktopDock } from "./components/common/DesktopDock";

// Screen Components
import { ScreenOnboarding } from "./components/screens/ScreenOnboarding";
import { ScreenFeed } from "./components/screens/ScreenFeed";
import { ScreenMissions } from "./components/screens/ScreenMissions";
import { ScreenPostDetail } from "./components/screens/ScreenPostDetail";
import { ScreenCreatePost } from "./components/screens/ScreenCreatePost";
import { ScreenProfile } from "./components/screens/ScreenProfile";
import { ScreenExploreMap } from "./components/screens/ScreenExploreMap";
import { ScreenBusiness } from "./components/screens/ScreenBusiness";
import { ScreenGroupsList } from "./components/screens/ScreenGroupsList";
import { ScreenGroupDetail } from "./components/screens/ScreenGroupDetail";
import { ScreenMarketplace } from "./components/screens/ScreenMarketplace";
import { ScreenCity } from "./components/screens/ScreenCity";
import { ScreenMessages } from "./components/screens/ScreenMessages";
import { ScreenFriends } from "./components/screens/ScreenFriends";
import { ScreenPages } from "./components/screens/ScreenPages";
import { ScreenLogin } from "./components/screens/ScreenLogin";
import { ScreenSubscriptions } from "./components/screens/ScreenSubscriptions";
import { ScreenShopManage } from "./components/screens/ScreenShopManage";
import { ScreenInfluencer } from "./components/screens/ScreenInfluencer";
import { ScreenEditProfile } from "./components/screens/ScreenEditProfile";
import { getSessionId } from "./data/accounts";
import { ScreenPageDetail } from "./components/screens/ScreenPageDetail";
import { ScreenNotifications } from "./components/screens/ScreenNotifications";
import { ScreenSettings } from "./components/screens/ScreenSettings";
import { ScreenWallet } from "./components/screens/ScreenWallet";
import { ScreenWebLanding } from "./components/screens/ScreenWebLanding";
import { ScreenWebFeed } from "./components/screens/ScreenWebFeed";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-gasra-text">
      {/* Interactive PlayStation Mirage Flowing Waves Background */}
      {/* Fond animé dans les deux modes (plus présent en clair, voir PlaystationMirageCanvas) */}
      <PlaystationMirageCanvas />

      {/* Top Universal Search & Header Bar */}
      <TopNavbar />

      {/* Main Two-Column Structure: Floating Un-glued Left Sidebar + Scrollable Content */}
      <div className="max-w-6xl w-full mx-auto flex-1 flex px-3 sm:px-5 lg:px-8 py-4 gap-4 lg:gap-6">
        {/* Ordinateur : plus de barre latérale, la navigation est dans le dock en bas (DesktopDock) */}

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-32 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Dock flottant (ordinateur uniquement) */}
      <DesktopDock />

      {/* Tiroir latéral Missions (téléphones uniquement) */}
      <MobileMissionsDrawer />

      {/* Bottom Nav on Mobile devices */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default function App() {
  // Première arrivée (pas de session) → page de connexion
  const signedIn = !!getSessionId();
  return (
    <BrowserRouter>
      <AppProvider>
        {!signedIn ? (
          <ScreenLogin />
        ) : (
        <AppLayout>
          <Routes>
            {/* Primary Feed */}
            <Route path="/" element={<ScreenFeed />} />
            <Route path="/feed" element={<Navigate to="/" replace />} />
            <Route path="/screen/feed" element={<Navigate to="/" replace />} />
            <Route path="/web-feed" element={<Navigate to="/" replace />} />

            {/* Onboarding & Connexion */}
            <Route path="/onboarding" element={<ScreenOnboarding />} />
            <Route path="/connexion" element={<Navigate to="/onboarding" replace />} />
            <Route path="/screen/onboarding" element={<Navigate to="/onboarding" replace />} />

            {/* Post Detail & Comments */}
            <Route path="/post/:id" element={<ScreenPostDetail />} />

            {/* Create Post */}
            <Route path="/creer" element={<ScreenCreatePost />} />
            <Route path="/screen/creer" element={<Navigate to="/creer" replace />} />

            {/* Profile (own and other personas) */}
            <Route path="/profil" element={<ScreenProfile />} />
            <Route path="/profil/modifier" element={<ScreenEditProfile />} />
            <Route path="/abonnements" element={<ScreenSubscriptions />} />
            <Route path="/boutique/gestion" element={<ScreenShopManage />} />
            <Route path="/influenceur" element={<ScreenInfluencer />} />
            <Route path="/profil/:userId" element={<ScreenProfile />} />
            <Route path="/screen/profil" element={<Navigate to="/profil" replace />} />
            <Route path="/amis" element={<ScreenFriends />} />

            {/* Explore, Map & Missions */}
            <Route path="/explorer" element={<ScreenExploreMap />} />
            <Route path="/recherche" element={<Navigate to="/explorer" replace />} />
            <Route path="/screen/explorer" element={<Navigate to="/explorer" replace />} />
            <Route path="/missions" element={<ScreenMissions />} />

            {/* Business / Commerce / Pages */}
            <Route path="/commerce" element={<ScreenBusiness />} />
            <Route path="/commerce/:id" element={<ScreenBusiness />} />
            <Route path="/screen/commerce" element={<Navigate to="/commerce" replace />} />
            <Route path="/pages" element={<ScreenPages />} />
            <Route path="/pages/:id" element={<ScreenPageDetail />} />

            {/* Groups & Community */}
            <Route path="/groupes" element={<ScreenGroupsList />} />
            <Route path="/groupe/:id" element={<ScreenGroupDetail />} />
            <Route path="/communaute" element={<Navigate to="/groupes" replace />} />

            {/* Marketplace */}
            <Route path="/marketplace" element={<ScreenMarketplace />} />
            <Route path="/marketplace/:id" element={<ScreenMarketplace />} />

            {/* City / Ma ville */}
            <Route path="/ville" element={<ScreenCity />} />

            {/* Messaging */}
            <Route path="/messages" element={<ScreenMessages />} />
            <Route path="/messages/:id" element={<ScreenMessages />} />

            {/* Notifications */}
            <Route path="/notifications" element={<ScreenNotifications />} />

            {/* Settings */}
            <Route path="/parametres" element={<ScreenSettings />} />

            {/* Wallet / Portefeuille / Paiements */}
            <Route path="/portefeuille" element={<ScreenWallet />} />
            <Route path="/screen/portefeuille" element={<Navigate to="/portefeuille" replace />} />
            <Route path="/paiements" element={<Navigate to="/portefeuille" replace />} />

            {/* Landing & Web */}
            <Route path="/web" element={<ScreenWebLanding />} />
            <Route path="/accueil" element={<ScreenWebLanding />} />
            <Route path="/screen/web-landing" element={<ScreenWebLanding />} />

            {/* Fallback to Feed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        )}
      </AppProvider>
    </BrowserRouter>
  );
}
