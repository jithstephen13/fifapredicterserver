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

    res.json({
      message: 'Match marked as completed',
      match,
      exactPredictionsCount: exactPredictions.length,
      exactPredictions // Send predictions list to the client so admin can verify who paid and pick winners
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

    // Reset previous winners for this match
    await Prediction.updateMany({ matchId: match._id }, { $set: { isWinner: false } });

    // Mark the new selected predictions as winners
    await Prediction.updateMany(
      { _id: { $in: predictionIds }, matchId: match._id },
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

module.exports = router;
