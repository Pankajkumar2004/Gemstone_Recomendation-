const fs = require('fs');
const path = require('path');

const astrologersPath = path.join(__dirname, '../data/astrologers.json');

class ChatController {
  static getAvailableAstrologers(req, res) {
    try {
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      const availableAstrologers = data.astrologers.filter(a => a.isAvailable);
      res.json({ success: true, data: availableAstrologers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getAllAstrologers(req, res) {
    try {
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      res.json({ success: true, data: data.astrologers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static startChat(req, res) {
    try {
      const { userId, astrologerId } = req.body;
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      
      // Find available astrologer
      const astrologer = data.astrologers.find(a => a.id === astrologerId && a.isAvailable);
      
      if (!astrologer) {
        return res.status(400).json({ success: false, error: 'Astrologer not available' });
      }

      // Create chat ID
      const chatId = `chat_${Date.now()}_${userId}_${astrologerId}`;
      
      // Update astrologer status
      astrologer.isAvailable = false;
      astrologer.currentChat = chatId;
      
      // Add chat to chats array
      const newChat = {
        id: chatId,
        userId,
        astrologerId,
        astrologerName: astrologer.name,
        astrologerAvatar: astrologer.avatar,
        messages: [],
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      data.chats.push(newChat);
      fs.writeFileSync(astrologersPath, JSON.stringify(data, null, 2));
      
      res.json({ success: true, data: { chatId, astrologer } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static endChat(req, res) {
    try {
      const { chatId, astrologerId } = req.body;
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      
      // Update astrologer status
      const astrologer = data.astrologers.find(a => a.id === astrologerId);
      if (astrologer) {
        astrologer.isAvailable = true;
        astrologer.currentChat = null;
      }
      
      // Update chat status
      const chat = data.chats.find(c => c.id === chatId);
      if (chat) {
        chat.status = 'ended';
        chat.endedAt = new Date().toISOString();
      }
      
      fs.writeFileSync(astrologersPath, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static updateAstrologerAvailability(req, res) {
    try {
      const { astrologerId, isAvailable } = req.body;
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      
      const astrologer = data.astrologers.find(a => a.id === astrologerId);
      if (astrologer) {
        astrologer.isAvailable = isAvailable;
        if (!isAvailable) {
          astrologer.currentChat = null;
        }
      }
      
      fs.writeFileSync(astrologersPath, JSON.stringify(data, null, 2));
      res.json({ success: true, data: astrologer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getChatHistory(req, res) {
    try {
      const { chatId } = req.params;
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      
      const chat = data.chats.find(c => c.id === chatId);
      if (!chat) {
        return res.status(404).json({ success: false, error: 'Chat not found' });
      }
      
      res.json({ success: true, data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static saveMessage(req, res) {
    try {
      const { chatId, message } = req.body;
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      
      const chat = data.chats.find(c => c.id === chatId);
      if (!chat) {
        return res.status(404).json({ success: false, error: 'Chat not found' });
      }
      
      chat.messages.push({
        ...message,
        timestamp: new Date().toISOString()
      });
      
      fs.writeFileSync(astrologersPath, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getUserChats(req, res) {
    try {
      const { userId } = req.params;
      const data = JSON.parse(fs.readFileSync(astrologersPath, 'utf8'));
      
      const userChats = data.chats.filter(c => c.userId === userId);
      res.json({ success: true, data: userChats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = ChatController;
