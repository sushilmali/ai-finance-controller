import Transaction from '../models/Transaction.js';
import { categorizeTransaction } from '../services/aiService.js';
import { detectAnomalies } from '../services/anomalyService.js';
import { detectDuplicates } from '../services/duplicateService.js';
import { seedDemoTransactions } from '../services/demoDataService.js';

export const getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    const query = { userId: req.headers['x-user-id'] || 'demo-user' };

    if (type && type !== 'All') {
      query.type = type;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { description: searchRegex },
        { category: searchRegex },
        { notes: searchRegex }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortOption = {};
    sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(query);
    const chain = await Transaction.find(query);
    const transactions = (chain._data || chain);

    // Apply manual sort/slice if in-memory
    transactions.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const paginated = transactions.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      count: paginated.length,
      data: paginated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const { date, description, amount, type, category, notes } = req.body;

    if (!description || !amount || !type) {
      return res.status(400).json({ success: false, message: 'Description, amount, and type are required fields.' });
    }

    // Auto-categorize with AI/Rules if not specified or set to 'Other'
    let finalCategory = category;
    if (!finalCategory || finalCategory === 'Other') {
      finalCategory = await categorizeTransaction(description, type);
    }

    const newTransaction = await Transaction.create({
      userId,
      date: date ? new Date(date) : new Date(),
      description: description.trim(),
      amount: Math.abs(Number(amount)),
      type,
      category: finalCategory || 'Other',
      notes: notes || ''
    });

    // Recalculate anomalies & duplicates
    await detectAnomalies(userId);
    await detectDuplicates(userId);

    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'demo-user';
    const { date, description, amount, type, category, notes } = req.body;

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        ...(date && { date: new Date(date) }),
        ...(description && { description }),
        ...(amount !== undefined && { amount: Math.abs(Number(amount)) }),
        ...(type && { type }),
        ...(category && { category }),
        ...(notes !== undefined && { notes })
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    // Re-run scan
    await detectAnomalies(userId);
    await detectDuplicates(userId);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'demo-user';

    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    // Re-run scan
    await detectAnomalies(userId);
    await detectDuplicates(userId);

    res.json({ success: true, message: 'Transaction deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importCSV = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    let rawContent = '';

    if (req.file) {
      rawContent = req.file.buffer.toString('utf-8');
    } else if (req.body.csvData) {
      rawContent = req.body.csvData;
    } else {
      return res.status(400).json({ success: false, message: 'No CSV file or data provided.' });
    }

    const lines = rawContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return res.status(400).json({ success: false, message: 'CSV must contain headers and at least 1 transaction record.' });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));
    
    // Find column indexes
    const dateIdx = headers.findIndex(h => h.includes('date'));
    const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('merchant') || h.includes('item') || h.includes('title'));
    const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('cost') || h.includes('price') || h.includes('total'));
    const typeIdx = headers.findIndex(h => h.includes('type'));
    const catIdx = headers.findIndex(h => h.includes('cat'));
    const notesIdx = headers.findIndex(h => h.includes('note') || h.includes('comment') || h.includes('memo'));

    if (descIdx === -1 || amountIdx === -1) {
      return res.status(400).json({
        success: false,
        message: 'CSV must contain at least "Description" (or Title/Item) and "Amount" columns.'
      });
    }

    const parsedTransactions = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      if (row.length <= 1) continue;

      const desc = row[descIdx];
      const amountVal = parseFloat(row[amountIdx]?.replace(/[^0-9.-]+/g, ''));
      if (!desc || isNaN(amountVal)) continue;

      let dateVal = dateIdx !== -1 && row[dateIdx] ? new Date(row[dateIdx]) : new Date();
      if (isNaN(dateVal.getTime())) dateVal = new Date();

      let typeVal = typeIdx !== -1 && row[typeIdx] ? row[typeIdx] : (amountVal < 0 ? 'Expense' : 'Expense');
      if (typeVal.toLowerCase().includes('inc') || typeVal.toLowerCase().includes('credit')) {
        typeVal = 'Income';
      } else {
        typeVal = 'Expense';
      }

      let categoryVal = catIdx !== -1 && row[catIdx] ? row[catIdx] : '';
      if (!categoryVal || categoryVal.toLowerCase() === 'other' || categoryVal.toLowerCase() === 'uncategorized') {
        categoryVal = await categorizeTransaction(desc, typeVal);
      }

      const notesVal = notesIdx !== -1 ? row[notesIdx] : '';

      parsedTransactions.push({
        userId,
        date: dateVal,
        description: desc,
        amount: Math.abs(amountVal),
        type: typeVal,
        category: categoryVal || 'Other',
        notes: notesVal || ''
      });
    }

    if (parsedTransactions.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid transaction records could be parsed from the CSV.' });
    }

    await Transaction.insertMany(parsedTransactions);

    // Refresh anomaly & duplicate detection
    const anomalies = await detectAnomalies(userId);
    const duplicates = await detectDuplicates(userId);

    res.json({
      success: true,
      message: `${parsedTransactions.length} transactions imported successfully.`,
      importedCount: parsedTransactions.length,
      anomaliesDetected: anomalies.length,
      duplicatesFound: duplicates.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSampleCSV = (req, res) => {
  const sample = `Date,Description,Amount,Type,Category,Notes
2026-08-01,Google Ads Growth Campaign,15000,Expense,Marketing,PPC Search Ads
2026-08-02,Client Payment - Global Tech,80000,Income,Consulting,Monthly Retainer
2026-08-03,AWS Cloud Infrastructure,8500,Expense,Software,Production Hosting
2026-08-04,Office Supplies & Stationery,3200,Expense,Office,Printers and paper
2026-08-05,Core Engineering Salaries,50000,Expense,Salaries,Staff Payroll
2026-08-06,Uber Business Rides,1450,Expense,Travel,Client meeting transit
2026-08-07,Swiggy Team Friday Lunch,2800,Expense,Food,Sprint retrospective meal
2026-08-08,Airtel Fiber Broadband,2499,Expense,Utilities,Office 1 Gbps Fiber`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ai-finance-sample.csv"');
  res.send(sample);
};

export const loadDemoData = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    const result = await seedDemoTransactions(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetData = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user';
    await Transaction.deleteMany({ userId });
    res.json({ success: true, message: 'All transactions cleared successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
