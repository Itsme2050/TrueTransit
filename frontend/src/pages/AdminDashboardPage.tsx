import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw, BarChart3, Users, Tag, ShieldAlert } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [reports, setReports] = useState<{ priceReports: any[]; safetyReports: any[] }>({
    priceReports: [],
    safetyReports: [],
  });
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, reportsRes] = await Promise.all([
        ApiClient.getAdminOverview(),
        ApiClient.getAdminReports(),
      ]);
      if (overviewRes.data) setMetrics(overviewRes.data);
      if (reportsRes.data) setReports(reportsRes.data);
    } catch (err: any) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModeratePrice = async (id: string, action: 'APPROVED' | 'REJECTED' | 'EXPIRED') => {
    try {
      await ApiClient.moderatePriceReport(id, action);
      setActionMessage(`Price report ${action.toLowerCase()} successfully.`);
      fetchData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(`Moderation failed: ${err.message}`);
    }
  };

  const handleModerateSafety = async (id: string, action: 'ACTIVE' | 'RESOLVED' | 'REJECTED') => {
    try {
      await ApiClient.moderateSafetyReport(id, action);
      setActionMessage(`Safety report updated to ${action}.`);
      fetchData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(`Moderation failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2.5">
            <ShieldCheck className="w-7 h-7 text-teal-600" />
            <span>Admin Moderation &amp; Quality Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review community price reports, inspect outliers, resolve safety reports, and monitor system health.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Analytics Overview Cards */}
      {metrics?.overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Users</div>
              <div className="text-xl font-black text-slate-900">{metrics.overview.totalRegisteredUsers}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Price Submissions</div>
              <div className="text-xl font-black text-slate-900">{metrics.overview.totalCommunityPriceReports}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Safety Notes</div>
              <div className="text-xl font-black text-slate-900">{metrics.overview.totalSafetyReports}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">System State</div>
              <div className="text-xs font-bold text-emerald-700">{metrics.overview.systemHealth}</div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Price Reports */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-teal-600" />
              <span>Pending Price Observations ({reports.priceReports.length})</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-400">Outlier Protected</span>
          </div>

          {reports.priceReports.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No pending price submissions requiring moderation.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.priceReports.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{item.itemName}</span>
                      <div className="text-[11px] text-slate-500">{item.locality?.name || 'Delhi'}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.isOutlier ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {item.isOutlier ? 'Outlier Flagged' : 'Within Margin'}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-700 font-mono">
                    <span>Quoted: <strong className="text-slate-900">₹{item.quotedPrice}</strong></span>
                    {item.paidPrice && <span>Paid: <strong className="text-slate-900">₹{item.paidPrice}</strong></span>}
                  </div>

                  {item.notes && <p className="text-[11px] text-slate-600 italic">"{item.notes}"</p>}

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleModeratePrice(item.id, 'APPROVED')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleModeratePrice(item.id, 'REJECTED')}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Safety Reports */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Active Safety Incidents ({reports.safetyReports.length})</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-400">Community Reviewed</span>
          </div>

          {reports.safetyReports.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No active safety concerns currently logged.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.safetyReports.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 capitalize">{item.category.replace('_', ' ')}</span>
                      <div className="text-[11px] text-slate-500">{item.localityName || 'Delhi'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed">{item.description}</p>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleModerateSafety(item.id, 'RESOLVED')}
                      className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                    <button
                      onClick={() => handleModerateSafety(item.id, 'REJECTED')}
                      className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
