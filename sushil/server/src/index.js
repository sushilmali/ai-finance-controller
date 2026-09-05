import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production' && !req.path.includes('/health')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'AI Finance Controller API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      dashboard: '/api/dashboard',
      transactions: '/api/transactions',
      insights: '/api/insights',
      anomalies: '/api/anomalies',
      forecast: '/api/forecast',
      chat: '/api/ai/chat'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 AI Finance Controller Server running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`======================================================\n`);
  });
};

startServer();
