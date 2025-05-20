import connectDB from "./db";

async function testConnection() {
  try {
    const conn = await connectDB();
    console.log('MongoDB Connected!');
    console.log('Database name:', conn.connection.db.databaseName);
    console.log('Collections:', await conn.connection.db.listCollections().toArray());
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

testConnection();