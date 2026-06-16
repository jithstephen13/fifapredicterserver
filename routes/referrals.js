const express = require('express');
const router = express.Router();
const ReferralUser = require('../models/ReferralUser');
const ReferralRelationship = require('../models/ReferralRelationship');
const ReferralReward = require('../models/ReferralReward');
const ReferralClaim = require('../models/ReferralClaim');
const { authenticateAdmin } = require('./auth');

// Helper to generate referral code
function generateCode(phoneNumber, upiId) {
  const cleanUpi = upiId || '';
  const upiPrefix = cleanUpi.split('@')[0].replace(/[^a-zA-Z]/g, '').toUpperCase();
  const prefix = upiPrefix.substring(0, 4) || 'REF';
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomDigits}`;
}

// Generate Referral Code
router.post('/generate', async (req, res) => {
  const { phoneNumber, upiId } = req.body;

  if (!phoneNumber || !upiId) {
    return res.status(400).json({ error: 'Phone number and UPI ID are required.' });
  }

  const cleanPhone = phoneNumber.trim();
  const cleanUpi = upiId.trim();

  try {
    // Check if user already exists
    const existingUser = await ReferralUser.findOne({
      $or: [
        { phoneNumber: cleanPhone },
        { upiId: cleanUpi }
      ]
    });

    if (existingUser) {
      return res.json({ referralCode: existingUser.referralCode });
    }

    // Create a new unique code
    let referralCode;
    let attempts = 0;
    while (attempts < 10) {
      referralCode = generateCode(cleanPhone, cleanUpi);
      const exists = await ReferralUser.findOne({ referralCode });
      if (!exists) break;
      attempts++;
    }

    const newUser = new ReferralUser({
      phoneNumber: cleanPhone,
      upiId: cleanUpi,
      referralCode,
      createdAt: new Date()
    });

    await newUser.save();
    res.status(201).json({ referralCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recover Referral Code
router.post('/recover', async (req, res) => {
  const { phoneNumber, upiId } = req.body;

  if (!phoneNumber || !upiId) {
    return res.status(400).json({ error: 'Phone number and UPI ID are required.' });
  }

  try {
    const user = await ReferralUser.findOne({
      $or: [
        { phoneNumber: phoneNumber.trim() },
        { upiId: upiId.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Referral profile not found.' });
    }

    res.json({ referralCode: user.referralCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check Eligibility
router.post('/eligibility', async (req, res) => {
  const { referralCode } = req.body;

  if (!referralCode) {
    return res.status(400).json({ error: 'Referral code is required.' });
  }

  try {
    const user = await ReferralUser.findOne({ referralCode: referralCode.trim() });
    if (!user) {
      return res.status(404).json({ error: 'Referral code not found.' });
    }

    const rewards = await ReferralReward.find({ referrerId: user._id })
      .populate('referralRelationshipId')
      .sort({ createdAt: -1 });

    const formattedRewards = rewards.map(r => {
      const rel = r.referralRelationshipId;
      const phone = rel ? rel.referredPhoneNumber : '';
      const maskedPhone = phone.length >= 10
        ? `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`
        : '***';
      return {
        _id: r._id,
        rewardType: r.rewardType,
        amount: r.amount,
        status: r.status,
        referredPhoneNumber: maskedPhone,
        createdAt: r.createdAt
      };
    });

    res.json({
      totalEligible: user.totalEarned,
      totalClaimed: user.totalClaimed,
      pendingAmount: user.totalEarned - user.totalClaimed,
      rewards: formattedRewards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Claim Request
router.post('/claim', async (req, res) => {
  const { referralCode } = req.body;

  if (!referralCode) {
    return res.status(400).json({ error: 'Referral code is required.' });
  }

  try {
    const user = await ReferralUser.findOne({ referralCode: referralCode.trim() });
    if (!user) {
      return res.status(404).json({ error: 'Referral code not found.' });
    }

    const pendingAmount = user.totalEarned - user.totalClaimed;
    if (pendingAmount <= 0) {
      return res.status(400).json({ error: 'No pending amount eligible for claim.' });
    }

    // Block duplicate pending claims
    const existingPending = await ReferralClaim.findOne({
      referralUserId: user._id,
      status: 'pending'
    });

    if (existingPending) {
      return res.status(400).json({ error: 'You already have a pending claim request.' });
    }

    const claim = new ReferralClaim({
      referralCode: user.referralCode,
      referralUserId: user._id,
      amount: pendingAmount,
      status: 'pending',
      createdAt: new Date()
    });

    await claim.save();
    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: Get Claims
router.get('/admin/claims', authenticateAdmin, async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  try {
    const claims = await ReferralClaim.find(filter)
      .populate('referralUserId')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: Get Referral Users (For User Board list)
router.get('/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await ReferralUser.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: Mark Claim Paid
router.put('/admin/claims/:id/pay', authenticateAdmin, async (req, res) => {
  try {
    const claim = await ReferralClaim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found.' });
    }

    if (claim.status === 'paid') {
      return res.status(400).json({ error: 'Claim is already paid.' });
    }

    // Transition claim status
    claim.status = 'paid';
    claim.paidAt = new Date();
    await claim.save();

    // Update ReferralUser claimed status
    await ReferralUser.findByIdAndUpdate(
      claim.referralUserId,
      { $inc: { totalClaimed: claim.amount } }
    );

    // Set corresponding rewards to claimed
    await ReferralReward.updateMany(
      { referrerId: claim.referralUserId, status: 'eligible' },
      { $set: { status: 'claimed', claimedAt: new Date() } }
    );

    res.json({ message: 'Claim marked as paid.', claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
