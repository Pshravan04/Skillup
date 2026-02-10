const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected\n');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const listUsers = async () => {
    try {
        const users = await User.find({}).select('name email role');

        console.log('📋 All Users in Database:\n');
        console.log('INSTRUCTORS:');
        const instructors = users.filter(u => u.role === 'instructor');
        if (instructors.length === 0) {
            console.log('  (none found)');
        } else {
            instructors.forEach(u => console.log(`  - ${u.name} <${u.email}>`));
        }

        console.log('\nSTUDENTS:');
        const students = users.filter(u => u.role === 'student');
        if (students.length === 0) {
            console.log('  (none found)');
        } else {
            students.forEach(u => console.log(`  - ${u.name} <${u.email}>`));
        }

        console.log(`\nTotal: ${users.length} users (${instructors.length} instructors, ${students.length} students)\n`);

        // Output for easy copy-paste
        if (instructors.length > 0 && students.length > 0) {
            console.log('📝 For seed-my-accounts.js, use these emails:');
            console.log(`const instructorEmail = '${instructors[0].email}';`);
            console.log(`const student1Email = '${students[0].email}';`);
            if (students.length > 1) {
                console.log(`const student2Email = '${students[1].email}';`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB().then(() => listUsers());
