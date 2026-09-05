import Transaction from '../models/Transaction.js';
import Anomaly from '../models/Anomaly.js';
import AIInsight from '../models/AIInsight.js';
import { detectAnomalies } from './anomalyService.js';
import { detectDuplicates } from './duplicateService.js';

export const seedDemoTransactions = async (userId = 'demo-user') => {
  // Clear existing transactions for this user
  await Transaction.deleteMany({ userId });
  await Anomaly.deleteMany({ userId });
  await AIInsight.deleteMany({ userId });

  const sampleTransactions = [
    // --- MONTH 1: JUNE 2026 ---
    { date: new Date('2026-06-01'), description: 'Client Retainer - TechFlow Ltd', amount: 240000, type: 'Income', category: 'Consulting', notes: 'Monthly recurring enterprise contract' },
    { date: new Date('2026-06-03'), description: 'SaaS Platform Subscriptions', amount: 95000, type: 'Income', category: 'Sales', notes: 'Monthly Stripe payout' },
    { date: new Date('2026-06-05'), description: 'Core Engineering Salaries', amount: 150000, type: 'Expense', category: 'Salaries', notes: 'Staff payroll' },
    { date: new Date('2026-06-05'), description: 'WeWork Coworking Office Rent', amount: 45000, type: 'Expense', category: 'Rent', notes: 'Monthly workspace rent' },
    { date: new Date('2026-06-07'), description: 'Google Ads Growth Campaign', amount: 12000, type: 'Expense', category: 'Marketing', notes: 'Search PPC' },
    { date: new Date('2026-06-08'), description: 'AWS Cloud Hosting', amount: 8200, type: 'Expense', category: 'Software', notes: 'Standard compute usage' },
    { date: new Date('2026-06-10'), description: 'Slack Technologies Workspace', amount: 4500, type: 'Expense', category: 'Software', notes: 'Team chat annual seat' },
    { date: new Date('2026-06-12'), description: 'Office Supplies & Stationery', amount: 2800, type: 'Expense', category: 'Office', notes: 'Printers & paper' },
    { date: new Date('2026-06-15'), description: 'GitHub Enterprise Suite', amount: 2100, type: 'Expense', category: 'Software', notes: 'Version control' },
    { date: new Date('2026-06-18'), description: 'Airtel Fiber High-Speed Internet', amount: 2499, type: 'Expense', category: 'Utilities', notes: 'Office broadband' },
    { date: new Date('2026-06-20'), description: 'Swiggy Friday Team Lunch', amount: 3500, type: 'Expense', category: 'Food', notes: 'Sprint milestone celebration' },
    { date: new Date('2026-06-24'), description: 'Uber Client Meeting Rides', amount: 1450, type: 'Expense', category: 'Travel', notes: 'Local business transit' },

    // --- MONTH 2: JULY 2026 ---
    { date: new Date('2026-07-01'), description: 'Client Retainer - TechFlow Ltd', amount: 250000, type: 'Income', category: 'Consulting', notes: 'Monthly retainer' },
    { date: new Date('2026-07-02'), description: 'Consulting Milestone Deliverable', amount: 80000, type: 'Income', category: 'Consulting', notes: 'Architecture audit completion' },
    { date: new Date('2026-07-04'), description: 'SaaS Platform Subscriptions', amount: 110000, type: 'Income', category: 'Sales', notes: 'Product revenue' },
    { date: new Date('2026-07-05'), description: 'Core Engineering Salaries', amount: 150000, type: 'Expense', category: 'Salaries', notes: 'Staff payroll' },
    { date: new Date('2026-07-05'), description: 'WeWork Coworking Office Rent', amount: 45000, type: 'Expense', category: 'Rent', notes: 'Monthly workspace rent' },
    { date: new Date('2026-07-07'), description: 'Google Ads Growth Campaign', amount: 14500, type: 'Expense', category: 'Marketing', notes: 'Search PPC' },
    { date: new Date('2026-07-08'), description: 'Meta Ads Retargeting', amount: 11000, type: 'Expense', category: 'Marketing', notes: 'Social conversion campaigns' },
    { date: new Date('2026-07-09'), description: 'AWS Cloud Hosting', amount: 8500, type: 'Expense', category: 'Software', notes: 'Standard compute usage' },
    { date: new Date('2026-07-12'), description: 'IndiGo Airlines - Bangalore Client Visit', amount: 13500, type: 'Expense', category: 'Travel', notes: 'Client onsite review' },
    { date: new Date('2026-07-15'), description: 'Airtel Fiber High-Speed Internet', amount: 2499, type: 'Expense', category: 'Utilities', notes: 'Office broadband' },
    { date: new Date('2026-07-19'), description: 'Electricity Bill - Office', amount: 4800, type: 'Expense', category: 'Utilities', notes: 'HVAC & lights' },
    { date: new Date('2026-07-22'), description: 'Team Dinner - Mainland China', amount: 6200, type: 'Expense', category: 'Food', notes: 'Quarterly review dinner' },
    { date: new Date('2026-07-28'), description: 'Figma Organization Seats', amount: 3800, type: 'Expense', category: 'Software', notes: 'UI/UX design team' },

    // --- MONTH 3: AUGUST 2026 (Highlights: AWS Spike + Duplicate Slack + Increased Marketing) ---
    { date: new Date('2026-08-01'), description: 'Client Retainer - TechFlow Ltd', amount: 260000, type: 'Income', category: 'Consulting', notes: 'Monthly retainer renewed' },
    { date: new Date('2026-08-02'), description: 'SaaS Platform Subscriptions', amount: 135000, type: 'Income', category: 'Sales', notes: 'Product revenue' },
    { date: new Date('2026-08-03'), description: 'Advisory Retainer - HealthPlus', amount: 75000, type: 'Income', category: 'Consulting', notes: 'AI advisory retainer' },
    { date: new Date('2026-08-04'), description: 'Slack Technologies Workspace', amount: 4500, type: 'Expense', category: 'Software', notes: 'Subscription auto-renewed' },
    { date: new Date('2026-08-05'), description: 'Core Engineering Salaries', amount: 155000, type: 'Expense', category: 'Salaries', notes: 'Payroll with merit adjustments' },
    { date: new Date('2026-08-05'), description: 'WeWork Coworking Office Rent', amount: 45000, type: 'Expense', category: 'Rent', notes: 'Monthly rent' },
    // DUPLICATE TRANSACTION:
    { date: new Date('2026-08-06'), description: 'Slack Technologies Workspace', amount: 4500, type: 'Expense', category: 'Software', notes: 'Accidental duplicate charge' },
    { date: new Date('2026-08-09'), description: 'Google Ads Growth Campaign', amount: 18500, type: 'Expense', category: 'Marketing', notes: 'Expanded summer campaign' },
    { date: new Date('2026-08-11'), description: 'Meta Ads Retargeting', amount: 15200, type: 'Expense', category: 'Marketing', notes: 'Lead generation scale' },
    { date: new Date('2026-08-14'), description: 'GitHub Enterprise Suite', amount: 2100, type: 'Expense', category: 'Software', notes: 'Repo licenses' },
    // THE CRITICAL BUILDATHON ANOMALY (AWS spike to 42,000 vs avg 8,500):
    { date: new Date('2026-08-18'), description: 'AWS Cloud Hosting - GPU Compute Surge', amount: 42000, type: 'Expense', category: 'Software', notes: 'Unmanaged EC2 GPU cluster running continuously' },
    { date: new Date('2026-08-20'), description: 'Office Depot - Standing Desks', amount: 14500, type: 'Expense', category: 'Office', notes: 'Ergonomic workspace upgrade' },
    { date: new Date('2026-08-22'), description: 'Swiggy Food - Hackathon Catering', amount: 4800, type: 'Expense', category: 'Food', notes: 'Overnight developer meals' },
    { date: new Date('2026-08-24'), description: 'Uber Rides - Airport & Clients', amount: 2350, type: 'Expense', category: 'Travel', notes: 'Business transportation' },
    { date: new Date('2026-08-26'), description: 'Airtel Fiber High-Speed Internet', amount: 2499, type: 'Expense', category: 'Utilities', notes: 'Office broadband' },
    { date: new Date('2026-08-28'), description: 'Electricity Bill - Office', amount: 5600, type: 'Expense', category: 'Utilities', notes: 'August electricity invoice' }
  ];

  const createdTransactions = await Transaction.insertMany(
    sampleTransactions.map(t => ({ ...t, userId }))
  );

  // Run anomaly & duplicate detectors on newly seeded data
  await detectAnomalies(userId);
  await detectDuplicates(userId);

  return {
    count: createdTransactions.length,
    message: `${createdTransactions.length} realistic multi-month business transactions loaded successfully with engineered anomalies and trends.`
  };
};
