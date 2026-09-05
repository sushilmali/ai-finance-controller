import mongoose from 'mongoose';
import { useMemoryStore } from '../config/db.js';
import { memoryStore } from './store.js';

const anomalySchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-user' },
  transactionId: { type: String, required: true },
  transaction: { type: Object }, // denormalized transaction details for fast retrieval
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  reason: { type: String, required: true },
  recommendation: { type: String, required: true },
  historicalAvg: { type: Number, default: 0 },
  status: { type: String, enum: ['detected', 'reviewed', 'dismissed', 'resolved'], default: 'detected' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAnomaly = mongoose.model('Anomaly', anomalySchema);

export const Anomaly = {
  find: (q) => (useMemoryStore ? memoryStore.anomalies.find(q) : MongooseAnomaly.find(q)),
  findById: (id) => (useMemoryStore ? memoryStore.anomalies.findById(id) : MongooseAnomaly.findById(id)),
  findOne: (q) => (useMemoryStore ? memoryStore.anomalies.findOne(q) : MongooseAnomaly.findOne(q)),
  create: (doc) => (useMemoryStore ? memoryStore.anomalies.create(doc) : MongooseAnomaly.create(doc)),
  insertMany: (docs) => (useMemoryStore ? memoryStore.anomalies.insertMany(docs) : MongooseAnomaly.insertMany(docs)),
  findByIdAndUpdate: (id, u, o) => (useMemoryStore ? memoryStore.anomalies.findByIdAndUpdate(id, u, o) : MongooseAnomaly.findByIdAndUpdate(id, u, o)),
  findByIdAndDelete: (id) => (useMemoryStore ? memoryStore.anomalies.findByIdAndDelete(id) : MongooseAnomaly.findByIdAndDelete(id)),
  deleteMany: (q) => (useMemoryStore ? memoryStore.anomalies.deleteMany(q) : MongooseAnomaly.deleteMany(q)),
  countDocuments: (q) => (useMemoryStore ? memoryStore.anomalies.countDocuments(q) : MongooseAnomaly.countDocuments(q)),
};

export default Anomaly;
