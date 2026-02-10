const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:1234',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/conversations', require('./routes/chatRoutes'));

// Socket.io connection handling
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
        try {
            const { conversationId, senderId, content } = data;

            // Create message in database
            const message = await Message.create({
                conversation: conversationId,
                sender: senderId,
                content,
            });

            // Update conversation's last message
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: message._id,
            });

            // Populate sender info
            const populatedMessage = await Message.findById(message._id)
                .populate('sender', 'name email role');

            // Emit to all users in the conversation room
            io.to(conversationId).emit('message_received', populatedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        socket.to(data.conversationId).emit('user_typing', {
            userId: data.userId,
            userName: data.userName
        });
    });

    socket.on('stop_typing', (data) => {
        socket.to(data.conversationId).emit('user_stop_typing', {
            userId: data.userId
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
