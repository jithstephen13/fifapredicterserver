const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// Import Schemas & Models
const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const ReferralUser = require('../models/ReferralUser');
const ReferralRelationship = require('../models/ReferralRelationship');
const ReferralReward = require('../models/ReferralReward');
const ReferralClaim = require('../models/ReferralClaim');

// Config test database connection
const MONGODB_TEST_URI = 'mongodb+srv://jithsti:uthirakallingal@cluster0.dba5hdg.mongodb.net/fifa_test?retryWrites=true&w=majority';
const JWT_SECRET = 'fifa_jwt_secret_token_123';

// Set environment variables for routes
process.env.MONGODB_URI = MONGODB_TEST_URI;
process.env.JWT_SECRET = JWT_SECRET;
process.env.ADMIN_PASSWORD = 'admin123';

// Initialize express app for testing
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('../routes/auth').router;
const matchRoutes = require('../routes/matches');
const predictionRoutes = require('../routes/predictions');
const referralRoutes = require('../routes/referrals');

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/referrals', referralRoutes);

let server;
let serverUrl;
let adminToken;
let testMatchId;

// Helper to wait
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test.before(async () => {
  // Connect to DB
  await mongoose.connect(MONGODB_TEST_URI);
  
  // Clean database collections to start fresh
  await Match.deleteMany({});
  await Prediction.deleteMany({});
  await ReferralUser.deleteMany({});
  await ReferralRelationship.deleteMany({});
  await ReferralReward.deleteMany({});
  await ReferralClaim.deleteMany({});

  // Start server on an ephemeral port
  server = app.listen(0);
  const port = server.address().port;
  serverUrl = `http://localhost:${port}`;

  // Log in as Admin to obtain token
  const loginRes = await fetch(`${serverUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'admin123' })
  });
  const loginData = await loginRes.json();
  adminToken = loginData.token;

  // Create a mock match for prediction submissions
  const matchRes = await fetch(`${serverUrl}/api/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      teamA: 'Test Team A',
      teamB: 'Test Team B',
      teamALogo: '🇦🇷',
      teamBLogo: '🇫🇷',
      kickoffTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      winnerCount: 2,
      prizeAmount: 100
    })
  });
  const matchData = await matchRes.json();
  testMatchId = matchData._id;
});

test.after(async () => {
  // Cleanup database
  await Match.deleteMany({});
  await Prediction.deleteMany({});
  await ReferralUser.deleteMany({});
  await ReferralRelationship.deleteMany({});
  await ReferralReward.deleteMany({});
  await ReferralClaim.deleteMany({});

  await mongoose.disconnect();
  server.close();
});

test('Referral Code - Generation & Recovery Tests', async (t) => {
  await t.test('Should generate a unique referral code successfully', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: '9999999999',
        upiId: 'ownerA@okaxis'
      })
    });
    
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.referralCode);
    assert.ok(data.referralCode.startsWith('OWNE')); // prefix from UPI ID
  });

  await t.test('Should return existing code if user already registered', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: '9999999999',
        upiId: 'ownerA@okaxis'
      })
    });
    
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.referralCode);
  });

  await t.test('Should recover existing referral code successfully', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: '9999999999',
        upiId: 'ownerA@okaxis'
      })
    });
    
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.referralCode);
  });

  await t.test('Should return 404 for invalid recovery details', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: '0000000000',
        upiId: 'nonexistent@okaxis'
      })
    });
    assert.strictEqual(res.status, 404);
  });
});

test('Self-Referral Prevention (Rule 1) & Valid Referral Validation (Rule 2)', async (t) => {
  let referralCode;

  // Retrieve code for 9999999999
  const ownerRes = await fetch(`${serverUrl}/api/referrals/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: '9999999999', upiId: 'ownerA@okaxis' })
  });
  const ownerData = await ownerRes.json();
  referralCode = ownerData.referralCode;

  await t.test('Should store prediction but block referral if phone number is the same (Self Referral)', async () => {
    const res = await fetch(`${serverUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: testMatchId,
        userName: 'Self User',
        phoneNumber: '9999999999', // same phone
        upiId: 'someotherupi@okaxis',
        predictionType: 'winningTeam',
        predictedWinner: 'teamA',
        entryAmount: 20,
        transactionId: '100000000001',
        referralCode
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.prediction.referralApplied, false);
  });

  await t.test('Should store prediction but block referral if UPI ID is the same (Self Referral)', async () => {
    const res = await fetch(`${serverUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: testMatchId,
        userName: 'Self User 2',
        phoneNumber: '8888888888',
        upiId: 'ownerA@okaxis', // same upi
        predictionType: 'winningTeam',
        predictedWinner: 'teamA',
        entryAmount: 20,
        transactionId: '100000000002',
        referralCode
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.prediction.referralApplied, false);
  });

  await t.test('Should apply referral successfully if belongs to another user', async () => {
    const res = await fetch(`${serverUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: testMatchId,
        userName: 'Referred Friend',
        phoneNumber: '8888888888',
        upiId: 'friend@okaxis',
        predictionType: 'winningTeam',
        predictedWinner: 'teamA',
        entryAmount: 20,
        transactionId: '100000000003',
        referralCode
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.prediction.referralApplied, true);
    assert.ok(data.prediction.referredBy);
    
    // Check if relationship is created
    const rel = await ReferralRelationship.findOne({
      referralCode,
      referredPhoneNumber: '8888888888'
    });
    assert.ok(rel);
  });

  await t.test('Should block duplicate ReferralRelationship entries (Index validation)', async () => {
    // Submit another prediction for the same referred user
    const res = await fetch(`${serverUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: testMatchId,
        userName: 'Referred Friend',
        phoneNumber: '8888888888',
        upiId: 'friend@okaxis',
        predictionType: 'winningTeam',
        predictedWinner: 'teamA',
        entryAmount: 20,
        transactionId: '100000000004',
        referralCode
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.prediction.referralApplied, true);

    const relCount = await ReferralRelationship.countDocuments({
      referralCode,
      referredPhoneNumber: '8888888888'
    });
    // Relationship count must still be exactly 1
    assert.strictEqual(relCount, 1);
  });
});

test('Referral Reward Calculation & Duplicate Reward Prevention Tests', async (t) => {
  let referralCode;
  let referrerUserId;

  const ownerRes = await fetch(`${serverUrl}/api/referrals/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: '9999999999', upiId: 'ownerA@okaxis' })
  });
  const ownerData = await ownerRes.json();
  referralCode = ownerData.referralCode;

  const userObj = await ReferralUser.findOne({ referralCode });
  referrerUserId = userObj._id;

  await t.test('winningTeamReward: Earn ₹50 on 5 verified winningTeam predictions', async () => {
    // Already submitted UTRs 100000000003 and 100000000004 for phone 8888888888
    // Let's verify those 2 predictions first
    const predsToVerify = await Prediction.find({ phoneNumber: '8888888888', predictionType: 'winningTeam' });
    for (const p of predsToVerify) {
      await fetch(`${serverUrl}/api/predictions/${p._id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ paymentStatus: 'verified' })
      });
    }

    // Submit 3 more verified winningTeam predictions to reach threshold of 5
    for (let i = 5; i <= 7; i++) {
      const subRes = await fetch(`${serverUrl}/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: testMatchId,
          userName: 'Referred Friend',
          phoneNumber: '8888888888',
          upiId: 'friend@okaxis',
          predictionType: 'winningTeam',
          predictedWinner: 'teamA',
          entryAmount: 20,
          transactionId: `10000000000${i}`,
          referralCode
        })
      });
      const subData = await subRes.json();

      // Verify payment status
      await fetch(`${serverUrl}/api/predictions/${subData.prediction._id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ paymentStatus: 'verified' })
      });
    }

    // ReferralUser stats check
    const updatedUser = await ReferralUser.findById(referrerUserId);
    assert.strictEqual(updatedUser.totalEarned, 50);

    const rewards = await ReferralReward.find({ referrerId: referrerUserId, rewardType: 'winningTeamReward' });
    assert.strictEqual(rewards.length, 1);
  });

  await t.test('winningTeamReward: A 6th verified prediction must not generate another ₹50 reward', async () => {
    const subRes = await fetch(`${serverUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: testMatchId,
        userName: 'Referred Friend',
        phoneNumber: '8888888888',
        upiId: 'friend@okaxis',
        predictionType: 'winningTeam',
        predictedWinner: 'teamA',
        entryAmount: 20,
        transactionId: `100000000008`,
        referralCode
      })
    });
    const subData = await subRes.json();

    // Verify payment status
    await fetch(`${serverUrl}/api/predictions/${subData.prediction._id}/payment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ paymentStatus: 'verified' })
    });

    const updatedUser = await ReferralUser.findById(referrerUserId);
    assert.strictEqual(updatedUser.totalEarned, 50); // Still 50

    const rewardsCount = await ReferralReward.countDocuments({ referrerId: referrerUserId, rewardType: 'winningTeamReward' });
    assert.strictEqual(rewardsCount, 1); // Still 1
  });

  await t.test('scoreReward: Earn ₹100 on 3 verified score predictions', async () => {
    // Submit 3 verified score predictions
    for (let i = 10; i <= 12; i++) {
      const subRes = await fetch(`${serverUrl}/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: testMatchId,
          userName: 'Referred Friend',
          phoneNumber: '8888888888',
          upiId: 'friend@okaxis',
          predictionType: 'score',
          predictedScoreA: 2,
          predictedScoreB: 1,
          entryAmount: 100,
          transactionId: `1000000000${i}`,
          referralCode
        })
      });
      const subData = await subRes.json();

      // Verify payment status
      await fetch(`${serverUrl}/api/predictions/${subData.prediction._id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ paymentStatus: 'verified' })
      });
    }

    const updatedUser = await ReferralUser.findById(referrerUserId);
    assert.strictEqual(updatedUser.totalEarned, 150); // 50 (winningTeam) + 100 (score)

    const scoreRewards = await ReferralReward.find({ referrerId: referrerUserId, rewardType: 'scoreReward' });
    assert.strictEqual(scoreRewards.length, 1);
  });
});

test('Claim Processing & Eligibility Tests', async (t) => {
  let referralCode;
  let referrerUserId;

  const ownerRes = await fetch(`${serverUrl}/api/referrals/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: '9999999999', upiId: 'ownerA@okaxis' })
  });
  const ownerData = await ownerRes.json();
  referralCode = ownerData.referralCode;

  const userObj = await ReferralUser.findOne({ referralCode });
  referrerUserId = userObj._id;

  await t.test('Should fetch correct eligibility stats', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.totalEligible, 150);
    assert.strictEqual(data.totalClaimed, 0);
    assert.strictEqual(data.pendingAmount, 150);
    assert.strictEqual(data.rewards.length, 2);
  });

  await t.test('Should submit a claim request successfully', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.amount, 150);
    assert.strictEqual(data.status, 'pending');
  });

  await t.test('Should block duplicate claim requests while one is pending', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes('pending claim request'));
  });

  await t.test('Admin should get all claims', async () => {
    const res = await fetch(`${serverUrl}/api/referrals/admin/claims`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.length, 1);
    assert.strictEqual(data[0].amount, 150);
  });

  await t.test('Admin should mark claim paid, update stats and transition rewards', async () => {
    const claim = await ReferralClaim.findOne({ referralCode, status: 'pending' });
    
    const res = await fetch(`${serverUrl}/api/referrals/admin/claims/${claim._id}/pay`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.claim.status, 'paid');
    assert.ok(data.claim.paidAt);

    // Verify ReferralUser claimed stats
    const updatedUser = await ReferralUser.findById(referrerUserId);
    assert.strictEqual(updatedUser.totalClaimed, 150);

    // Verify rewards are transition to claimed
    const unclaimedRewardsCount = await ReferralReward.countDocuments({ referrerId: referrerUserId, status: 'eligible' });
    assert.strictEqual(unclaimedRewardsCount, 0);

    const claimedRewardsCount = await ReferralReward.countDocuments({ referrerId: referrerUserId, status: 'claimed' });
    assert.strictEqual(claimedRewardsCount, 2);
  });
});

test('Production Backward Compatibility Tests', async (t) => {
  await t.test('Should process a prediction without a referral code normally', async () => {
    const res = await fetch(`${serverUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: testMatchId,
        userName: 'Compat User',
        phoneNumber: '7777777777',
        upiId: 'compat@okaxis',
        predictionType: 'winningTeam',
        predictedWinner: 'teamA',
        entryAmount: 20,
        transactionId: '900000000001'
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.prediction.referralApplied, false);
    assert.strictEqual(data.prediction.referredBy, undefined);
  });
});
