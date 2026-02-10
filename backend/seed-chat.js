const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Conversation = require('./src/models/Conversation');
const Message = require('./src/models/Message');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedChatData = async () => {
    try {
        await connectDB();

        // Find existing users
        const students = await User.find({ role: 'student' }).limit(3);
        const instructors = await User.find({ role: 'instructor' }).limit(2);
        const courses = await Course.find().limit(2);

        if (students.length === 0 || instructors.length === 0) {
            console.log('No users found. Please run the main seed script first.');
            process.exit(1);
        }

        console.log(`Found ${students.length} students and ${instructors.length} instructors`);

        // Clear existing chat data
        await Conversation.deleteMany({});
        await Message.deleteMany({});
        console.log('Cleared existing chat data');

        // Create conversations and messages
        const conversationsData = [];

        // Conversation 1: Student 1 <-> Instructor 1 (Course-related)
        if (students[0] && instructors[0]) {
            const conv1 = await Conversation.create({
                participants: [students[0]._id, instructors[0]._id],
                course: courses[0]?._id || null,
            });

            const messages1 = await Message.insertMany([
                {
                    conversation: conv1._id,
                    sender: students[0]._id,
                    content: "Hi! I have a question about the assignment deadline.",
                    createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
                },
                {
                    conversation: conv1._id,
                    sender: instructors[0]._id,
                    content: "Hello! The assignment is due this Friday at 11:59 PM. Do you need any help with it?",
                    createdAt: new Date(Date.now() - 3600000 * 23),
                },
                {
                    conversation: conv1._id,
                    sender: students[0]._id,
                    content: "Yes, I'm having trouble understanding the third question. Could you provide some guidance?",
                    createdAt: new Date(Date.now() - 3600000 * 22),
                },
                {
                    conversation: conv1._id,
                    sender: instructors[0]._id,
                    content: "Of course! The third question is about applying the concepts we covered in Week 3. Try reviewing the lecture notes on data structures first.",
                    createdAt: new Date(Date.now() - 3600000 * 21),
                },
                {
                    conversation: conv1._id,
                    sender: students[0]._id,
                    content: "That helps a lot! Thank you so much!",
                    createdAt: new Date(Date.now() - 3600000 * 20),
                },
            ]);

            conv1.lastMessage = messages1[messages1.length - 1]._id;
            await conv1.save();
            conversationsData.push(conv1);
        }

        // Conversation 2: Student 2 <-> Instructor 1 (General inquiry)
        if (students[1] && instructors[0]) {
            const conv2 = await Conversation.create({
                participants: [students[1]._id, instructors[0]._id],
            });

            const messages2 = await Message.insertMany([
                {
                    conversation: conv2._id,
                    sender: students[1]._id,
                    content: "Hello Professor! When will the exam results be published?",
                    createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
                },
                {
                    conversation: conv2._id,
                    sender: instructors[0]._id,
                    content: "Hi! I'm currently grading the exams. Results should be available by tomorrow evening.",
                    createdAt: new Date(Date.now() - 3600000 * 11),
                },
                {
                    conversation: conv2._id,
                    sender: students[1]._id,
                    content: "Great, thank you! Also, will there be a review session?",
                    createdAt: new Date(Date.now() - 3600000 * 10),
                },
                {
                    conversation: conv2._id,
                    sender: instructors[0]._id,
                    content: "Yes! I'll schedule a review session for next week. I'll send out the details via email.",
                    createdAt: new Date(Date.now() - 3600000 * 9),
                },
            ]);

            conv2.lastMessage = messages2[messages2.length - 1]._id;
            await conv2.save();
            conversationsData.push(conv2);
        }

        // Conversation 3: Student 1 <-> Instructor 2 (if available)
        if (students[0] && instructors[1]) {
            const conv3 = await Conversation.create({
                participants: [students[0]._id, instructors[1]._id],
                course: courses[1]?._id || null,
            });

            const messages3 = await Message.insertMany([
                {
                    conversation: conv3._id,
                    sender: students[0]._id,
                    content: "Hi! I'm interested in learning more about advanced topics in this course.",
                    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
                },
                {
                    conversation: conv3._id,
                    sender: instructors[1]._id,
                    content: "That's great to hear! We'll be covering advanced topics in the next module. Feel free to ask questions anytime.",
                    createdAt: new Date(Date.now() - 3600000 * 4),
                },
                {
                    conversation: conv3._id,
                    sender: students[0]._id,
                    content: "Perfect! Looking forward to it.",
                    createdAt: new Date(Date.now() - 3600000 * 3),
                },
            ]);

            conv3.lastMessage = messages3[messages3.length - 1]._id;
            await conv3.save();
            conversationsData.push(conv3);
        }

        // Conversation 4: Student 3 <-> Instructor 1 (Recent)
        if (students[2] && instructors[0]) {
            const conv4 = await Conversation.create({
                participants: [students[2]._id, instructors[0]._id],
            });

            const messages4 = await Message.insertMany([
                {
                    conversation: conv4._id,
                    sender: students[2]._id,
                    content: "Hello! Can I schedule office hours with you?",
                    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
                },
                {
                    conversation: conv4._id,
                    sender: instructors[0]._id,
                    content: "Sure! I have availability on Tuesday and Thursday afternoons. What works best for you?",
                    createdAt: new Date(Date.now() - 3600000 * 1),
                },
                {
                    conversation: conv4._id,
                    sender: students[2]._id,
                    content: "Thursday at 2 PM would be perfect!",
                    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
                },
                {
                    conversation: conv4._id,
                    sender: instructors[0]._id,
                    content: "Great! I'll see you Thursday at 2 PM in my office.",
                    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
                },
            ]);

            conv4.lastMessage = messages4[messages4.length - 1]._id;
            await conv4.save();
            conversationsData.push(conv4);
        }

        console.log(`✅ Created ${conversationsData.length} conversations with demo messages`);
        console.log('\nDemo Chat Data Summary:');
        console.log('- Conversation topics: Assignment help, exam results, course inquiries, office hours');
        console.log('- Messages span from 1 day ago to 15 minutes ago');
        console.log('- Mix of course-related and general conversations');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding chat data:', error);
        process.exit(1);
    }
};

seedChatData();
