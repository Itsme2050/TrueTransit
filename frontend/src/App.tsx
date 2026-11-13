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
import { Smartphone, Monitor, Wifi, BatteryCharging } from 'lucide-react';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'wide' | 'phone'>(() => {
    return (localStorage.getItem('truetransit_view_mode') as 'wide' | 'phone') || 'wide';
  });
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isPriceReportOpen, setIsPriceReportOpen] = useState<boolean>(false);
  const [isSafetyReportOpen, setIsSafetyReportOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const { t } = useLanguage();

  const toggleViewMode = () => {
    const nextMode = viewMode === 'wide' ? 'phone' : 'wide';
    setViewMode(nextMode);
    localStorage.setItem('truetransit_view_mode', nextMode);
  };

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
    <div className="min-h-screen bg-slate-900 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Floating View Switcher Bar for Presentation to Judges */}
      <div className="sticky top-0 z-[60] bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-300 py-1.5 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">TrueTransit Presentation Mode:</span>
          <span className="text-slate-400 hidden sm:inline">
            {viewMode === 'phone' ? '📱 Mobile Smartphone View (390×844 Frame)' : '🖥️ Wide Desktop View'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setViewMode('wide');
              localStorage.setItem('truetransit_view_mode', 'wide');
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'wide'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{t('wideView')}</span>
          </button>

          <button
            onClick={() => {
              setViewMode('phone');
              localStorage.setItem('truetransit_view_mode', 'phone');
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'phone'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('phoneView')}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Phone Device Frame View */}
      {viewMode === 'phone' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-[calc(100vh-40px)]">
          
          {/* Smartphone Mockup Frame */}
          <div className="w-full max-w-[420px] h-[860px] max-h-[92vh] rounded-[48px] bg-slate-900 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-700/80 ring-2 ring-slate-600/40 relative flex flex-col">
            
            {/* Phone Top Notch / Dynamic Island */}
            <div className="relative z-50 flex items-center justify-between px-6 pt-1 pb-1 text-white select-none">
              <span className="text-[12px] font-black tracking-tight">09:41</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 space-x-1 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="flex items-center space-x-1.5 text-slate-300">
                <span className="text-[10px] font-extrabold">5G</span>
                <Wifi className="w-3.5 h-3.5 text-slate-300" />
                <div className="w-5 h-2.5 border border-slate-300 rounded-sm p-0.5 flex items-center">
                  <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Inner Mobile Screen Canvas */}
            <div className="flex-1 rounded-[36px] overflow-hidden bg-slate-50 relative flex flex-col border border-slate-800 shadow-inner">
              
              {/* Compact Header for Phone Frame */}
              <Navbar
                onOpenSOS={() => setIsSOSOpen(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewMode={viewMode}
                onToggleViewMode={toggleViewMode}
              />

              {/* Scrollable Mobile App Body */}
              <main className="flex-1 overflow-y-auto px-3.5 pt-4 pb-24 scroll-smooth">
                {renderPersistentPages()}
              </main>

              {/* Mobile Docked Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenSOS={() => setIsSOSOpen(true)}
                isPhoneFrame={true}
              />

              {/* iOS / Android Home Indicator Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-400/80 rounded-full pointer-events-none z-50" />
            </div>

          </div>

          <p className="text-slate-400 text-xs mt-3 text-center">
            {t('phoneModeActive')} • {t('activeCityBanner')}
          </p>
        </div>
      ) : (
        /* Mode 2: Standard Wide Desktop View */
        <div className="flex-1 flex flex-col bg-slate-50">
          <Navbar
            onOpenSOS={() => setIsSOSOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            onToggleViewMode={toggleViewMode}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-10">
            {renderPersistentPages()}
          </main>

          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSOS={() => setIsSOSOpen(true)}
            isPhoneFrame={false}
          />
        </div>
      )}

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
