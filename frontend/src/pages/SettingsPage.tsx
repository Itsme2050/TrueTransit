import React from 'react';
import { User, Shield, Globe, Lock, Info, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

interface SettingsPageProps {
  onOpenAuth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenAuth }) => {
  const { user, isGuest, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2.5">
          <Shield className="w-7 h-7 text-teal-600" />
          <span>{t('profilePermissionsTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('manageAccountProfile')}
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-400 font-extrabold text-base flex items-center justify-center">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900">{user?.fullName}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            {user?.role || 'TRAVELER'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {isGuest ? (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Sign In or Create Account
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Language Preferences - All 4 Languages: English, Hindi, French, Chinese */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
          <Globe className="w-4 h-4 text-teal-600" />
          <span>{t('languageAndLocalization')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`p-3 rounded-2xl border font-bold flex items-center justify-between transition-all ${
                language === item.code
                  ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.flag}</span>
                <div className="text-left">
                  <div className="font-extrabold text-slate-900">{item.native}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{item.label}</div>
                </div>
              </div>
              {language === item.code && <CheckCircle className="w-4 h-4 text-teal-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy by Design & Data Transparency */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-xs leading-relaxed text-slate-600">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-teal-600" />
          <span>{t('privacyByDesign')}</span>
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Zero Secret Bundling:</strong> {t('zeroSecretBundling')}</li>
          <li><strong>Ephemeral Geolocation:</strong> GPS coordinates are processed exclusively on-the-fly for distance queries and are never persisted to tracking databases.</li>
          <li><strong>Local Fallbacks:</strong> Full mathematical routing and price checks continue to operate even when offline or disconnected.</li>
        </ul>
      </div>

    </div>
  );
};
