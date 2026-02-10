const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: req.user._id
    })
        .populate('participants', 'name email role')
        .populate('course', 'title')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

    res.json(conversations);
});

// @desc    Get conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
const getConversationById = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id)
        .populate('participants', 'name email role')
        .populate('course', 'title');

    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
        p => p._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error('Not authorized to view this conversation');
    }

    res.json(conversation);
});

// @desc    Create or get existing conversation
// @route   POST /api/conversations
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
    const { participantId, courseId } = req.body;

    if (!participantId) {
        res.status(400);
        throw new Error('Participant ID is required');
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
        participants: { $all: [req.user._id, participantId] },
        course: courseId || null
    })
        .populate('participants', 'name email role')
        .populate('course', 'title')
        .populate('lastMessage');

    if (existingConversation) {
        return res.json(existingConversation);
    }

    // Create new conversation
    const conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        course: courseId || null,
    });

    const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email role')
        .populate('course', 'title');

    res.status(201).json(populatedConversation);
});

// @desc    Get messages for a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
        p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const messages = await Message.find({ conversation: req.params.id })
        .populate('sender', 'name email role')
        .sort({ createdAt: 1 });

    res.json(messages);
});

// @desc    Send a message (HTTP fallback)
// @route   POST /api/conversations/:id/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const conversationId = req.params.id;

    if (!content) {
        res.status(400);
        throw new Error('Message content is required');
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
        p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        content,
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email role');

    res.status(201).json(populatedMessage);
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    message.read = true;
    await message.save();

    res.json(message);
});

module.exports = {
    getConversations,
    getConversationById,
    createConversation,
    getMessages,
    sendMessage,
    markAsRead,
};
