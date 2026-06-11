require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('./models/Match');
const matchesData = require('./matchesData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB to seed matches...');
    
    // Clear scheduled matches to prevent duplicates if script is run multiple times
    await Match.deleteMany({ status: 'scheduled' });
    console.log('Cleared existing scheduled matches.');

    const result = await Match.insertMany(matchesData);
    console.log(`Successfully seeded ${result.length} FIFA group stage matches!`);
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding matches:', err);
    process.exit(1);
  });
