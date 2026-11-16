const mongoose = require('mongoose');

// Cache the connection so serverless invocations on Vercel reuse it.
const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

module.exports = async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, { bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
};
