const mongoose = require('mongoose');

const referralClaimSchema = new mongoose.Schema({
  referralCode: { type: String, required: true },
  referralUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUser', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }
});

module.exports = mongoose.model('ReferralClaim', referralClaimSchema);
