import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, X, MapPin } from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { useOffline } from '../context/OfflineContext';

interface SubmitSafetyReportPageProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const SubmitSafetyReportPage: React.FC<SubmitSafetyReportPageProps> = ({ onClose, onSuccess }) => {
  const { effectiveOnline, queueSafetyReport } = useOffline();
  const [category, setCategory] = useState<'POOR_LIGHTING' | 'ISOLATED_AREA' | 'HARASSMENT' | 'INFRASTRUCTURE_HAZARD' | 'SCAM_HOTSPOT'>('POOR_LIGHTING');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [localityName, setLocalityName] = useState('Paharganj');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(28.6432);
  const [lng, setLng] = useState(77.2135);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || description.trim().length < 5) {
      alert('Please provide a brief description (at least 5 characters).');
      return;
    }

    setLoading(true);
    const reportData = {
      category,
      severity,
      localityName,
      description,
      latitude: lat,
      longitude: lng,
    };

    if (!effectiveOnline) {
      queueSafetyReport(reportData);
      setFeedback({
        success: true,
        message: 'Safety report saved offline! Will synchronize automatically when connected.',
      });
      setLoading(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
      return;
    }

    try {
      const res = await ApiClient.submitSafetyReport(reportData);
      setFeedback({
        success: true,
        message: res.message || 'Safety observation logged successfully!',
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || 'Failed to submit safety report.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Report Safety Observation</h2>
            <p className="text-xs text-slate-500">Provide anonymous, constructive street infrastructure notes</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
            feedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {feedback.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observation Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            >
              <option value="POOR_LIGHTING">Poor Street Lighting / Dark Corridor</option>
              <option value="ISOLATED_AREA">Isolated / Abandoned Enclave</option>
              <option value="SCAM_HOTSPOT">Aggressive Tout / Scam Concentration</option>
              <option value="INFRASTRUCTURE_HAZARD">Open Pit / Broken Sidewalk / Road Hazard</option>
              <option value="HARASSMENT">Catcalling / Harassment Incident</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Concern Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            >
              <option value="LOW">Low (Minor inconvenience / dim bulb)</option>
              <option value="MEDIUM">Medium (Caution advised after dark)</option>
              <option value="HIGH">High (Avoid late at night)</option>
              <option value="CRITICAL">Critical (Urgent alert)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Locality Name</label>
          <input
            type="text"
            value={localityName}
            onChange={(e) => setLocalityName(e.target.value)}
            placeholder="e.g. Paharganj Main Bazaar, New Delhi Station Gate 2"
            required
            className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Observation Description*</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe condition: e.g. Street lamp broken outside station back alley; multiple unofficial touts misleading arriving passengers."
            required
            className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center space-x-2 text-[11px]">
          <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)} (Geotagged with municipal precision)</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md active:scale-98"
        >
          {loading ? 'Submitting Report...' : effectiveOnline ? 'Submit Safety Observation' : 'Save Offline (Sync on Connect)'}
        </button>
      </form>
    </div>
  );
};
