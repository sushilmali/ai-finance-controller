import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Layers,
  Activity,
  DollarSign,
  PieChart as PieIcon,
  RefreshCw
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.jsx';
import { apiClient } from '../api/client.js';
import SeverityBadge from '../components/common/SeverityBadge.jsx';
import CategoryBadge from '../components/common/CategoryBadge.jsx';
import { useNavigate } from 'react-router-dom';

export const InsightsPage = () => {
  const { formatCurrency, dashboardData } = useFinance();
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getInsights();
      if (res.success) {
        setInsightsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const kpis = insightsData?.kpis || dashboardData?.kpis || {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    savingsRate: 0,
    healthScore: 50
  };

  const healthScore = insightsData?.healthScore || dashboardData?.healthScore;
  const breakdown = healthScore?.breakdown || {
    cashFlow: 88,
    expenseControl: 72,
    spendingStability: 80,
    anomalyRisk: 75
  };

  const insights = insightsData?.insights || dashboardData?.aiInsights || [];
  const categoryBreakdown = insightsData?.categoryBreakdown || dashboardData?.categoryBreakdown || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              AI Financial Intelligence & Strategic Recommendations
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded mathematical evaluations, spending concentration alerts, and executive cost-reduction blueprints.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          Refresh AI Audit
        </button>
      </div>

      {/* 5-Factor Financial Health Pillar Breakdown */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
                <span className="text-2xl font-black font-display text-emerald-400">
                  {healthScore?.overallScore || kpis.healthScore}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Financial Health Index
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {healthScore?.status || 'Good'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {healthScore?.summary || 'Your business maintains healthy cash reserves with controlled expense velocities.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => navigate('/controller')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              Ask Controller How to Reach 100 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Pillars Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Cash Flow
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400">{breakdown.cashFlow}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown.cashFlow}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Net retention ratio: {kpis.savingsRate}%</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Expense Control
              </span>
              <span className="text-xs font-bold font-mono text-indigo-400">{breakdown.expenseControl}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${breakdown.expenseControl}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Burn vs revenue proportion</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" /> Spending Stability
              </span>
              <span className="text-xs font-bold font-mono text-violet-400">{breakdown.spendingStability}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${breakdown.spendingStability}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Categorical diversification</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Anomaly Risk
              </span>
              <span className="text-xs font-bold font-mono text-amber-400">{breakdown.anomalyRisk}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${breakdown.anomalyRisk}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Statistical outlier exposure</p>
          </div>
        </div>
      </div>

      {/* AI Grounded Insights Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white font-display">
            Strategic Financial Observations & Observations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/60 border border-slate-800">
              No insights available. Add transactions or load demo data to trigger analysis.
            </div>
          ) : (
            insights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white font-display">{item.title}</span>
                    <SeverityBadge severity={item.severity} />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.message}
                  </p>
                </div>

                {item.actionable && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Recommended Controller Action
                    </span>
                    <p className="text-[11px] text-slate-300">{item.actionable}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expense Concentration Radar / Breakdown */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Categorical Concentration Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Categories requiring quarterly auditing and contract renegotiation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBreakdown.map((cat) => (
            <div
              key={cat.category}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <CategoryBadge category={cat.category} />
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {formatCurrency(cat.amount)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white">
                  {cat.percentage}%
                </span>
                <p className="text-[10px] text-slate-500 uppercase">Share</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
