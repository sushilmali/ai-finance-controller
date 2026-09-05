import mongoose from 'mongoose';
import { useMemoryStore } from '../config/db.js';
import { memoryStore } from './store.js';

const transactionSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-user' },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  category: { type: String, required: true, default: 'Other' },
  notes: { type: String, default: '' },
  isAnomaly: { type: Boolean, default: false },
  isDuplicate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongooseTransaction = mongoose.model('Transaction', transactionSchema);

export const Transaction = {
  find: (q) => (useMemoryStore ? memoryStore.transactions.find(q) : MongooseTransaction.find(q)),
  findById: (id) => (useMemoryStore ? memoryStore.transactions.findById(id) : MongooseTransaction.findById(id)),
  findOne: (q) => (useMemoryStore ? memoryStore.transactions.findOne(q) : MongooseTransaction.findOne(q)),
  create: (doc) => (useMemoryStore ? memoryStore.transactions.create(doc) : MongooseTransaction.create(doc)),
  insertMany: (docs) => (useMemoryStore ? memoryStore.transactions.insertMany(docs) : MongooseTransaction.insertMany(docs)),
  findByIdAndUpdate: (id, u, o) => (useMemoryStore ? memoryStore.transactions.findByIdAndUpdate(id, u, o) : MongooseTransaction.findByIdAndUpdate(id, u, o)),
  findByIdAndDelete: (id) => (useMemoryStore ? memoryStore.transactions.findByIdAndDelete(id) : MongooseTransaction.findByIdAndDelete(id)),
  deleteMany: (q) => (useMemoryStore ? memoryStore.transactions.deleteMany(q) : MongooseTransaction.deleteMany(q)),
  countDocuments: (q) => (useMemoryStore ? memoryStore.transactions.countDocuments(q) : MongooseTransaction.countDocuments(q)),
};

export default Transaction;
