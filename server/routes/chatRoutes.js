const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConversations, getMessages, sendMessage, getUnreadCount } = require('../controllers/chatController');

router.get('/conversations', protect, getConversations);
router.get('/messages/:donationId/:otherUserId', protect, getMessages);
router.post('/send', protect, sendMessage);
router.get('/unread', protect, getUnreadCount);

module.exports = router;
