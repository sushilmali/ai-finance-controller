import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Database,
  Receipt,
  Plus,
  Copy
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useFinance } from '../context/FinanceContext.jsx';
import KPICard from '../components/common/KPICard.jsx';
import HealthScoreGauge from '../components/common/HealthScoreGauge.jsx';
import CategoryBadge from '../components/common/CategoryBadge.jsx';
import SeverityBadge from '../components/common/SeverityBadge.jsx';
import DuplicateReviewModal from '../components/modals/DuplicateReviewModal.jsx';
import { useNavigate } from 'react-router-dom';

const DONUT_COLORS = [
  '#10B981', // emerald
  '#6366F1', // indigo
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#F59E0B', // amber
  '#F43F5E', // rose
  '#3B82F6', // blue
  '#64748B'  // slate
];

export const DashboardPage = () => {
  const {
    dashboardData,
    loading,
    formatCurrency,
    openAddModal,
    handleLoadDemoData,
    setIsDuplicateModalOpen,
    isDuplicateModalOpen
  } = useFinance();

  const navigate = useNavigate();

  if (loading && !dashboardData) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 rounded-2xl bg-slate-900/80 border border-slate-800 shimmer-effect" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-900/80 border border-slate-800 shimmer-effect" />
          <div className="h-80 rounded-2xl bg-slate-900/80 border border-slate-800 shimmer-effect" />
        </div>
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    savingsRate: 0,
    healthScore: 50,
    healthStatus: 'Awaiting Data',
    transactionsCount: 0,
    anomaliesCount: 0,
    duplicatesCount: 0
  };

  const categoryBreakdown = dashboardData?.categoryBreakdown || [];
  const monthlyTrends = dashboardData?.monthlyTrends || [];
  const recentTransactions = dashboardData?.recentTransactions || [];
  const anomalies = dashboardData?.anomalies || [];
  const aiInsights = dashboardData?.aiInsights || [];
  const duplicates = dashboardData?.duplicates || [];

  // Top 5 Categories for horizontal bars
  const topCategories = dashboardData?.topCategories || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome with Quick Demo Loader if 0 transactions */}
      {kpis.transactionsCount === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 p-6 sm:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Track 4 Buildathon Demo Initializer
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
              Welcome to AI Finance Controller
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transform raw financial transactions into instant intelligence, automated expense categorization, anomaly alarms, predictive runway forecasts, and strategic AI decisions.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={handleLoadDemoData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                <Database className="w-4 h-4" /> Load 3-Month Demo Dataset (1-Click)
              </button>
              <button
                onClick={() => openAddModal()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Single Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Alert Banner if duplicates detected */}
      {duplicates.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-200">
                {duplicates.length} Potential Duplicate Transaction Group{duplicates.length > 1 ? 's' : ''} Detected
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Charges with matching amounts and merchants occurred within short timeframes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDuplicateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-colors active:scale-95"
          >
            Review Duplicates
          </button>
        </div>
      )}

      {/* ROW 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Inflow / Income"
          value={formatCurrency(kpis.totalIncome)}
          subtext="Verified business receivables"
          icon={TrendingUp}
          colorScheme="emerald"
          trend="up"
          trendText="Revenue"
        />

        <KPICard
          title="Total Outflow / Expenses"
          value={formatCurrency(kpis.totalExpenses)}
          subtext={`${kpis.transactionsCount} total entries`}
          icon={TrendingDown}
          colorScheme="rose"
          trend="down"
          trendText="Operational Burn"
        />

        <KPICard
          title="Net Operating Balance"
          value={formatCurrency(kpis.netBalance)}
          subtext={`${kpis.savingsRate}% Net Retention Margin`}
          icon={Wallet}
          colorScheme="indigo"
          trend={kpis.netBalance >= 0 ? 'up' : 'down'}
          trendText={kpis.netBalance >= 0 ? 'Surplus' : 'Deficit'}
        />

        <HealthScoreGauge
          healthScore={kpis.healthScore}
          breakdown={dashboardData?.healthScore?.breakdown}
          status={kpis.healthStatus}
          summary={dashboardData?.healthScore?.summary}
        />
      </div>

      {/* ROW 2: Monthly Income vs Expenses (Bar Chart) + Expense Breakdown (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Monthly Inflow vs Outflow
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-period cash velocity comparison
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {monthlyTrends.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No monthly transaction records available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), '']}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Breakdown Donut */}
        <div className="rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Expense Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Categorical allocation breakdown</p>
              </div>
            </div>

            <div className="h-56 w-full relative">
              {categoryBreakdown.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No expense categories recorded
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                          stroke="#0F172A"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [formatCurrency(val), 'Spent']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Quick Category Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-4 border-t border-slate-800">
            {categoryBreakdown.slice(0, 4).map((c, idx) => (
              <div key={c.category} className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                />
                <span className="truncate">{c.category}</span>
                <span className="text-slate-500 ml-auto font-mono">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: Top Expense Categories (Horizontal Bars) + AI Financial Insights Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Expense Categories */}
        <div className="rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Top Spending Categories
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Highest concentration areas</p>
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {topCategories.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No categories recorded yet</p>
            ) : (
              topCategories.map((c, idx) => (
                <div key={c.category} className="text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <CategoryBadge category={c.category} size="sm" />
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {formatCurrency(c.amount)} <span className="text-slate-500 font-normal">({c.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${c.percentage}%`,
                        backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Financial Insights Card */}
        <div className="rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    AI Controller Insights
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time data-grounded observations</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/insights')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                All Insights <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {aiInsights.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">Load demo data to generate AI insights</p>
              ) : (
                aiInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 truncate">{insight.title}</span>
                      <SeverityBadge severity={insight.severity || 'Medium'} />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {insight.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Want deeper strategic advice?</span>
            <button
              onClick={() => navigate('/controller')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Ask AI Controller →
            </button>
          </div>
        </div>
      </div>

      {/* ROW 4: Recent Transactions Table + Live Anomalies Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Recent Transactions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest journal records</p>
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No recent transactions recorded.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 text-slate-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-medium text-slate-200">
                        {tx.description}
                        {tx.isAnomaly && (
                          <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Anomaly
                          </span>
                        )}
                        {tx.isDuplicate && (
                          <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Duplicate
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <CategoryBadge category={tx.category} size="sm" />
                      </td>
                      <td className={`py-3 text-right font-mono font-semibold ${tx.type === 'Income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Anomalies Preview Banner */}
        <div className="rounded-2xl bg-[#0F172A]/90 p-6 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Flagged Anomalies
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Statistical & rule outliers</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/anomalies')}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                Inspect <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {anomalies.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active anomalies detected.
                </div>
              ) : (
                anomalies.slice(0, 2).map((a, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {a.transaction?.description}
                      </span>
                      <SeverityBadge severity={a.severity} />
                    </div>
                    <p className="text-xs font-mono font-bold text-rose-400 mb-1">
                      {formatCurrency(a.transaction?.amount)}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {a.reason}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => navigate('/anomalies')}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors"
            >
              Review All Detected Outliers ({anomalies.length})
            </button>
          </div>
        </div>
      </div>

      <DuplicateReviewModal duplicates={duplicates} />
    </div>
  );
};

export default DashboardPage;
