require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('./models/Match');
const Prediction = require('./models/Prediction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding dummy winners...');

    // Find the first match (Mexico vs South Africa)
    const match1 = await Match.findOne({ teamA: 'Mexico', teamB: 'South Africa' });
    if (match1) {
      console.log('Found Match 1: Mexico vs South Africa. Updating to completed...');
      match1.status = 'completed';
      match1.result = { scoreA: 1, scoreB: 1 };
      await match1.save();

      // Create dummy winners
      const p1 = new Prediction({
        matchId: match1._id,
        userName: 'Arjun Dev',
        phoneNumber: '9999888877',
        upiId: 'arjun@okaxis',
        predictedScoreA: 1,
        predictedScoreB: 1,
        entryAmount: 30,
        transactionId: '123456789012',
        paymentStatus: 'verified',
        isWinner: true
      });

      const p2 = new Prediction({
        matchId: match1._id,
        userName: 'Rohan Das',
        phoneNumber: '9999111122',
        upiId: 'rohan@okhdfc',
        predictedScoreA: 1,
        predictedScoreB: 1,
        entryAmount: 20,
        transactionId: '234567890123',
        paymentStatus: 'verified',
        isWinner: true
      });

      await p1.save();
      await p2.save();
      console.log('Inserted 2 winners for Match 1.');
    } else {
      console.warn('Match 1 (Mexico vs South Africa) not found in database.');
    }

    // Find the second match (Korea Republic vs Czech Republic)
    const match2 = await Match.findOne({ teamA: 'Korea Republic', teamB: 'Czech Republic' });
    if (match2) {
      console.log('Found Match 2: Korea Republic vs Czech Republic. Updating to completed...');
      match2.status = 'completed';
      match2.result = { scoreA: 2, scoreB: 0 };
      await match2.save();

      // Create dummy winners
      const p3 = new Prediction({
        matchId: match2._id,
        userName: 'Jithin Mathew',
        phoneNumber: '9876543210',
        upiId: 'jithin@okicici',
        predictedScoreA: 2,
        predictedScoreB: 0,
        entryAmount: 50,
        transactionId: '345678901234',
        paymentStatus: 'verified',
        isWinner: true
      });

      const p4 = new Prediction({
        matchId: match2._id,
        userName: 'Sarah Joy',
        phoneNumber: '9123456789',
        upiId: 'sarah@okaxis',
        predictedScoreA: 2,
        predictedScoreB: 0,
        entryAmount: 40,
        transactionId: '456789012345',
        paymentStatus: 'verified',
        isWinner: true
      });

      await p3.save();
      await p4.save();
      console.log('Inserted 2 winners for Match 2.');
    } else {
      console.warn('Match 2 (Korea Republic vs Czech Republic) not found in database.');
    }

    mongoose.connection.close();
    console.log('Database connection closed. Seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection/Seeding error:', err);
    process.exit(1);
  });
