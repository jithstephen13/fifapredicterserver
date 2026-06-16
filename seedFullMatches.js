require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('./models/Match');
const matchesData = require('./matchesData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Cleaving database...');
    
    // Clear ALL matches to prevent duplicate completed matches
    await Match.deleteMany({});
    console.log('Deleted all old matches in database.');

    const result = await Match.insertMany(matchesData);
    console.log(`Successfully seeded ${result.length} FIFA matches (completed & scheduled)!`);
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding matches:', err);
    process.exit(1);
  });
