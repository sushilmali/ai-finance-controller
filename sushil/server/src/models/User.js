import mongoose from 'mongoose';
import { useMemoryStore } from '../config/db.js';
import { memoryStore } from './store.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Demo Business User' },
  email: { type: String, required: true, default: 'founder@aifinance.demo' },
  currency: { type: String, default: 'INR' }, // 'INR', 'USD', 'EUR', 'GBP'
  companyName: { type: String, default: 'Apex Innovations Pvt Ltd' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.model('User', userSchema);

export const User = {
  find: (q) => (useMemoryStore ? memoryStore.users.find(q) : MongooseUser.find(q)),
  findById: (id) => (useMemoryStore ? memoryStore.users.findById(id) : MongooseUser.findById(id)),
  findOne: (q) => (useMemoryStore ? memoryStore.users.findOne(q) : MongooseUser.findOne(q)),
  create: (doc) => (useMemoryStore ? memoryStore.users.create(doc) : MongooseUser.create(doc)),
  insertMany: (docs) => (useMemoryStore ? memoryStore.users.insertMany(docs) : MongooseUser.insertMany(docs)),
  findByIdAndUpdate: (id, u, o) => (useMemoryStore ? memoryStore.users.findByIdAndUpdate(id, u, o) : MongooseUser.findByIdAndUpdate(id, u, o)),
  findByIdAndDelete: (id) => (useMemoryStore ? memoryStore.users.findByIdAndDelete(id) : MongooseUser.findByIdAndDelete(id)),
  deleteMany: (q) => (useMemoryStore ? memoryStore.users.deleteMany(q) : MongooseUser.deleteMany(q)),
  countDocuments: (q) => (useMemoryStore ? memoryStore.users.countDocuments(q) : MongooseUser.countDocuments(q)),
};

export default User;
