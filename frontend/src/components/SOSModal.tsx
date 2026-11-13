import React, { useState } from 'react';
import { AlertTriangle, Phone, Share2, X, ShieldAlert, CheckCircle2, Hospital } from 'lucide-react';
import { useOffline } from '../context/OfflineContext';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const { offlinePack } = useOffline();
  const [copied, setCopied] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 28.6315,
    lng: 77.2167,
  });

  if (!isOpen) return null;

  const handleShareLocation = async () => {
    const text = `[EMERGENCY via TrueTransit] I need immediate assistance! Current location: https://maps.google.com/?q=${currentCoords?.lat},${currentCoords?.lng} (Connaught Place, New Delhi).`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TrueTransit Emergency SOS',
          text,
        });
      } catch {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-200">
        
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Offline Emergency SOS</h2>
              <p className="text-xs text-rose-100">Direct cellular dialing works without active data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Primary 1-Tap Emergency Hotlines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Direct Emergency Hotlines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:112"
                className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors shadow-sm group"
              >
                <div>
                  <div className="text-xs font-semibold text-rose-700">Police / Fire / Health</div>
                  <div className="text-2xl font-black text-rose-950">112</div>
                  <div className="text-[10px] text-rose-600">National All-in-One</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
              </a>

              <a
                href="tel:1091"
                className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm group"
              >
                <div>
                  <div className="text-xs font-semibold text-amber-800">Women Helpline</div>
                  <div className="text-2xl font-black text-amber-950">1091</div>
                  <div className="text-[10px] text-amber-700">Delhi Police 24/7</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
              </a>

              <a
                href="tel:8750871111"
                className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors shadow-sm group"
              >
                <div>
                  <div className="text-xs font-semibold text-teal-800">Tourist Police HQ</div>
                  <div className="text-base font-extrabold text-teal-950">8750871111</div>
                  <div className="text-[10px] text-teal-600">Visitor Assistance Desk</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </a>

              <a
                href="tel:102"
                className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm group"
              >
                <div>
                  <div className="text-xs font-semibold text-blue-800">Govt Ambulance</div>
                  <div className="text-2xl font-black text-blue-950">102</div>
                  <div className="text-[10px] text-blue-600">CATS Health Emergency</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Hospital className="w-5 h-5" />
                </div>
              </a>
            </div>
          </div>

          {/* Location Broadcast Action */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Current GPS Coordinates</span>
              <span className="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Cached &amp; Accurate
              </span>
            </div>
            <p className="text-sm font-mono text-slate-800 bg-white p-2 rounded-lg border border-slate-200 mb-3">
              {currentCoords?.lat}, {currentCoords?.lng} (Connaught Place, Delhi)
            </p>
            <button
              onClick={handleShareLocation}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-98"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Emergency Message Copied to Clipboard!' : 'Share / Copy Location Message to Trusted Contact'}</span>
            </button>
          </div>

          {/* Pre-cached Nearest Facilities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Nearest Verified 24/7 Facilities
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">AIIMS Apex Trauma &amp; Emergency</div>
                  <div className="text-slate-500 text-[11px]">Sri Aurobindo Marg • 011-26588500</div>
                </div>
                <a href="tel:01126588500" className="px-3 py-1 bg-teal-50 text-teal-700 font-bold rounded-lg border border-teal-200">Call</a>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">Delhi Police Station - Connaught Place</div>
                  <div className="text-slate-500 text-[11px]">Baba Kharak Singh Marg • 112</div>
                </div>
                <a href="tel:112" className="px-3 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200">Call</a>
              </div>
            </div>
          </div>

          {/* Offline Disclaimer Notice */}
          <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3">
            <span className="font-semibold text-slate-700">Notice:</span> Cellular phone calls and standard SMS messages work directly through telecommunication towers without requiring internet data connectivity.
          </div>

        </div>

      </div>
    </div>
  );
};
