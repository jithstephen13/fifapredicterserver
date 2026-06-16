const mongoose = require('mongoose');

const referralRelationshipSchema = new mongoose.Schema({
  referralCode: { type: String, required: true },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUser', required: true },
  referredPhoneNumber: { type: String, required: true },
  referredUpiId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a referrer can refer a referred user (phone number) only once
referralRelationshipSchema.index({ referrerId: 1, referredPhoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('ReferralRelationship', referralRelationshipSchema);
