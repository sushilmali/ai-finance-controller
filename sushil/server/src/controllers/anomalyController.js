import Anomaly from '../models/Anomaly.js';
import { detectAnomalies } from '../services/anomalyService.js';
import { detectDuplicates } from '../services/duplicateService.js';

export const getAnomalies = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const { severity } = req.query;

    let query = { userId };
    if (severity && severity !== 'All') {
      query.severity = severity;
    }

    const chain = await Anomaly.find(query);
    const anomalies = (chain._data || chain);
    
    // Sort anomalies high severity first
    const severityWeight = { High: 3, Medium: 2, Low: 1 };
    anomalies.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));

    const duplicates = await detectDuplicates(userId);

    res.json({
      success: true,
      count: anomalies.length,
      data: anomalies,
      duplicates,
      summary: {
        total: anomalies.length,
        high: anomalies.filter(a => a.severity === 'High').length,
        medium: anomalies.filter(a => a.severity === 'Medium').length,
        low: anomalies.filter(a => a.severity === 'Low').length,
        duplicatesCount: duplicates.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAnomalyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'detected', 'reviewed', 'dismissed', 'resolved'

    const updated = await Anomaly.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Anomaly record not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const scanAnomalies = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const detected = await detectAnomalies(userId);
    const duplicates = await detectDuplicates(userId);

    res.json({
      success: true,
      message: `Scan complete: ${detected.length} anomalies and ${duplicates.length} duplicate groups identified.`,
      anomaliesCount: detected.length,
      duplicatesCount: duplicates.length,
      data: detected
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
