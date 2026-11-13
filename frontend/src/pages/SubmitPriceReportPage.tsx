import React, { useState } from 'react';
import { Tag, PlusCircle, CheckCircle, AlertTriangle, Upload, X } from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { useOffline } from '../context/OfflineContext';

interface SubmitPriceReportPageProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const SubmitPriceReportPage: React.FC<SubmitPriceReportPageProps> = ({ onClose, onSuccess }) => {
  const { effectiveOnline, queuePriceReport } = useOffline();
  const [category, setCategory] = useState('TRANSPORT');
  const [itemName, setItemName] = useState('Delhi Auto-Rickshaw Ride');
  const [localityName, setLocalityName] = useState('Connaught Place');
  const [quotedPrice, setQuotedPrice] = useState<string>('');
  const [paidPrice, setPaidPrice] = useState<string>('');
  const [vendorName, setVendorName] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotedPrice || Number(quotedPrice) <= 0) {
      alert('Please enter a valid quoted price.');
      return;
    }

    setLoading(true);
    const reportData = {
      category,
      itemName,
      localityName,
      quotedPrice: Number(quotedPrice),
      paidPrice: paidPrice ? Number(paidPrice) : undefined,
      vendorName: vendorName || undefined,
      notes: notes || undefined,
      receiptUrl: receiptUrl || undefined,
    };

    if (!effectiveOnline) {
      // Offline mode: queue in localStorage
      queuePriceReport(reportData);
      setFeedback({
        success: true,
        message: 'Observation saved offline! It will automatically sync when connectivity returns.',
      });
      setLoading(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
      return;
    }

    try {
      const res = await ApiClient.submitPriceReport(reportData);
      setFeedback({
        success: true,
        message: res.message || 'Price observation submitted successfully!',
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || 'Failed to submit report. Please check input.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Report Local Price Observation</h2>
            <p className="text-xs text-slate-500">Help protect fellow travelers against overcharging</p>
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
            <label className="font-semibold text-slate-700 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            >
              <option value="TRANSPORT">Local Transport (Auto/Taxi)</option>
              <option value="FOOD">Street Food &amp; Dining</option>
              <option value="COMMODITY">Packaged Goods (Water/SIM)</option>
              <option value="SERVICE">Local Services</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Locality</label>
            <input
              type="text"
              value={localityName}
              onChange={(e) => setLocalityName(e.target.value)}
              placeholder="e.g. Connaught Place, Paharganj"
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Item / Service Description</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Auto to India Gate, 1L Water Bottle"
            required
            className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Quoted Price (₹ INR)*</label>
            <input
              type="number"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              placeholder="e.g. 150"
              required
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Actual Paid Price (₹ INR)</label>
            <input
              type="number"
              value={paidPrice}
              onChange={(e) => setPaidPrice(e.target.value)}
              placeholder="e.g. 70 (after meter/negotiation)"
              className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Vendor / Vehicle Number (Optional)</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g. Auto DL 1R 8832, Paharganj Corner Stall"
            className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Notes / Encounter Details</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Helpful details: e.g. Driver initially refused meter, agreed after showing tariff."
            className="w-full font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all shadow-md active:scale-98"
        >
          {loading ? 'Submitting Report...' : effectiveOnline ? 'Submit Price Observation' : 'Save Offline (Sync on Connect)'}
        </button>
      </form>
    </div>
  );
};
