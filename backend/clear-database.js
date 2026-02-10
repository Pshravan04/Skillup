const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Exam = require('./src/models/Exam');
const Assignment = require('./src/models/Assignment');
const Submission = require('./src/models/Submission');
const Payment = require('./src/models/Payment');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected\n');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const clearDatabase = async () => {
    try {
        console.log('🗑️  Clearing all data from database...\n');

        await User.deleteMany({});
        console.log('✅ Deleted all users');

        await Course.deleteMany({});
        console.log('✅ Deleted all courses');

        await Exam.deleteMany({});
        console.log('✅ Deleted all exams');

        await Assignment.deleteMany({});
        console.log('✅ Deleted all assignments');

        await Submission.deleteMany({});
        console.log('✅ Deleted all submissions');

        await Payment.deleteMany({});
        console.log('✅ Deleted all payments');

        console.log('\n🎉 Database cleared successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Register a new instructor account through the UI');
        console.log('2. Register a new student account through the UI');
        console.log('3. Update seed-my-accounts.js with your new email addresses');
        console.log('4. Run: node seed-my-accounts.js');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
};

connectDB().then(() => clearDatabase());
