const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  teamALogo: { type: String }, // Emoji or URL
  teamBLogo: { type: String }, // Emoji or URL
  kickoffTime: { type: Date, required: true }, // Unified Date and Time of kick-off
  status: { type: String, enum: ['scheduled', 'completed'], default: 'scheduled' },
  result: {
    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 }
  },
  winnerCount: { type: Number, default: 2 },
  prizeAmount: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
