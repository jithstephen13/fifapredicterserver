const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Match = require('../models/Match');
const { authenticateAdmin } = require('./auth');

// Submit a new prediction
router.post('/', async (req, res) => {
  const {
    matchId,
    userName,
    phoneNumber,
    upiId,
    predictedScoreA,
    predictedScoreB,
    entryAmount,
    transactionId
  } = req.body;

  // Validate request body
  if (
    !matchId ||
    !userName ||
    !phoneNumber ||
    !upiId ||
    predictedScoreA === undefined ||
    predictedScoreB === undefined ||
    entryAmount === undefined ||
    !transactionId
  ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate entry amount
  const numericEntryAmount = parseInt(entryAmount);
  if (isNaN(numericEntryAmount) || numericEntryAmount < 20 || numericEntryAmount > 100) {
    return res.status(400).json({ error: 'Entry fee must be a number between ₹20 and ₹100.' });
  }

  // Validate UTR format (UPI Transaction IDs are typically 12-digit numbers in India)
  const cleanTransactionId = transactionId.trim();
  if (!/^\d{12}$/.test(cleanTransactionId)) {
    return res.status(400).json({ error: 'UPI UTR / Ref No must be a 12-digit number.' });
  }

  try {
    // Check if match exists and is scheduled (not completed)
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.status === 'completed') {
      return res.status(400).json({ error: 'Predictions are closed as the match is completed.' });
    }

    // Check if kickoff time has passed
    const now = new Date();
    if (new Date(match.kickoffTime) <= now) {
      return res.status(400).json({ error: 'Predictions are closed as the match has already started.' });
    }



    // Check if transaction ID has already been used
    const duplicateTx = await Prediction.findOne({ transactionId: cleanTransactionId });
    if (duplicateTx) {
      return res.status(400).json({ error: 'This UPI UTR / Transaction ID has already been submitted.' });
    }

    // Create the prediction
    const prediction = new Prediction({
      matchId,
      userName: userName.trim(),
      phoneNumber: phoneNumber.trim(),
      upiId: upiId.trim(),
      predictedScoreA: parseInt(predictedScoreA),
      predictedScoreB: parseInt(predictedScoreB),
      entryAmount: numericEntryAmount,
      transactionId: cleanTransactionId,
      paymentStatus: 'pending'
    });

    await prediction.save();
    res.status(201).json({
      message: 'Prediction submitted successfully! Pending admin verification.',
      prediction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get predictions by user's phone number (Public tracking)
router.get('/my-predictions', async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    const predictions = await Prediction.find({ phoneNumber: phoneNumber.trim() })
      .populate('matchId')
      .sort({ createdAt: -1 });

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all winners (Public view)
router.get('/winners', async (req, res) => {
  try {
    const winners = await Prediction.find({ isWinner: true })
      .populate('matchId')
      .sort({ createdAt: -1 });
    
    const publicWinners = winners.map(w => {
      if (!w.matchId) return null;

      // Ensure the predicted score matches the actual match result
      if (
        w.predictedScoreA !== w.matchId.result.scoreA ||
        w.predictedScoreB !== w.matchId.result.scoreB
      ) {
        return null;
      }

      const phone = w.phoneNumber || '';
      const maskedPhone = phone.length >= 10 
        ? `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`
        : '***';
        
      return {
        _id: w._id,
        userName: w.userName,
        phoneNumber: maskedPhone,
        predictedScoreA: w.predictedScoreA,
        predictedScoreB: w.predictedScoreB,
        entryAmount: w.entryAmount || 20,
        prizeAmount: (w.entryAmount || 20) * 3,
        matchId: {
          _id: w.matchId._id,
          teamA: w.matchId.teamA,
          teamALogo: w.matchId.teamALogo,
          teamB: w.matchId.teamB,
          teamBLogo: w.matchId.teamBLogo,
          result: w.matchId.result
        },
        createdAt: w.createdAt
      };
    }).filter(Boolean);

    res.json(publicWinners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all predictions with filtering options
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  const { matchId, paymentStatus, search } = req.query;
  const filter = {};

  if (matchId) {
    filter.matchId = matchId;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } },
      { transactionId: { $regex: search, $options: 'i' } },
      { upiId: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const predictions = await Prediction.find(filter)
      .populate('matchId')
      .sort({ createdAt: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Verify payment (Approve/Reject)
router.put('/:id/payment', authenticateAdmin, async (req, res) => {
  const { paymentStatus } = req.body;

  if (!paymentStatus || !['pending', 'verified', 'rejected'].includes(paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status.' });
  }

  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found.' });
    }

    prediction.paymentStatus = paymentStatus;
    await prediction.save();

    res.json({
      message: `Payment status updated to ${paymentStatus}.`,
      prediction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
