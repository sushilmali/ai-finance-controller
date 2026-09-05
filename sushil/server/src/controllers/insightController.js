import { getDashboardAnalytics } from '../services/analyticsService.js';
import { generateAIInsights } from '../services/aiService.js';

export const getInsights = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const analytics = await getDashboardAnalytics(userId);

    const insights = await generateAIInsights({
      totalIncome: analytics.kpis.totalIncome,
      totalExpenses: analytics.kpis.totalExpenses,
      netBalance: analytics.kpis.netBalance,
      categoryBreakdown: analytics.categoryBreakdown,
      anomalies: analytics.anomalies,
      monthlyTrends: analytics.monthlyTrends,
      healthScore: analytics.kpis.healthScore
    });

    res.json({
      success: true,
      data: {
        healthScore: analytics.healthScore,
        insights,
        categoryBreakdown: analytics.categoryBreakdown,
        kpis: analytics.kpis
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
