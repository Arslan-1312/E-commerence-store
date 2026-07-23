import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bwc_luxury_db';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Warning: Local MongoDB connection skipped (${error.message}). Operating with resilient in-memory database mode for seamless experience.`);
    return false;
  }
};
