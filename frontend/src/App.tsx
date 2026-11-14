import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SOSModal } from './components/SOSModal';
import { HomeDashboard } from './pages/HomeDashboard';
import { PriceCheckPage } from './pages/PriceCheckPage';
import { SafetyMapPage } from './pages/SafetyMapPage';
import { ItineraryPlannerPage } from './pages/ItineraryPlannerPage';
import { OfflineEmergencyPage } from './pages/OfflineEmergencyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { SubmitPriceReportPage } from './pages/SubmitPriceReportPage';
import { SubmitSafetyReportPage } from './pages/SubmitSafetyReportPage';
import { AuthPage } from './pages/AuthPage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isPriceReportOpen, setIsPriceReportOpen] = useState<boolean>(false);
  const [isSafetyReportOpen, setIsSafetyReportOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const { t } = useLanguage();

  const renderPersistentPages = () => (
    <>
      <div className={activeTab === 'dashboard' ? 'contents' : 'hidden'}>
        <HomeDashboard
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenSOS={() => setIsSOSOpen(true)}
        />
      </div>

      <div className={activeTab === 'price-check' ? 'contents' : 'hidden'}>
        <PriceCheckPage onOpenReportModal={() => setIsPriceReportOpen(true)} />
      </div>

      <div className={activeTab === 'safety-map' ? 'contents' : 'hidden'}>
        <SafetyMapPage
          onOpenReportModal={() => setIsSafetyReportOpen(true)}
          isActive={activeTab === 'safety-map'}
        />
      </div>

      <div className={activeTab === 'itinerary' ? 'contents' : 'hidden'}>
        <ItineraryPlannerPage />
      </div>

      <div className={activeTab === 'emergency' ? 'contents' : 'hidden'}>
        <OfflineEmergencyPage />
      </div>

      <div className={activeTab === 'admin' ? 'contents' : 'hidden'}>
        <AdminDashboardPage />
      </div>

      <div className={activeTab === 'settings' ? 'contents' : 'hidden'}>
        <SettingsPage onOpenAuth={() => setIsAuthOpen(true)} />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      <Navbar
        onOpenSOS={() => setIsSOSOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-10">
        {renderPersistentPages()}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* Global Modals */}
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />

      {isPriceReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <SubmitPriceReportPage
            onClose={() => setIsPriceReportOpen(false)}
            onSuccess={() => setIsPriceReportOpen(false)}
          />
        </div>
      )}

      {isSafetyReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <SubmitSafetyReportPage
            onClose={() => setIsSafetyReportOpen(false)}
            onSuccess={() => setIsSafetyReportOpen(false)}
          />
        </div>
      )}

      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <AuthPage
            onClose={() => setIsAuthOpen(false)}
            onSuccess={() => setIsAuthOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
        <LanguageProvider>
          <LocationProvider>
            <AppContent />
          </LocationProvider>
        </LanguageProvider>
      </OfflineProvider>
    </AuthProvider>
  );
}
