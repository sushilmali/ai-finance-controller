import Transaction from '../models/Transaction.js';
import Anomaly from '../models/Anomaly.js';

export const detectAnomalies = async (userId = 'demo-user') => {
  const transactions = await Transaction.find({ userId, type: 'Expense' });
  if (!transactions || transactions.length === 0) return [];

  // Group by category to calculate baseline stats
  const categoryStats = {};
  transactions.forEach(t => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = [];
    }
    categoryStats[t.category].push(Number(t.amount));
  });

  const categoryAverages = {};
  for (const [cat, amounts] of Object.entries(categoryStats)) {
    const sum = amounts.reduce((a, b) => a + b, 0);
    const avg = sum / amounts.length;
    // Standard deviation
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    categoryAverages[cat] = {
      avg: Math.round(avg),
      stdDev: Math.round(stdDev),
      count: amounts.length,
      max: Math.max(...amounts)
    };
  }

  const detectedAnomalies = [];

  for (const t of transactions) {
    const catStat = categoryAverages[t.category] || { avg: t.amount, stdDev: 0, count: 1 };
    const amount = Number(t.amount);

    let isAnomaly = false;
    let severity = 'Low';
    let reason = '';
    let recommendation = '';

    // Condition 1: Substantial spike compared to category average (> 2.5x baseline and > 10,000)
    if (catStat.count >= 2 && amount >= catStat.avg * 2.5 && amount - catStat.avg >= 5000) {
      isAnomaly = true;
      severity = amount >= catStat.avg * 3.5 ? 'High' : 'Medium';
      reason = `₹${amount.toLocaleString()} ${t.description} expense is significantly higher than the category average of approximately ₹${catStat.avg.toLocaleString()}.`;
      recommendation = `Investigate unexpected usage spikes with the vendor (${t.description}) or review invoice line items.`;
    }
    // Condition 2: Overall massive single transaction (> 35,000 for standard operational items like Software/Travel/Food)
    else if (['Software', 'Food', 'Travel', 'Utilities', 'Office'].includes(t.category) && amount >= 35000) {
      isAnomaly = true;
      severity = 'High';
      reason = `₹${amount.toLocaleString()} single expense in ${t.category} is unusually high for operational spending.`;
      recommendation = `Verify authorization and review whether this was an accidental recurring charge or unapproved purchase.`;
    }
    // Condition 3: Z-score > 2.2
    else if (catStat.stdDev > 0 && (amount - catStat.avg) / catStat.stdDev > 2.2 && amount > 15000) {
      isAnomaly = true;
      severity = 'Medium';
      reason = `Statistical outlier detected: Transaction is 2.2+ standard deviations above typical ${t.category} baseline.`;
      recommendation = `Audit transaction receipt and verify whether future recurring charges will reflect this amount.`;
    }

    if (isAnomaly) {
      detectedAnomalies.push({
        userId,
        transactionId: t._id?.toString(),
        transaction: {
          _id: t._id,
          date: t.date,
          description: t.description,
          amount: t.amount,
          category: t.category,
          type: t.type
        },
        severity,
        reason,
        recommendation,
        historicalAvg: catStat.avg,
        status: 'detected',
        createdAt: new Date()
      });

      // Update transaction flag
      await Transaction.findByIdAndUpdate(t._id, { isAnomaly: true });
    }
  }

  // Persist anomalies into database
  await Anomaly.deleteMany({ userId });
  if (detectedAnomalies.length > 0) {
    await Anomaly.insertMany(detectedAnomalies);
  }

  return detectedAnomalies;
};
