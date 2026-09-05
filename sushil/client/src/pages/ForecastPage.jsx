import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useFinance } from '../context/FinanceContext.jsx';
import { apiClient } from '../api/client.js';

export const ForecastPage = () => {
  const { formatCurrency } = useFinance();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getForecast();
      if (res.success) {
        setForecastData(res.data);
      }
    } catch (err) {
      console.error('Failed to load forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const chartData = forecastData?.chartData || [];
  const nextMonth = forecastData?.predictedNextMonth || {
    label: 'Next Period',
    income: 0,
    expense: 0,
    net: 0,
    savingsRate: 0,
    confidenceScore: 'Moderate'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Predictive Cash Flow & Runway Forecast
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statistical regression and momentum modeling to project next-month liquidity and burn rate.
          </p>
        </div>

        <button
          onClick={fetchForecast}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          Recalculate Projections
        </button>
      </div>

      {/* 4 Projected Next-Month KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-emerald-500/30 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Projected Revenue</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              AI Forecast
            </span>
          </div>
          <h3 className="mt-3 text-2xl lg:text-3xl font-bold font-mono text-emerald-400">
            {formatCurrency(nextMonth.income)}
          </h3>
          <p className="mt-2 text-xs text-slate-400">Target for {nextMonth.label}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-rose-500/30 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Projected Burn / Expenses</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
              AI Forecast
            </span>
          </div>
          <h3 className="mt-3 text-2xl lg:text-3xl font-bold font-mono text-rose-400">
            {formatCurrency(nextMonth.expense)}
          </h3>
          <p className="mt-2 text-xs text-slate-400">Operational estimate</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-indigo-500/30 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Projected Net Cash Flow</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              {nextMonth.savingsRate}% Margin
            </span>
          </div>
          <h3 className="mt-3 text-2xl lg:text-3xl font-bold font-mono text-indigo-300">
            {formatCurrency(nextMonth.net)}
          </h3>
          <p className="mt-2 text-xs text-slate-400">Net retained surplus</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Model Confidence</p>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="mt-3 text-xl font-bold font-display text-white">
            {nextMonth.confidenceScore}
          </h3>
          <p className="mt-2 text-xs text-slate-500">Based on {forecastData?.historicalMonthsCount || 0} historical periods</p>
        </div>
      </div>

      {/* Main Forecast Visual Chart */}
      <div className="rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              Historical Velocity & Next-Period AI Projection
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Solid areas represent settled transactions; highlighted terminal point indicates projected forecast.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Projected Income
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> Projected Expenses
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              {forecastData?.message || 'Insufficient data to generate forecast'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip formatter={(val) => [formatCurrency(val), '']} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Methodology & Disclaimer Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>AI Forecast Methodology & Guardrails</span>
        </div>
        <p className="leading-relaxed">
          {forecastData?.summary || 'The forecasting engine applies multi-period weighted moving averages combined with exponential trend damping to estimate upcoming income and expenditure.'}
        </p>
        <p className="text-[11px] text-slate-500 italic">
          {forecastData?.disclaimer || 'Disclaimer: Forecasts are mathematical estimates based on available historical transaction data and should be used for budgeting scenarios rather than guaranteed outcomes.'}
        </p>
      </div>
    </div>
  );
};

export default ForecastPage;
