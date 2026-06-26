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

  // Validate request body (excluding matchId since it is in predictions array for winningTeam)
  const predType = predictionType || 'score';
  if (!['winningTeam', 'score'].includes(predType)) {
    return res.status(400).json({ error: 'Invalid prediction type.' });
  }

  if (predType === 'score') {
    if (!matchId) {
      return res.status(400).json({ error: 'Match ID is required.' });
    }
  }

  if (!userName) {
    return res.status(400).json({ error: 'User name is required.' });
  }
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  if (!upiId) {
    return res.status(400).json({ error: 'UPI ID is required.' });
  }
  if (entryAmount === undefined) {
    return res.status(400).json({ error: 'Entry amount is required.' });
  }
  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required.' });
  }

  if (predType === 'winningTeam') {
    let predictionsList = req.body.predictions;
    if (!predictionsList && matchId && predictedWinner) {
      predictionsList = [{ matchId, predictedWinner }];
    }
    if (!Array.isArray(predictionsList) || predictionsList.length === 0) {
      return res.status(400).json({ error: 'Predictions list is required for winning team prediction.' });
    }

    for (const p of predictionsList) {
      if (!p.matchId || !p.predictedWinner || !['teamA', 'teamB', 'draw'].includes(p.predictedWinner)) {
        return res.status(400).json({ error: 'Winning team prediction and match ID are required for all selections.' });
      }
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
    if (numericEntryAmount < 50 || numericEntryAmount > 140) {
      return res.status(400).json({ error: 'Entry fee for winning team prediction must be between ₹50 and ₹140.' });
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
    const now = new Date();

    // If predictionType is winningTeam, validate all matches belong to same day and none started
    let targetMatches = [];
    let predictionsList = req.body.predictions || [];
    if (predType === 'winningTeam') {
      if (predictionsList.length === 0 && matchId && predictedWinner) {
        predictionsList = [{ matchId, predictedWinner }];
      }

      // Check first match exists
      const firstMatch = await Match.findById(predictionsList[0].matchId);
      if (!firstMatch) {
        return res.status(404).json({ error: 'Match not found.' });
      }

      const targetDay = getISTDateString(firstMatch.kickoffTime);

      // Find all scheduled matches on that day in Asia/Kolkata timezone
      const allActiveMatches = await Match.find({ status: 'scheduled' });
      const dayMatches = allActiveMatches.filter(m => getISTDateString(m.kickoffTime) === targetDay);

      // Ensure the user has predicted a minimum of 3 matches (or all if the day has < 3 scheduled matches)
      const minRequired = Math.min(3, dayMatches.length);
      if (predictionsList.length < minRequired) {
        return res.status(400).json({ error: `You must predict at least ${minRequired} matches of the day.` });
      }

      const dayMatchIds = dayMatches.map(m => m._id.toString());
      const predMatchIds = predictionsList.map(p => p.matchId.toString());
      const allMatchesValid = predMatchIds.every(id => dayMatchIds.includes(id));
      if (!allMatchesValid) {
        return res.status(400).json({ error: 'Some predicted matches do not belong to this day.' });
      }

      // Verify none of the matches of that day have started yet
      const startedMatch = dayMatches.find(m => new Date(m.kickoffTime) <= now);
      if (startedMatch) {
        return res.status(400).json({ error: 'Predictions are closed for this day as a match has already started.' });
      }

      targetMatches = dayMatches;
    } else {
      // Score prediction validations
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ error: 'Match not found.' });
      }

      if (match.status === 'completed') {
        return res.status(400).json({ error: 'Predictions are closed as the match is completed.' });
      }

      if (new Date(match.kickoffTime) <= now) {
        return res.status(400).json({ error: 'Predictions are closed as the match has already started.' });
      }

      targetMatches = [match];
    }

    // Check if transaction ID (or base transaction ID) has already been used
    const duplicateTx = await Prediction.findOne({
      transactionId: { $regex: new RegExp('^' + cleanTransactionId + '(_|$)') }
    });
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

    // Save predictions
    const savedPredictions = [];
    if (predType === 'winningTeam') {
      for (const predItem of predictionsList) {
        const predictionData = {
          matchId: predItem.matchId,
          userName: userName.trim(),
          phoneNumber: phoneNumber.trim(),
          upiId: upiId.trim(),
          predictionType: predType,
          entryAmount: numericEntryAmount,
          transactionId: `${cleanTransactionId}_${predItem.matchId}`,
          paymentStatus: 'pending',
          referralCode: referralCode ? referralCode.trim() : undefined,
          referredBy,
          referralApplied,
          predictedWinner: predItem.predictedWinner
        };
        const prediction = new Prediction(predictionData);
        await prediction.save();
        savedPredictions.push(prediction);
      }
    } else {
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
        referralApplied,
        predictedScoreA: parseInt(predictedScoreA),
        predictedScoreB: parseInt(predictedScoreB)
      };
      const prediction = new Prediction(predictionData);
      await prediction.save();
      savedPredictions.push(prediction);
    }

    res.status(201).json({
      message: 'Prediction submitted successfully! Pending admin verification.',
      prediction: savedPredictions[0],
      predictions: savedPredictions
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

    // Group winners by base transaction ID to handle day-wise winning team predictions
    const groupedWinners = {};
    for (const w of winners) {
      if (!w.matchId) continue;
      const baseTx = w.transactionId.split('_')[0];
      if (!groupedWinners[baseTx]) {
        groupedWinners[baseTx] = [];
      }
      groupedWinners[baseTx].push(w);
    }

    const publicWinners = [];
    for (const baseTx in groupedWinners) {
      const group = groupedWinners[baseTx];
      const w = group[0];

      const phone = w.phoneNumber || '';
      const maskedPhone = phone.length >= 10
        ? `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`
        : '***';

      const entryAmount = w.entryAmount || 20;
      const predictionType = w.predictionType || 'score';

      if (predictionType === 'winningTeam') {
        let allCorrect = true;
        const matchesList = [];

        for (const p of group) {
          const scoreA = p.matchId.result.scoreA;
          const scoreB = p.matchId.result.scoreB;
          let actualWinner;
          if (scoreA > scoreB) actualWinner = 'teamA';
          else if (scoreA < scoreB) actualWinner = 'teamB';
          else actualWinner = 'draw';

          if (p.predictedWinner !== actualWinner) {
            allCorrect = false;
            break;
          }

          matchesList.push({
            _id: p.matchId._id,
            teamA: p.matchId.teamA,
            teamALogo: p.matchId.teamALogo,
            teamB: p.matchId.teamB,
            teamBLogo: p.matchId.teamBLogo,
            result: p.matchId.result,
            predictedWinner: p.predictedWinner
          });
        }

        if (!allCorrect) continue;

        publicWinners.push({
          _id: w._id,
          userName: w.userName,
          phoneNumber: maskedPhone,
          predictionType,
          entryAmount,
          prizeAmount: entryAmount * 2,
          matches: matchesList,
          matchId: w.matchId,
          createdAt: w.createdAt
        });
      } else {
        // Score prediction
        if (
          w.predictedScoreA !== w.matchId.result.scoreA ||
          w.predictedScoreB !== w.matchId.result.scoreB
        ) {
          continue;
        }

        publicWinners.push({
          _id: w._id,
          userName: w.userName,
          phoneNumber: maskedPhone,
          predictionType,
          predictedWinner: w.predictedWinner,
          predictedScoreA: w.predictedScoreA,
          predictedScoreB: w.predictedScoreB,
          entryAmount,
          prizeAmount: entryAmount * 3,
          matchId: w.matchId,
          createdAt: w.createdAt
        });
      }
    }

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

    const results = [];
    for (const pred of predictions) {
      const predObj = pred.toObject();
      predObj.isGroupEligible = await checkGroupEligibility(pred);
      results.push(predObj);
    }

    res.json(results);
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
      return res.status(404).json({ error: 'Prediction not found ' });
    }

    // Update all predictions in the same day group
    const baseTx = prediction.transactionId.split('_')[0];
    await Prediction.updateMany(
      { transactionId: { $regex: new RegExp('^' + baseTx + '(_|$)') } },
      { $set: { paymentStatus } }
    );

    if (paymentStatus === 'verified' && prediction.referralApplied && prediction.referredBy) {
      // Find one of the updated predictions to pass
      const updatedPrediction = await Prediction.findById(req.params.id);
      await evaluateReferralRewards(updatedPrediction);
    }

    res.json({
      message: `Payment status updated to ${paymentStatus} for the group.`,
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

    // 2. Count verified unique transactions of the specific type for this referred user
    const allVerified = await Prediction.find({
      referredBy,
      phoneNumber,
      predictionType,
      paymentStatus: 'verified'
    });

    const uniqueTxIds = new Set(allVerified.map(p => p.transactionId.split('_')[0]));
    const verifiedCount = uniqueTxIds.size;

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

// Format date into standard Indian Standard Time (Asia/Kolkata) day string
const getISTDateString = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

// Check if all predictions in a winningTeam day-wise prediction group are correct
async function checkGroupEligibility(prediction) {
  if (prediction.predictionType !== 'winningTeam') {
    return true;
  }

  if (!prediction.transactionId.includes('_')) {
    return true; // Legacy single prediction
  }

  const baseTx = prediction.transactionId.split('_')[0];
  const group = await Prediction.find({
    transactionId: { $regex: new RegExp('^' + baseTx + '_') }
  }).populate('matchId');

  for (const p of group) {
    if (!p.matchId) return false;
    if (p.matchId.status !== 'completed') {
      return false; // Group is not fully completed yet
    }
    const sA = p.matchId.result.scoreA;
    const sB = p.matchId.result.scoreB;
    let actualWinner;
    if (sA > sB) actualWinner = 'teamA';
    else if (sA < sB) actualWinner = 'teamB';
    else actualWinner = 'draw';

    if (p.predictedWinner !== actualWinner) {
      return false; // One prediction in the group is incorrect
    }
  }

  return true;
}

module.exports = router;
