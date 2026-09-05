export const calculateFinancialHealthScore = (financialData) => {
  const { totalIncome = 0, totalExpenses = 0, categoryBreakdown = [], anomalies = [] } = financialData;

  // If no data, return baseline neutral
  if (totalIncome === 0 && totalExpenses === 0) {
    return {
      overallScore: 50,
      breakdown: {
        cashFlow: 50,
        expenseControl: 50,
        spendingStability: 50,
        anomalyRisk: 50
      },
      status: 'Awaiting Data',
      summary: 'Add or import financial transactions to generate your real-time financial health score.'
    };
  }

  // 1. Cash Flow Score (Weight 30%)
  let cashFlowScore = 50;
  if (totalIncome > 0) {
    const netSavingsRatio = (totalIncome - totalExpenses) / totalIncome;
    if (netSavingsRatio >= 0.35) cashFlowScore = 95;
    else if (netSavingsRatio >= 0.20) cashFlowScore = 85;
    else if (netSavingsRatio >= 0.10) cashFlowScore = 72;
    else if (netSavingsRatio >= 0) cashFlowScore = 60;
    else cashFlowScore = Math.max(15, Math.round(50 + netSavingsRatio * 50));
  } else if (totalExpenses > 0) {
    cashFlowScore = 20; // Burning cash with 0 revenue
  }

  // 2. Expense Control (Weight 25%)
  let expenseControlScore = 75;
  if (totalIncome > 0) {
    const expenseRatio = totalExpenses / totalIncome;
    if (expenseRatio <= 0.60) expenseControlScore = 92;
    else if (expenseRatio <= 0.75) expenseControlScore = 82;
    else if (expenseRatio <= 0.90) expenseControlScore = 70;
    else if (expenseRatio <= 1.0) expenseControlScore = 58;
    else expenseControlScore = Math.max(20, Math.round(50 - (expenseRatio - 1) * 40));
  }

  // 3. Spending Stability / Diversification (Weight 20%)
  let spendingStabilityScore = 85;
  if (categoryBreakdown && categoryBreakdown.length > 0 && totalExpenses > 0) {
    const topCategory = categoryBreakdown[0];
    const topRatio = topCategory.amount / totalExpenses;
    if (topRatio > 0.60) spendingStabilityScore = 55; // Over-concentrated in one category
    else if (topRatio > 0.45) spendingStabilityScore = 72;
    else spendingStabilityScore = 88;
  }

  // 4. Anomaly Risk (Weight 25%)
  let anomalyRiskScore = 95;
  const highAnomalies = anomalies.filter(a => a.severity === 'High').length;
  const mediumAnomalies = anomalies.filter(a => a.severity === 'Medium').length;
  const lowAnomalies = anomalies.filter(a => a.severity === 'Low').length;

  const deductions = (highAnomalies * 12) + (mediumAnomalies * 6) + (lowAnomalies * 2);
  anomalyRiskScore = Math.max(25, 95 - deductions);

  // Overall Weighted Score
  const overallScore = Math.round(
    (cashFlowScore * 0.30) +
    (expenseControlScore * 0.25) +
    (spendingStabilityScore * 0.20) +
    (anomalyRiskScore * 0.25)
  );

  let status = 'Excellent';
  let summary = 'Your business maintains healthy cash flow, strong operational margins, and low anomaly risk.';

  if (overallScore < 50) {
    status = 'Critical Risk';
    summary = 'Expenses exceed sustainable thresholds with high anomaly exposure. Immediate cost reductions recommended.';
  } else if (overallScore < 70) {
    status = 'Moderate / Caution';
    summary = 'Adequate cash reserves, but expense growth and category spikes require closer monitoring.';
  } else if (overallScore < 85) {
    status = 'Good';
    summary = 'Positive cash flow with well-controlled expenses. Address flagged anomalies to boost score.';
  }

  return {
    overallScore,
    breakdown: {
      cashFlow: cashFlowScore,
      expenseControl: expenseControlScore,
      spendingStability: spendingStabilityScore,
      anomalyRisk: anomalyRiskScore
    },
    status,
    summary
  };
};
