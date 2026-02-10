const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to ${process.env.MONGO_URI}: ${error.message}`);
    console.log('Attempting to start in-memory MongoDB...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Fatal Error: Could not connect to any MongoDB. ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
