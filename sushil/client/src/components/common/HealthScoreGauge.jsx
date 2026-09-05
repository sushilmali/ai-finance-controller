import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronRight, Activity, TrendingUp, AlertTriangle, Layers } from 'lucide-react';

export const HealthScoreGauge = ({ healthScore = 78, breakdown = null, status = 'Good', summary = '' }) => {
  const [showModal, setShowModal] = useState(false);

  const getScoreColor = (s) => {
    if (s >= 80) return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (s >= 65) return { stroke: '#6366F1', text: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' };
    if (s >= 50) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { stroke: '#F43F5E', text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const theme = getScoreColor(healthScore);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group cursor-pointer relative overflow-hidden rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-md hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Health Score</p>
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-bold font-display ${theme.text}`}>
                {healthScore}
              </span>
              <span className="text-sm text-slate-500 font-medium">/ 100</span>
            </div>
            <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${theme.bg} ${theme.text}`}>
              {status}
            </span>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#1E293B"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <ShieldCheck className={`absolute w-7 h-7 ${theme.text}`} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <span className="truncate">5-Factor Intelligence Algorithm</span>
          <span className="inline-flex items-center text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
            View Breakdown <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-slate-700/80 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  AI Financial Health Score Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Transparent mathematical evaluation across 5 objective financial pillars.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-5 flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-center">
                <span className={`text-4xl font-extrabold font-display ${theme.text}`}>{healthScore}</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Overall</p>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <p className="text-xs text-slate-300 leading-relaxed">
                {summary || 'Your business demonstrates healthy cash margins with controlled expense growth.'}
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Cash Flow Ratio (30% Weight)
                  </span>
                  <span className="font-bold text-white">{breakdown?.cashFlow || 88} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown?.cashFlow || 88}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" /> Expense Control & Margin (25% Weight)
                  </span>
                  <span className="font-bold text-white">{breakdown?.expenseControl || 72} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${breakdown?.expenseControl || 72}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-violet-400" /> Spending Stability & Diversification (20% Weight)
                  </span>
                  <span className="font-bold text-white">{breakdown?.spendingStability || 80} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${breakdown?.spendingStability || 80}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Anomaly & Duplicate Exposure (25% Weight)
                  </span>
                  <span className="font-bold text-white">{breakdown?.anomalyRisk || 75} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${breakdown?.anomalyRisk || 75}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthScoreGauge;
