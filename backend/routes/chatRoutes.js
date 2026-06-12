const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

// Get available astrologers
router.get('/astrologers/available', ChatController.getAvailableAstrologers);

// Get all astrologers
router.get('/astrologers', ChatController.getAllAstrologers);

// Start a chat with an astrologer
router.post('/start', ChatController.startChat);

// End a chat
router.post('/end', ChatController.endChat);

// Update astrologer availability
router.put('/astrologer/availability', ChatController.updateAstrologerAvailability);

// Get chat history
router.get('/history/:chatId', ChatController.getChatHistory);

// Save message to chat
router.post('/message', ChatController.saveMessage);

// Get user's chats
router.get('/user/:userId', ChatController.getUserChats);

module.exports = router;
