import express from 'express';
import multer from 'multer';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importCSV,
  getSampleCSV,
  loadDemoData,
  resetData
} from '../controllers/transactionController.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { getInsights } from '../controllers/insightController.js';
import { getAnomalies, updateAnomalyStatus, scanAnomalies } from '../controllers/anomalyController.js';
import { getForecast } from '../controllers/forecastController.js';
import { handleAIChat, handleAICategorize } from '../controllers/aiController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Health & Status
router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Dashboard
router.get('/dashboard', getDashboard);

// Transactions CRUD & Import
router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.post('/transactions/import', upload.single('file'), importCSV);
router.get('/transactions/sample-csv', getSampleCSV);
router.post('/transactions/load-demo', loadDemoData);
router.post('/transactions/reset', resetData);

// AI Insights
router.get('/insights', getInsights);

// Anomalies
router.get('/anomalies', getAnomalies);
router.put('/anomalies/:id', updateAnomalyStatus);
router.post('/anomalies/scan', scanAnomalies);

// Forecast
router.get('/forecast', getForecast);

// AI Controller Chat & Categorize
router.post('/ai/chat', handleAIChat);
router.post('/ai/categorize', handleAICategorize);

export default router;
