import React, { useState, useEffect } from 'react';
import { ShieldCheck, Tag, Route, Sparkles, AlertTriangle, ArrowRight, MapPin, Clock, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';
import { ApiClient } from '../services/apiClient';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenSOS: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, onOpenSOS }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { effectiveOnline } = useOffline();

  // Live chrono-safety status for user's locality
  const [safetyZone, setSafetyZone] = useState<{ level: string; score: number } | null>(null);
  const [safetyLoading, setSafetyLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ApiClient.getHeatmap(new Date().getHours())
      .then((res: any) => {
        if (cancelled) return;
        const zone = (res.geoJson?.features ?? []).find((f: any) =>
          String(f.properties?.name || '').includes('Connaught Place')
        );
        if (zone) {
          setSafetyZone({
            level: zone.properties.level,
            score: zone.properties.safetyScore,
          });
        }
        setSafetyLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setSafetyZone(null);
          setSafetyLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getSafetyStatusLabel = () => {
    if (safetyLoading) return t('loadingLocalStatus');
    if (!safetyZone) return t('unavailableOffline');
    const levelKey =
      safetyZone.level === 'LOWER_CONCERN'
        ? 'lowerConcern'
        : safetyZone.level === 'CAUTION'
        ? 'cautionAdvised'
        : 'elevatedConcern';
    const scoreWord = language === 'hi' ? 'स्कोर' : 'Score';
    return `${t(levelKey)} (${scoreWord}: ${safetyZone.score}/100)`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>{t('activeCityBanner')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {user?.fullName ? `${t('welcomeGreeting')}${user.fullName}!` : t('welcomeUser')}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mb-6">
            {t('welcomeSubtitle')}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('price-check')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/30 transition-all active:scale-95"
            >
              <Tag className="w-4 h-4" />
              <span>{t('checkFairPriceBtn')}</span>
            </button>
            <button
              onClick={() => onNavigate('safety-map')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all active:scale-95"
            >
              <Route className="w-4 h-4" />
              <span>{t('exploreSafeRoutesBtn')}</span>
            </button>
            <button
              onClick={onOpenSOS}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t('emergencySOSBtn')}</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('currentLocality')}</div>
            <div className="text-sm font-bold text-slate-900">{t('connaughtPlaceCentral')}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('chronoSafetyStatus')}</div>
            <div className="text-sm font-bold text-slate-900">{getSafetyStatusLabel()}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
          <div className={`p-3 rounded-xl ${effectiveOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">{t('connectivityCache')}</div>
            <div className="text-sm font-bold text-slate-900">
              {effectiveOnline ? t('liveSynchronized') : t('offlineModeCache')}
            </div>
          </div>
        </div>
      </div>

      {/* Core Feature Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module A: Anti-Scam Price Index */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Tag className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                {t('officialTariffsBadge')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">{t('antiScamTitle')}</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('antiScamDesc')}
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-4 space-y-1">
              <div className="flex justify-between font-medium">
                <span>{t('delhiAutoBase')}</span>
                <span className="font-bold text-slate-900">₹30</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{t('autoRateThereafter')}</span>
                <span className="font-bold text-slate-900">{language === 'hi' ? '₹11 / किमी' : '₹11 / km'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{t('nightSurchargeRow')}</span>
                <span className="font-bold text-slate-900">+25%</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('price-check')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            <span>{t('launchPriceCalculatorBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module B: Chrono-Safety Heatmap */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {t('timeSliderBadge')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">{t('chronoSafetyTitle')}</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('chronoSafetyDesc')}
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-4 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="font-medium">{t('safestRouteSnippet')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-medium">{t('fastestRouteSnippet')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('safety-map')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors"
          >
            <span>{t('openInteractiveMapBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module C: Gemini Smart Itinerary */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                {t('aiBudgetBadge')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">{t('smartPlannerTitle')}</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('smartPlannerDesc')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('itinerary')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            <span>{t('planItineraryBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module D: Offline Panic Assistance */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                {t('offlineResilienceBadge')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">{t('offlineSOSCardTitle')}</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('offlineSOSCardDesc')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('emergency')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
          >
            <span>{t('openEmergencyHubBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Responsible AI & Transparency Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start space-x-3">
        <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>{t('productPrincipleBadge')}</strong> {t('productPrincipleDesc')}
        </p>
      </div>

    </div>
  );
};
