require('dotenv').config();
const mongoose = require('mongoose');
const Prediction = require('./models/Prediction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';

const predictionsToRestore = [
  {
    _id: new mongoose.Types.ObjectId("6a2b1c58511062726a0a9d17"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"),
    userName: "Jith",
    phoneNumber: "9526272502",
    upiId: "9526272502@ybl",
    predictedScoreA: 1,
    predictedScoreB: 0,
    transactionId: "958949977750",
    paymentStatus: "pending",
    isWinner: false,
    createdAt: new Date("2026-06-11T20:36:40.495Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2b3709c5c0bb9ec64ba5a0"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"),
    userName: "Emmanuel",
    phoneNumber: "07440221881",
    upiId: "9778478273@ybl",
    predictedScoreA: 0,
    predictedScoreB: 0,
    entryAmount: 20,
    transactionId: "125955643939",
    paymentStatus: "verified",
    isWinner: false,
    createdAt: new Date("2026-06-11T22:30:33.712Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2b54afeba39a516a156352"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"),
    userName: "Jithin Simon",
    phoneNumber: "9481824434",
    upiId: "jithinchethalilosh@okaxis",
    predictedScoreA: 1,
    predictedScoreB: 1,
    entryAmount: 20,
    transactionId: "616398226066",
    paymentStatus: "verified",
    isWinner: false,
    createdAt: new Date("2026-06-12T00:37:03.869Z")
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Restoring user predictions...');

    for (const pred of predictionsToRestore) {
      await Prediction.replaceOne(
        { _id: pred._id },
        pred,
        { upsert: true }
      );
      console.log(`Restored prediction for ${pred.userName} (${pred._id})`);
    }

    mongoose.connection.close();
    console.log('Restore complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during restoration:', err);
    process.exit(1);
  });
