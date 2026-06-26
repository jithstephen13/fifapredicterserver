require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth').router;
const matchRoutes = require('./routes/matches');
const predictionRoutes = require('./routes/predictions');
const referralRoutes = require('./routes/referrals');
const Match = require('./models/Match');
const matchesData = require('./matchesData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions_v2', predictionRoutes);
app.use('/api/referrals', referralRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';
const PORT = process.env.PORT || 5001;

// Auto-seed helper for easy deployment
async function autoSeed() {
  try {
    const count = await Match.countDocuments();
    if (count === 0) {
      console.log('No matches found in database. Auto-seeding group stage matches...');
      await Match.insertMany(matchesData);
      console.log('Auto-seeded matches successfully!');
    } else {
      console.log(`Database contains ${count} matches. Skipping auto-seed.`);
    }
  } catch (err) {
    console.error('Error during auto-seed:', err.message);
  }
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    await autoSeed();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
