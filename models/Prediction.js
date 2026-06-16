const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  upiId: { type: String, required: true },
  predictedScoreA: { type: Number },
  predictedScoreB: { type: Number },
  predictionType: { type: String, enum: ['winningTeam', 'score'], required: true, default: 'score' },
  predictedWinner: { type: String, enum: ['teamA', 'teamB', 'draw'] },
  entryAmount: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true }, // UPI UTR reference number
  paymentStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  isWinner: { type: Boolean, default: false },
  referralCode: { type: String },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUser' },
  referralApplied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
