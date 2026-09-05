import React, { useState } from 'react';
import {
  Settings,
  Database,
  Trash2,
  Sparkles,
  Server,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Code2
} from 'lucide-react';
import { useFinance, CURRENCY_SYMBOLS } from '../context/FinanceContext.jsx';

export const SettingsPage = () => {
  const {
    currency,
    setCurrency,
    handleLoadDemoData,
    handleResetData,
    loading,
    dashboardData
  } = useFinance();

  const [resetMessage, setResetMessage] = useState('');
  const [loadMessage, setLoadMessage] = useState('');

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to clear all transactions and reset data?')) return;
    const res = await handleResetData();
    if (res.success) {
      setResetMessage('All transaction records cleared.');
      setTimeout(() => setResetMessage(''), 3000);
    }
  };

  const handleLoadDemo = async () => {
    const res = await handleLoadDemoData();
    if (res.success) {
      setLoadMessage('Demo dataset loaded successfully!');
      setTimeout(() => setLoadMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Platform Settings & Buildathon Demo Manager
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure currency defaults, monitor database and AI provider statuses, or reset sample data.
        </p>
      </div>

      {/* Demo Data Management Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white font-display">
            Buildathon Demo Dataset Controller
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Populate a 3-month realistic business transaction dataset containing salaries, marketing scaling, AWS cloud infrastructure spike anomaly (₹42,000 vs. avg ₹8,500), duplicate charges, and client retainers.
        </p>

        {loadMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{loadMessage}</span>
          </div>
        )}

        {resetMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{resetMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleLoadDemo}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Populating Records...' : 'Load 3-Month Demo Dataset'}
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Reset / Clear Transactions
          </button>
        </div>
      </div>

      {/* Currency & Localization Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white font-display">
            Currency & Locale Configuration
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Select display currency for financial metrics, charts, and AI reports.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {Object.entries(CURRENCY_SYMBOLS).map(([key, sym]) => (
            <button
              key={key}
              onClick={() => setCurrency(key)}
              className={`p-3 rounded-xl border text-center transition-all ${
                currency === key
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-lg font-bold font-mono block">{sym}</span>
              <span className="text-xs font-semibold uppercase">{key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System & Architecture Status Monitor */}
      <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2.5">
          <Server className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white font-display">
            System & Architecture Status
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Database Layer</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {dashboardData?.system?.database?.mode || 'High-Speed Memory Store Active'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Code2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">AI Intelligence Core</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Gemini 1.5 Flash + Grounded Statistical Engine
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
