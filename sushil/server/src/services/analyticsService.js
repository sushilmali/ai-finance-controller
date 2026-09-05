import Transaction from '../models/Transaction.js';
import Anomaly from '../models/Anomaly.js';
import { calculateFinancialHealthScore } from './healthScoreService.js';
import { generateAIInsights } from './aiService.js';
import { detectAnomalies } from './anomalyService.js';
import { detectDuplicates } from './duplicateService.js';

export const getDashboardAnalytics = async (userId = 'demo-user') => {
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });

  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryMap = {};
  const monthlyMap = {};

  transactions.forEach(t => {
    const amount = Number(t.amount);
    const d = new Date(t.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' });

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        month: monthLabel,
        key: monthKey,
        income: 0,
        expense: 0,
        net: 0
      };
    }

    if (t.type === 'Income') {
      totalIncome += amount;
      monthlyMap[monthKey].income += amount;
    } else {
      totalExpenses += amount;
      monthlyMap[monthKey].expense += amount;
      categoryMap[t.category] = (categoryMap[t.category] || 0) + amount;
    }
  });

  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

  // Category Breakdown sorted desc
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly trends sorted chronologically
  const monthlyTrends = Object.keys(monthlyMap)
    .sort()
    .map(k => {
      const item = monthlyMap[k];
      item.net = item.income - item.expense;
      return item;
    });

  // Fetch or trigger anomaly scan
  let anomalies = await Anomaly.find({ userId });
  if (!anomalies || anomalies.length === 0) {
    anomalies = await detectAnomalies(userId);
  }

  // Calculate Health Score
  const healthScore = calculateFinancialHealthScore({
    totalIncome,
    totalExpenses,
    categoryBreakdown,
    anomalies
  });

  // Generate grounded insights
  const aiInsights = await generateAIInsights({
    totalIncome,
    totalExpenses,
    netBalance,
    categoryBreakdown,
    anomalies,
    monthlyTrends,
    healthScore: healthScore.overallScore
  });

  // Detect duplicates
  const duplicates = await detectDuplicates(userId);

  return {
    kpis: {
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
      healthScore: healthScore.overallScore,
      healthStatus: healthScore.status,
      transactionsCount: transactions.length,
      anomaliesCount: anomalies.length,
      duplicatesCount: duplicates.length
    },
    categoryBreakdown,
    topCategories: categoryBreakdown.slice(0, 5),
    monthlyTrends,
    recentTransactions: transactions.slice(0, 8),
    anomalies: anomalies.slice(0, 5),
    healthScore,
    aiInsights: aiInsights.slice(0, 4),
    duplicates
  };
};
