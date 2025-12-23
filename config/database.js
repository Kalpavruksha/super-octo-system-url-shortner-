const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug: Show what URI we're trying to connect to (hide password)
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🔌 Connecting to MongoDB: ${maskedUri}`);

    // Connection options for better stability with MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(uri, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Setup cleanup job for expired URLs
    setupExpiryCleanup();

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Cleanup expired URLs every hour
const setupExpiryCleanup = () => {
  const URL = require('../models/Url');

  setInterval(async () => {
    try {
      const result = await URL.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} expired URLs`);
      }
    } catch (error) {
      console.error('Error cleaning up expired URLs:', error);
    }
  }, 60 * 60 * 1000); // Run every hour
};

module.exports = connectDB;
