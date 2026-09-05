import Transaction from '../models/Transaction.js';
import Anomaly from '../models/Anomaly.js';
import { getDashboardAnalytics } from '../services/analyticsService.js';
import { chatWithFinanceController, categorizeTransaction } from '../services/aiService.js';

export const handleAIChat = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const { messages = [] } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    // Retrieve full real financial context
    const analytics = await getDashboardAnalytics(userId);
    const chain = await Transaction.find({ userId });
    const allTransactions = (chain._data || chain);

    const financialContext = {
      transactions: allTransactions,
      totalIncome: analytics.kpis.totalIncome,
      totalExpenses: analytics.kpis.totalExpenses,
      netBalance: analytics.kpis.netBalance,
      categoryBreakdown: analytics.categoryBreakdown,
      anomalies: analytics.anomalies,
      monthlyTrends: analytics.monthlyTrends,
      healthScore: analytics.kpis.healthScore
    };

    const reply = await chatWithFinanceController(messages, financialContext);

    res.json({
      success: true,
      data: {
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAICategorize = async (req, res) => {
  try {
    const { description, type = 'Expense' } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }

    const category = await categorizeTransaction(description, type);
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
