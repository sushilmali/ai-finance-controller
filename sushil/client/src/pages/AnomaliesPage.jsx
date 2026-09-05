import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Eye,
  Check,
  Copy
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.jsx';
import { apiClient } from '../api/client.js';
import SeverityBadge from '../components/common/SeverityBadge.jsx';
import CategoryBadge from '../components/common/CategoryBadge.jsx';
import DuplicateReviewModal from '../components/modals/DuplicateReviewModal.jsx';

export const AnomaliesPage = () => {
  const { formatCurrency, refreshDashboard, setIsDuplicateModalOpen } = useFinance();
  const [anomalies, setAnomalies] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [summary, setSummary] = useState({ total: 0, high: 0, medium: 0, low: 0, duplicatesCount: 0 });
  const [severityFilter, setSeverityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAnomalies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.getAnomalies(severityFilter);
      if (res.success) {
        setAnomalies(res.data);
        setDuplicates(res.duplicates || []);
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to fetch anomalies:', err);
    } finally {
      setLoading(false);
    }
  }, [severityFilter]);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  const handleScan = async () => {
    setScanning(true);
    try {
      await apiClient.scanAnomalies();
      await fetchAnomalies();
      await refreshDashboard(false);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await apiClient.updateAnomalyStatus(id, status);
      await fetchAnomalies();
      await refreshDashboard(false);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalFlaggedAmount = anomalies.reduce((acc, a) => acc + (Number(a.transaction?.amount) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              AI Anomaly & Outlier Detection
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statistical deviation models (Z-score + category baselines) combined with AI reasoning to flag unusual charges.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {duplicates.length > 0 && (
            <button
              onClick={() => setIsDuplicateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {duplicates.length} Duplicate Groups
            </button>
          )}

          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Running Statistical Audit...' : 'Re-Scan Transactions'}
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Anomalies</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">{summary.total}</span>
            <span className="text-xs text-slate-500">outlier transactions</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-rose-500/30 backdrop-blur-md">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">High Severity Risk</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-rose-400">{summary.high}</span>
            <span className="text-xs text-slate-500">urgent reviews</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-amber-500/30 backdrop-blur-md">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Medium / Low</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-amber-400">{summary.medium + summary.low}</span>
            <span className="text-xs text-slate-500">moderate alerts</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-indigo-500/30 backdrop-blur-md">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Total Flagged Volume</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-indigo-300 font-mono">
              {formatCurrency(totalFlaggedAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['All', 'High', 'Medium', 'Low'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              severityFilter === sev
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {sev === 'All' ? 'All Severities' : `${sev} Severity`}
          </button>
        ))}
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-400" />
            Analyzing statistical distribution...
          </div>
        ) : anomalies.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0F172A]/90 border border-slate-800 text-center backdrop-blur-md">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h4 className="text-base font-bold text-white font-display">No Anomalies Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All transactions fall within standard mathematical confidence bands.
            </p>
          </div>
        ) : (
          anomalies.map((item) => (
            <div
              key={item._id || item.transactionId}
              className={`p-6 rounded-2xl bg-[#0F172A]/90 border transition-all duration-200 shadow-xl backdrop-blur-md ${
                item.severity === 'High'
                  ? 'border-rose-500/30 hover:border-rose-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="text-base font-bold text-white font-display">
                      {item.transaction?.description}
                    </span>
                    <SeverityBadge severity={item.severity} />
                    <CategoryBadge category={item.transaction?.category} size="sm" />
                    {item.status && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        Status: {item.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span>Date: <strong className="text-slate-200">{new Date(item.transaction?.date || item.createdAt).toLocaleDateString()}</strong></span>
                    <span>•</span>
                    <span>Category Baseline: <strong className="text-slate-200">{formatCurrency(item.historicalAvg)}</strong></span>
                  </div>

                  {/* AI Explanation Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-slate-300 block mb-0.5">Detection Reason:</span>
                      <p className="text-slate-400 leading-relaxed">{item.reason}</p>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400 block mb-0.5">Recommended Controller Action:</span>
                      <p className="text-slate-300 leading-relaxed">{item.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-col sm:items-end justify-between shrink-0 gap-3">
                  <div className="sm:text-right">
                    <span className="text-2xl font-black font-mono text-rose-400">
                      {formatCurrency(item.transaction?.amount)}
                    </span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Flagged Outflow</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'reviewed')}
                      disabled={updatingId === item._id || item.status === 'reviewed'}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors disabled:opacity-50"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      {item.status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'resolved')}
                      disabled={updatingId === item._id || item.status === 'resolved'}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {item.status === 'resolved' ? 'Resolved' : 'Resolve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DuplicateReviewModal duplicates={duplicates} />
    </div>
  );
};

export default AnomaliesPage;
