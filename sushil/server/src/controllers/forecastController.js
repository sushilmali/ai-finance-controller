import { getForecastData } from '../services/forecastService.js';

export const getForecast = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const forecast = await getForecastData(userId);

    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
