const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  upiId: { type: String, required: true },
  predictedScoreA: { type: Number, required: true },
  predictedScoreB: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true }, // UPI UTR reference number
  paymentStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  isWinner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
