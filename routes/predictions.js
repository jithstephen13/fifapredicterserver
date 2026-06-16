const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Match = require('../models/Match');
const ReferralUser = require('../models/ReferralUser');
const ReferralRelationship = require('../models/ReferralRelationship');
const ReferralReward = require('../models/ReferralReward');
const { authenticateAdmin } = require('./auth');

// Submit a new prediction
router.post('/', async (req, res) => {
  const {
    matchId,
    userName,
    phoneNumber,
    upiId,
    predictionType,
    predictedWinner,
    predictedScoreA,
    predictedScoreB,
    entryAmount,
    transactionId,
    referralCode
  } = req.body;

  // Validate request body
  if (
    !matchId ||
    !userName ||
    !phoneNumber ||
    !upiId ||
    entryAmount === undefined ||
    !transactionId
  ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const predType = predictionType || 'score';
  if (!['winningTeam', 'score'].includes(predType)) {
    return res.status(400).json({ error: 'Invalid prediction type.' });
  }

  if (predType === 'winningTeam') {
    if (!predictedWinner || !['teamA', 'teamB', 'draw'].includes(predictedWinner)) {
      return res.status(400).json({ error: 'Winning team prediction is required.' });
    }
  } else {
    if (predictedScoreA === undefined || predictedScoreB === undefined) {
      return res.status(400).json({ error: 'Predicted score is required.' });
    }
  }

  // Validate entry amount
  const numericEntryAmount = parseInt(entryAmount);
  if (isNaN(numericEntryAmount)) {
    return res.status(400).json({ error: 'Entry fee must be a number.' });
  }

  if (predType === 'winningTeam') {
    if (numericEntryAmount < 20 || numericEntryAmount > 40) {
      return res.status(400).json({ error: 'Entry fee for winning team prediction must be between ₹20 and ₹40.' });
    }
  } else {
    if (numericEntryAmount < 100 || numericEntryAmount > 300) {
      return res.status(400).json({ error: 'Entry fee for score prediction must be between ₹100 and ₹300.' });
    }
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

    let referralApplied = false;
    let referredBy = undefined;

    if (referralCode && referralCode.trim()) {
      const cleanRefCode = referralCode.trim();
      const referralOwner = await ReferralUser.findOne({ referralCode: cleanRefCode });
      if (!referralOwner) {
        return res.status(400).json({ error: 'Invalid referral code.' });
      }

      // Rule 1: Self referral check
      if (phoneNumber.trim() === referralOwner.phoneNumber || upiId.trim() === referralOwner.upiId) {
        referralApplied = false;
      } else {
        // Rule 2: Valid and belongs to another user
        // Find or create relationship
        let relationship = await ReferralRelationship.findOne({
          referrerId: referralOwner._id,
          referredPhoneNumber: phoneNumber.trim()
        });

        if (!relationship) {
          relationship = new ReferralRelationship({
            referralCode: cleanRefCode,
            referrerId: referralOwner._id,
            referredPhoneNumber: phoneNumber.trim(),
            referredUpiId: upiId.trim(),
            createdAt: new Date()
          });
          await relationship.save();
        }

        referralApplied = true;
        referredBy = referralOwner._id;
      }
    }

    // Create the prediction
    const predictionData = {
      matchId,
      userName: userName.trim(),
      phoneNumber: phoneNumber.trim(),
      upiId: upiId.trim(),
      predictionType: predType,
      entryAmount: numericEntryAmount,
      transactionId: cleanTransactionId,
      paymentStatus: 'pending',
      referralCode: referralCode ? referralCode.trim() : undefined,
      referredBy,
      referralApplied
    };

    if (predType === 'winningTeam') {
      predictionData.predictedWinner = predictedWinner;
    } else {
      predictionData.predictedScoreA = parseInt(predictedScoreA);
      predictionData.predictedScoreB = parseInt(predictedScoreB);
    }

    const prediction = new Prediction(predictionData);

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

      const predType = w.predictionType || 'score';

      if (predType === 'winningTeam') {
        let actualWinner;
        const scoreA = w.matchId.result.scoreA;
        const scoreB = w.matchId.result.scoreB;
        if (scoreA > scoreB) {
          actualWinner = 'teamA';
        } else if (scoreA < scoreB) {
          actualWinner = 'teamB';
        } else {
          actualWinner = 'draw';
        }

        if (w.predictedWinner !== actualWinner) {
          return null;
        }
      } else {
        // Ensure the predicted score matches the actual match result
        if (
          w.predictedScoreA !== w.matchId.result.scoreA ||
          w.predictedScoreB !== w.matchId.result.scoreB
        ) {
          return null;
        }
      }

      const phone = w.phoneNumber || '';
      const maskedPhone = phone.length >= 10 
        ? `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`
        : '***';
        
      return {
        _id: w._id,
        userName: w.userName,
        phoneNumber: maskedPhone,
        predictionType: predType,
        predictedWinner: w.predictedWinner,
        predictedScoreA: w.predictedScoreA,
        predictedScoreB: w.predictedScoreB,
        entryAmount: w.entryAmount || 20,
        prizeAmount: predType === 'winningTeam' ? (w.entryAmount || 20) * 2 : (w.entryAmount || 20) * 3,
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

    if (paymentStatus === 'verified' && prediction.referralApplied && prediction.referredBy) {
      await evaluateReferralRewards(prediction);
    }

    res.json({
      message: `Payment status updated to ${paymentStatus}.`,
      prediction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function evaluateReferralRewards(prediction) {
  try {
    const { referredBy, phoneNumber, predictionType } = prediction;
    if (!referredBy || !phoneNumber) return;

    // 1. Find referral relationship
    const relationship = await ReferralRelationship.findOne({
      referrerId: referredBy,
      referredPhoneNumber: phoneNumber
    });

    if (!relationship) {
      console.warn(`Referral relationship not found for referrer ${referredBy} and phone ${phoneNumber}`);
      return;
    }

    // 2. Count verified predictions of the specific type for this referred user
    const verifiedCount = await Prediction.countDocuments({
      referredBy,
      phoneNumber,
      predictionType,
      paymentStatus: 'verified'
    });

    // 3. Check thresholds & Create reward if eligible
    if (predictionType === 'winningTeam') {
      if (verifiedCount >= 5) {
        // Check if reward already exists to prevent duplicates
        const existingReward = await ReferralReward.findOne({
          referralRelationshipId: relationship._id,
          rewardType: 'winningTeamReward'
        });

        if (!existingReward) {
          const reward = new ReferralReward({
            referrerId: referredBy,
            referralRelationshipId: relationship._id,
            rewardType: 'winningTeamReward',
            amount: 50,
            status: 'eligible',
            createdAt: new Date()
          });
          await reward.save();

          // Update ReferralUser's totalEarned
          await ReferralUser.findByIdAndUpdate(referredBy, {
            $inc: { totalEarned: 50 }
          });
        }
      }
    } else if (predictionType === 'score') {
      if (verifiedCount >= 3) {
        // Check if reward already exists to prevent duplicates
        const existingReward = await ReferralReward.findOne({
          referralRelationshipId: relationship._id,
          rewardType: 'scoreReward'
        });

        if (!existingReward) {
          const reward = new ReferralReward({
            referrerId: referredBy,
            referralRelationshipId: relationship._id,
            rewardType: 'scoreReward',
            amount: 100,
            status: 'eligible',
            createdAt: new Date()
          });
          await reward.save();

          // Update ReferralUser's totalEarned
          await ReferralUser.findByIdAndUpdate(referredBy, {
            $inc: { totalEarned: 100 }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error in evaluateReferralRewards:', error);
  }
}

module.exports = router;
