const express = require('express');
const router = express.Router();
const {
    getConversations,
    getConversationById,
    createConversation,
    getMessages,
    sendMessage,
    markAsRead,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getConversations)
    .post(createConversation);

router.route('/:id')
    .get(getConversationById);

router.route('/:id/messages')
    .get(getMessages)
    .post(sendMessage);

router.route('/messages/:id/read')
    .put(markAsRead);

module.exports = router;
