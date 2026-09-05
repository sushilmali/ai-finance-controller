import { getDashboardAnalytics } from '../services/analyticsService.js';
import { getDBStatus } from '../config/db.js';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const analytics = await getDashboardAnalytics(userId);
    const dbStatus = getDBStatus();

    res.json({
      success: true,
      data: analytics,
      system: {
        database: dbStatus,
        aiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY),
        aiModel: 'Gemini 1.5 Flash + Deterministic Financial Engine'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
