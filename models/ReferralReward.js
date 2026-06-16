const mongoose = require('mongoose');

const referralRewardSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUser', required: true },
  referralRelationshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralRelationship', required: true },
  rewardType: { type: String, enum: ['winningTeamReward', 'scoreReward'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['eligible', 'claimed'], default: 'eligible' },
  claimedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a referred user (represented by the relationship) can only generate one reward of a given type
referralRewardSchema.index({ referralRelationshipId: 1, rewardType: 1 }, { unique: true });

module.exports = mongoose.model('ReferralReward', referralRewardSchema);
