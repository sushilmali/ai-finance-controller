import mongoose from 'mongoose';
import { useMemoryStore } from '../config/db.js';
import { memoryStore } from './store.js';

const aiInsightSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-user' },
  type: { type: String, enum: ['spending', 'trend', 'alert', 'recommendation', 'subscription', 'savings'], default: 'trend' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  category: { type: String, default: 'General' },
  actionable: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAIInsight = mongoose.model('AIInsight', aiInsightSchema);

export const AIInsight = {
  find: (q) => (useMemoryStore ? memoryStore.insights.find(q) : MongooseAIInsight.find(q)),
  findById: (id) => (useMemoryStore ? memoryStore.insights.findById(id) : MongooseAIInsight.findById(id)),
  findOne: (q) => (useMemoryStore ? memoryStore.insights.findOne(q) : MongooseAIInsight.findOne(q)),
  create: (doc) => (useMemoryStore ? memoryStore.insights.create(doc) : MongooseAIInsight.create(doc)),
  insertMany: (docs) => (useMemoryStore ? memoryStore.insights.insertMany(docs) : MongooseAIInsight.insertMany(docs)),
  findByIdAndUpdate: (id, u, o) => (useMemoryStore ? memoryStore.insights.findByIdAndUpdate(id, u, o) : MongooseAIInsight.findByIdAndUpdate(id, u, o)),
  findByIdAndDelete: (id) => (useMemoryStore ? memoryStore.insights.findByIdAndDelete(id) : MongooseAIInsight.findByIdAndDelete(id)),
  deleteMany: (q) => (useMemoryStore ? memoryStore.insights.deleteMany(q) : MongooseAIInsight.deleteMany(q)),
  countDocuments: (q) => (useMemoryStore ? memoryStore.insights.countDocuments(q) : MongooseAIInsight.countDocuments(q)),
};

export default AIInsight;
