const Message = require('../models/Message');
const User = require('../models/User');

function getConversationKey(id1, id2) {
  return [id1.toString(), id2.toString()].sort().join('_');
}

// GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: -1 }).populate('sender', 'name avatar').populate('receiver', 'name avatar').populate('donationId', 'foodTitle');

    const convMap = {};
    for (const msg of messages) {
      if (!convMap[msg.conversationKey]) {
        const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
        convMap[msg.conversationKey] = {
          conversationKey: msg.conversationKey,
          otherUser: { _id: otherUser._id, name: otherUser.name, avatar: otherUser.avatar },
          donationId: msg.donationId?._id,
          donationTitle: msg.donationId?.foodTitle,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        };
      }
      if (msg.receiver._id.toString() === userId && !msg.read) {
        convMap[msg.conversationKey].unreadCount++;
      }
    }
    res.json(Object.values(convMap));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/chat/messages/:donationId/:otherUserId
const getMessages = async (req, res) => {
  try {
    const { donationId, otherUserId } = req.params;
    const key = getConversationKey(req.user._id, otherUserId);
    const messages = await Message.find({ conversationKey: key, donationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Mark as read
    await Message.updateMany(
      { conversationKey: key, donationId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// POST /api/chat/send
const sendMessage = async (req, res) => {
  try {
    const { donationId, receiverId, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });

    const key = getConversationKey(req.user._id, receiverId);
    const message = await Message.create({
      conversationKey: key,
      donationId,
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim(),
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Emit socket event
    try {
      const socketio = require('../socket');
      const io = socketio.getIO();
      io.emit('new_message', { message: populated, receiverId });
    } catch {}

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/chat/unread
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user._id, read: false });
    res.json({ unreadCount: count });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, getUnreadCount };
