const mongoose = require('mongoose');

const referralUserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  upiId: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  totalEarned: { type: Number, default: 0 },
  totalClaimed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReferralUser', referralUserSchema);
