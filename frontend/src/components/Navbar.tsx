import React, { useState, useRef, useEffect } from 'react';
import { Shield, Wifi, WifiOff, Globe, AlertTriangle, UserCheck, RefreshCw, Smartphone, Monitor, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useLanguage, LANGUAGES, Language } from '../context/LanguageContext';

interface NavbarProps {
  onOpenSOS: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode?: 'wide' | 'phone';
  onToggleViewMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSOS,
  activeTab,
  setActiveTab,
  viewMode = 'wide',
  onToggleViewMode,
}) => {
  const { user, isGuest, isAdmin } = useAuth();
  const { effectiveOnline, isSimulatedOffline, toggleSimulatedOffline, pendingCount, syncNow } = useOffline();
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSync = async () => {
    const res = await syncNow();
    alert(res.message);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                  TrueTransit
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded">
                  {t('cityDelhi')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Center Navigation Links for Desktop (only if wide mode or desktop screen) */}
          {viewMode === 'wide' && (
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t('dashboard')}
              </button>
              <button
                onClick={() => setActiveTab('price-check')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'price-check' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t('priceCheck')}
              </button>
              <button
                onClick={() => setActiveTab('safety-map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'safety-map' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t('safetyMap')}
              </button>
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'itinerary' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t('smartItinerary')}
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {t('adminModeration')}
                </button>
              )}
            </nav>
          )}

          {/* Right Action Icons: Phone/Wide Mode, Offline Sim, Sync, Multi-Language, SOS */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* View Mode Switcher (Phone / Wide) */}
            {onToggleViewMode && (
              <button
                onClick={onToggleViewMode}
                title={viewMode === 'wide' ? 'Switch to Phone View (Mobile Mockup)' : 'Switch to Wide Desktop View'}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border-teal-500/40 text-teal-300 hover:from-teal-500/20 hover:to-indigo-500/20"
              >
                {viewMode === 'wide' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                    <span className="hidden sm:inline">{t('phoneView')}</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">{t('wideView')}</span>
                  </>
                )}
              </button>
            )}

            {/* Offline Simulation Toggle Badge */}
            <button
              onClick={toggleSimulatedOffline}
              title={isSimulatedOffline ? 'Simulating Offline Mode (Click to connect)' : 'Live Online (Click to simulate offline)'}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                effectiveOnline
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              {effectiveOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t('online')}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">{t('offlineSim')}</span>
                </>
              )}
            </button>

            {/* Sync Pending Badge if queued items exist */}
            {pendingCount > 0 && (
              <button
                onClick={handleSync}
                className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all animate-pulse"
                title="Pending offline reports ready to sync"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{pendingCount}</span>
              </button>
            )}

            {/* Multi-Language Dropdown Selector (English, हिन्दी, Français, 中文) */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/80 bg-slate-800/50"
                title="Select Language (English, हिन्दी, Français, 中文)"
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="hidden sm:inline text-xs font-bold ml-1">{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 mb-1">
                    {t('languageAndLocalization')}
                  </div>
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors ${
                        language === item.code
                          ? 'bg-teal-600/30 text-teal-300 font-bold border-l-2 border-teal-400'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{item.flag}</span>
                        <span>{item.native}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">({item.label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* One-Tap Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t('sos')}</span>
            </button>

            {/* User / Settings Profile Pill */}
            <button
              onClick={() => setActiveTab('settings')}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={user?.email}
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
