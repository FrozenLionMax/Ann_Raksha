const mongoose = require('mongoose');

const recurringDonationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template: {
    foodTitle: { type: String, required: true },
    foodType: { type: String, required: true },
    quantity: { type: String, required: true },
    servesPeople: { type: Number, required: true },
    pickupAddress: { type: String, required: true },
    location: { lat: Number, lng: Number },
    urgencyLevel: { type: String, default: 'normal' },
    description: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
  },
  frequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], required: true },
  nextRun: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  lastRun: { type: Date, default: null },
  runCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('RecurringDonation', recurringDonationSchema);
