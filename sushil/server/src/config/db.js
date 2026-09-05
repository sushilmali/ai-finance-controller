import mongoose from 'mongoose';

export let isConnected = false;
export let useMemoryStore = true; // Default to fast memory store, upgrade to MongoDB if available

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
    // Try fast local connect with 1000ms timeout
    try {
      const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/ai_finance_controller', {
        serverSelectionTimeoutMS: 1200,
        connectTimeoutMS: 1200
      });
      isConnected = true;
      useMemoryStore = false;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.log(`⚡ MongoDB daemon not detected locally. Operating in High-Speed Zero-Config Memory Mode.`);
      isConnected = true;
      useMemoryStore = true;
      return;
    }
  }

  // Atlas or remote MongoDB URI provided
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`✅ Remote MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Remote MongoDB connection failed (${err.message}). Using fallback memory store.`);
    isConnected = true;
    useMemoryStore = true;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  mode: useMemoryStore ? 'In-Memory / Local Storage (Zero-Config Active)' : 'MongoDB Atlas Connected',
  isMemoryStore: useMemoryStore
});
