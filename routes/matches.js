const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const { authenticateAdmin } = require('./auth');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ kickoffTime: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming active matches (kickoffTime > now)
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.find({
      kickoffTime: { $gt: now },
      status: 'scheduled'
    }).sort({ kickoffTime: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new match (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  const { teamA, teamB, teamALogo, teamBLogo, kickoffTime, winnerCount, prizeAmount } = req.body;

  if (!teamA || !teamB || !kickoffTime) {
    return res.status(400).json({ error: 'Team A, Team B, and kickoff time are required' });
  }

  try {
    const match = new Match({
      teamA,
      teamB,
      teamALogo: teamALogo || '',
      teamBLogo: teamBLogo || '',
      kickoffTime: new Date(kickoffTime),
      winnerCount: winnerCount || 2,
      prizeAmount: prizeAmount || 100
    });
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Edit match details (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  const { teamA, teamB, teamALogo, teamBLogo, kickoffTime, winnerCount, prizeAmount } = req.body;

  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status === 'completed') {
      return res.status(400).json({ error: 'Cannot edit a completed match' });
    }

    if (teamA) match.teamA = teamA;
    if (teamB) match.teamB = teamB;
    if (teamALogo !== undefined) match.teamALogo = teamALogo;
    if (teamBLogo !== undefined) match.teamBLogo = teamBLogo;
    if (kickoffTime) match.kickoffTime = new Date(kickoffTime);
    if (winnerCount) match.winnerCount = winnerCount;
    if (prizeAmount) match.prizeAmount = prizeAmount;

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete match and set result (Admin only)
router.post('/:id/complete', authenticateAdmin, async (req, res) => {
  const { scoreA, scoreB } = req.body;

  if (scoreA === undefined || scoreB === undefined) {
    return res.status(400).json({ error: 'Score A and Score B are required' });
  }

  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    match.status = 'completed';
    match.result = {
      scoreA: parseInt(scoreA),
      scoreB: parseInt(scoreB)
    };

    await match.save();

    // Compute actual winner
    let actualWinner;
    const sA = parseInt(scoreA);
    const sB = parseInt(scoreB);
    if (sA > sB) {
      actualWinner = 'teamA';
    } else if (sA < sB) {
      actualWinner = 'teamB';
    } else {
      actualWinner = 'draw';
    }

    // Find all predictions that are correct (exact score or winning team match)
    const exactPredictions = await Prediction.find({
      matchId: match._id,
      $or: [
        {
          predictionType: { $ne: 'winningTeam' }, // Defaults to 'score'
          predictedScoreA: sA,
          predictedScoreB: sB
        },
        {
          predictionType: 'winningTeam',
          predictedWinner: actualWinner
        }
      ]
    });

    const eligiblePredictions = [];
    for (const pred of exactPredictions) {
      const isEligible = await checkGroupEligibility(pred);
      if (isEligible) {
        eligiblePredictions.push(pred);
      }
    }

    res.json({
      message: 'Match marked as completed',
      match,
      exactPredictionsCount: eligiblePredictions.length,
      exactPredictions: eligiblePredictions // Send predictions list to the client so admin can verify who paid and pick winners
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set Winners for a match (Admin only)
router.post('/:id/winners', authenticateAdmin, async (req, res) => {
  const { predictionIds } = req.body; // Array of prediction IDs selected as winners

  if (!Array.isArray(predictionIds)) {
    return res.status(400).json({ error: 'predictionIds must be an array' });
  }

  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'completed') {
      return res.status(400).json({ error: 'Match must be completed before picking winners' });
    }

    // Find all predictions currently selected as winners
    const selectedPredictions = await Prediction.find({ _id: { $in: predictionIds } });

    // Build the set of all prediction IDs that should be set as winners
    const allWinnerIds = new Set();
    for (const p of selectedPredictions) {
      if (p.predictionType === 'winningTeam') {
        const isEligible = await checkGroupEligibility(p);
        if (!isEligible) {
          return res.status(400).json({ error: `Prediction ${p._id} is not eligible to be a winner (either the day prediction group is incomplete or some matches are incorrect).` });
        }
        
        // Also check correctness for legacy single winningTeam prediction since checkGroupEligibility returns true for it
        if (!p.transactionId.includes('_')) {
          const matchOfPred = await Match.findById(p.matchId);
          if (!matchOfPred || matchOfPred.status !== 'completed') {
            return res.status(400).json({ error: `Match for prediction ${p._id} is not completed.` });
          }
          const sA = matchOfPred.result.scoreA;
          const sB = matchOfPred.result.scoreB;
          const actualWinner = sA > sB ? 'teamA' : sA < sB ? 'teamB' : 'draw';
          if (p.predictedWinner !== actualWinner) {
            return res.status(400).json({ error: `Prediction ${p._id} is incorrect.` });
          }
        }

        if (p.transactionId.includes('_')) {
          const baseTx = p.transactionId.split('_')[0];
          const group = await Prediction.find({
            transactionId: { $regex: new RegExp('^' + baseTx + '_') }
          });
          group.forEach(g => allWinnerIds.add(g._id.toString()));
        } else {
          allWinnerIds.add(p._id.toString());
        }
      } else {
        // Score prediction
        const matchOfPred = await Match.findById(p.matchId);
        if (!matchOfPred || matchOfPred.status !== 'completed') {
          return res.status(400).json({ error: `Match for prediction ${p._id} is not completed.` });
        }
        if (p.predictedScoreA !== matchOfPred.result.scoreA || p.predictedScoreB !== matchOfPred.result.scoreB) {
          return res.status(400).json({ error: `Score prediction ${p._id} is incorrect.` });
        }
        allWinnerIds.add(p._id.toString());
      }
    }

    // Reset previous winners:
    // Any prediction for this match that was marked as winner needs to be reset.
    // If it was a winningTeam day-wise prediction, we must reset the whole day group!
    const previousWinners = await Prediction.find({ matchId: match._id, isWinner: true });
    for (const p of previousWinners) {
      if (p.predictionType === 'winningTeam' && p.transactionId.includes('_')) {
        const baseTx = p.transactionId.split('_')[0];
        await Prediction.updateMany(
          { transactionId: { $regex: new RegExp('^' + baseTx + '_') } },
          { $set: { isWinner: false } }
        );
      } else {
        p.isWinner = false;
        await p.save();
      }
    }

    // Now mark the new set of predictions as winners
    await Prediction.updateMany(
      { _id: { $in: Array.from(allWinnerIds) } },
      { $set: { isWinner: true } }
    );

    const winners = await Prediction.find({ matchId: match._id, isWinner: true });

    res.json({
      message: 'Winners set successfully',
      winners
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a match (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Also delete associated predictions
    await Prediction.deleteMany({ matchId: match._id });
    await Match.findByIdAndDelete(req.params.id);

    res.json({ message: 'Match and its predictions deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
