import Transaction from '../models/Transaction.js';

export const detectDuplicates = async (userId = 'demo-user') => {
  const transactions = await Transaction.find({ userId });
  if (!transactions || transactions.length < 2) return [];

  const duplicateGroups = [];
  const visited = new Set();

  for (let i = 0; i < transactions.length; i++) {
    const t1 = transactions[i];
    const id1 = t1._id?.toString();
    if (visited.has(id1)) continue;

    const group = [t1];

    for (let j = i + 1; j < transactions.length; j++) {
      const t2 = transactions[j];
      const id2 = t2._id?.toString();
      if (visited.has(id2)) continue;

      // Check same type
      if (t1.type !== t2.type) continue;

      // Check amount exact or within ₹10
      const amountDiff = Math.abs(Number(t1.amount) - Number(t2.amount));
      if (amountDiff > 10) continue;

      // Check date within 4 days
      const d1 = new Date(t1.date).getTime();
      const d2 = new Date(t2.date).getTime();
      const dayDiff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
      if (dayDiff > 4) continue;

      // Check description similarity
      const desc1 = t1.description.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const desc2 = t2.description.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

      const isSimilar = desc1 === desc2 || desc1.includes(desc2) || desc2.includes(desc1);

      if (isSimilar) {
        group.push(t2);
        visited.add(id2);
      }
    }

    if (group.length > 1) {
      visited.add(id1);
      duplicateGroups.push({
        description: t1.description,
        amount: t1.amount,
        category: t1.category,
        count: group.length,
        transactions: group,
        reason: `${group.length} transactions with matching amount (₹${t1.amount.toLocaleString()}) and description within a 4-day window.`
      });

      // Mark duplicate flags
      for (const item of group) {
        await Transaction.findByIdAndUpdate(item._id, { isDuplicate: true });
      }
    }
  }

  return duplicateGroups;
};
