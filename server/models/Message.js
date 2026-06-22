const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationKey: { type: String, required: true, index: true },
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
  read: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ donationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
