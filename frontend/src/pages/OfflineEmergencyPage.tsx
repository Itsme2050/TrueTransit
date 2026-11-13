import React, { useState } from 'react';
import { AlertTriangle, Phone, Hospital, ShieldCheck, RefreshCw, CheckCircle, Wifi, WifiOff, MapPin } from 'lucide-react';
import { useOffline } from '../context/OfflineContext';

export const OfflineEmergencyPage: React.FC = () => {
  const { isOnline, isSimulatedOffline, effectiveOnline, pendingCount, syncNow, lastSyncedAt, offlinePack } = useOffline();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncing(true);
    const res = await syncNow();
    setSyncMessage(res.message);
    setSyncing(false);
    setTimeout(() => setSyncMessage(null), 5000);
  };

  const emergencyContacts = [
    { name: 'National All-in-One Emergency', number: '112', type: 'Police / Fire / Ambulance', color: 'rose' },
    { name: 'Delhi Police Women Helpline', number: '1091', type: 'Immediate Response Unit', color: 'amber' },
    { name: 'Delhi Tourist Police Headquarters', number: '8750871111', type: 'Visitor Assistance', color: 'teal' },
    { name: 'CATS Govt Ambulance Dispatch', number: '102', type: 'Medical First Responders', color: 'blue' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2.5">
          <AlertTriangle className="w-7 h-7 text-rose-600" />
          <span>Offline Emergency SOS &amp; Panic Sync</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Zero-data resilience: direct dialing, pre-cached medical institutions, and queued synchronization.
        </p>
      </div>

      {/* Connectivity & Sync Status Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${effectiveOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {effectiveOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {effectiveOnline ? 'Live Data Connection Active' : 'Offline Mode (Local Storage Protocol)'}
            </div>
            <div className="text-xs text-slate-500">
              {pendingCount > 0
                ? `${pendingCount} community observation(s) queued locally for upload`
                : 'All local records synchronized with central registry'}
              {lastSyncedAt && ` • Last synced at ${lastSyncedAt}`}
            </div>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing || !effectiveOnline}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
            effectiveOnline
              ? 'bg-slate-900 hover:bg-slate-800 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing Queue...' : 'Synchronize Now'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Emergency Hotlines Cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Emergency Speed Dials (Works without mobile data)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="text-[11px] font-bold text-slate-500">{contact.type}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{contact.number}</div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">{contact.name}</div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-rose-600 pt-2 border-t border-slate-100">
                <span>Tap to Call</span>
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Pre-cached Verified Emergency Facilities */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Pre-Cached Verified Facilities (Delhi Offline Pack)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Hospital (24 Hours)
              </span>
              <a href="tel:01126588500" className="text-xs font-bold text-teal-700 hover:underline">011-26588500</a>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">AIIMS Apex Trauma &amp; Emergency Wing</h3>
            <p className="text-xs text-slate-600">Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029</p>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lat: 28.5672, Lng: 77.2100 • Direct Yellow Line Metro Access</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Hospital (24 Hours)
              </span>
              <a href="tel:01126165060" className="text-xs font-bold text-teal-700 hover:underline">011-26165060</a>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Safdarjung Hospital Emergency Care</h3>
            <p className="text-xs text-slate-600">Ring Road, Opposite AIIMS, New Delhi 110029</p>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lat: 28.5705, Lng: 77.2072 • Govt Comprehensive Care</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Police Station (24 Hours)
              </span>
              <a href="tel:112" className="text-xs font-bold text-rose-700 hover:underline">112 / Station Desk</a>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Connaught Place Police Station</h3>
            <p className="text-xs text-slate-600">Baba Kharak Singh Marg, Connaught Place, New Delhi 110001</p>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lat: 28.6295, Lng: 77.2140 • 24/7 Patrol &amp; PCR Booth</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                24/7 Pharmacy
              </span>
              <a href="tel:18605000101" className="text-xs font-bold text-blue-700 hover:underline">1860-500-0101</a>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Apollo 24/7 Pharmacy - Connaught Place</h3>
            <p className="text-xs text-slate-600">Block E, Radial Road 3, Connaught Place, New Delhi</p>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lat: 28.6330, Lng: 77.2190 • Emergency medicines &amp; first aid</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
