import React from 'react';
import { LayoutDashboard, Tag, ShieldAlert, Sparkles, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSOS: () => void;
  isPhoneFrame?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOS,
  isPhoneFrame = false,
}) => {
  const { t } = useLanguage();

  const containerClass = isPhoneFrame
    ? 'absolute bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-3 flex items-center justify-around shadow-2xl rounded-b-[42px]'
    : 'md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 py-2 px-3 flex items-center justify-around shadow-2xl';

  return (
    <div className={containerClass}>
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
          activeTab === 'dashboard' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('home')}</span>
      </button>

      <button
        onClick={() => setActiveTab('price-check')}
        className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
          activeTab === 'price-check' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Tag className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('prices')}</span>
      </button>

      {/* Prominent SOS in Center */}
      <button
        onClick={onOpenSOS}
        className="flex flex-col items-center justify-center -mt-5 bg-rose-600 text-white rounded-full w-12 h-12 shadow-lg shadow-rose-600/40 border-2 border-slate-900 active:scale-95 transition-transform"
      >
        <PhoneCall className="w-5 h-5" />
        <span className="text-[9px] font-bold">{t('sos')}</span>
      </button>

      <button
        onClick={() => setActiveTab('safety-map')}
        className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
          activeTab === 'safety-map' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ShieldAlert className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('safety')}</span>
      </button>

      <button
        onClick={() => setActiveTab('itinerary')}
        className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
          activeTab === 'itinerary' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('planner')}</span>
      </button>
    </div>
  );
};
