import connectDB from "./db";

async function testConnection() {
  try {
    await connectDB();
    console.log('MongoDB Connected!');
    
    // Import mongoose untuk akses connection
    const mongoose = require('mongoose');
    
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Collections:', await mongoose.connection.db.listCollections().toArray());
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

testConnection();