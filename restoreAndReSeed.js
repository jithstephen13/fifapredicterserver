require('dotenv').config();
const mongoose = require('mongoose');
const Prediction = require('./models/Prediction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';

const predictionsToRestore = [
  {
    _id: new mongoose.Types.ObjectId("6a2bd0bbe7de7f783e4e34fe"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf4"), // Mexico vs South Africa
    userName: "Arjun Dev",
    phoneNumber: "9999888877",
    upiId: "arjun@okaxis",
    predictedScoreA: 2,
    predictedScoreB: 0,
    entryAmount: 30,
    transactionId: "123456789012",
    paymentStatus: "verified",
    isWinner: true,
    predictionType: "score",
    createdAt: new Date("2026-06-12T09:26:19.518Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2bd0bbe7de7f783e4e34ff"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf4"), // Mexico vs South Africa
    userName: "Rohan Das",
    phoneNumber: "9999111122",
    upiId: "rohan@okhdfc",
    predictedScoreA: 2,
    predictedScoreB: 0,
    entryAmount: 20,
    transactionId: "234567890123",
    paymentStatus: "verified",
    isWinner: true,
    predictionType: "score",
    createdAt: new Date("2026-06-12T09:26:19.519Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2bd0bde7de7f783e4e3505"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"), // South Korea vs Czechia
    userName: "Jithin Mathew",
    phoneNumber: "9876543210",
    upiId: "jithin@okicici",
    predictedScoreA: 2,
    predictedScoreB: 1,
    entryAmount: 50,
    transactionId: "345678901234",
    paymentStatus: "verified",
    isWinner: true,
    predictionType: "score",
    createdAt: new Date("2026-06-12T09:26:21.544Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2bd0bde7de7f783e4e3506"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"), // South Korea vs Czechia
    userName: "Sarah Joy",
    phoneNumber: "9123456789",
    upiId: "sarah@okaxis",
    predictedScoreA: 2,
    predictedScoreB: 1,
    entryAmount: 40,
    transactionId: "456789012345",
    paymentStatus: "verified",
    isWinner: true,
    predictionType: "score",
    createdAt: new Date("2026-06-12T09:26:21.544Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2b1c58511062726a0a9d17"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"), // South Korea vs Czechia
    userName: "Jith",
    phoneNumber: "9526272502",
    upiId: "9526272502@ybl",
    predictedScoreA: 1,
    predictedScoreB: 0,
    entryAmount: 20,
    transactionId: "958949977750",
    paymentStatus: "pending",
    isWinner: false,
    predictionType: "score",
    createdAt: new Date("2026-06-11T20:36:40.495Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2b3709c5c0bb9ec64ba5a0"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"), // South Korea vs Czechia
    userName: "Emmanuel",
    phoneNumber: "07440221881",
    upiId: "9778478273@ybl",
    predictedScoreA: 0,
    predictedScoreB: 0,
    entryAmount: 20,
    transactionId: "125955643939",
    paymentStatus: "verified",
    isWinner: false,
    predictionType: "score",
    createdAt: new Date("2026-06-11T22:30:33.712Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2b54afeba39a516a156352"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf5"), // South Korea vs Czechia
    userName: "Jithin Simon",
    phoneNumber: "9481824434",
    upiId: "jithinchethalilosh@okaxis",
    predictedScoreA: 1,
    predictedScoreB: 1,
    entryAmount: 20,
    transactionId: "616398226066",
    paymentStatus: "verified",
    isWinner: false,
    predictionType: "score",
    createdAt: new Date("2026-06-12T00:37:03.869Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2bd8a8b4a429c8fc146894"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf9"), // Brazil vs Morocco
    userName: "Jithin John",
    phoneNumber: "8105905231",
    upiId: "8105905231@ybl",
    predictedScoreA: 2,
    predictedScoreB: 1,
    entryAmount: 90,
    transactionId: "616390553311",
    paymentStatus: "verified",
    isWinner: false,
    predictionType: "score",
    createdAt: new Date("2026-06-12T10:00:08.013Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2c2d5705cd46e645ac9b33"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf6"), // Canada vs Bosnia and Herzegovina
    userName: "Anu Gladson",
    phoneNumber: "6235862305",
    upiId: "anujose0601-1@okicici",
    predictedScoreA: 2,
    predictedScoreB: 1,
    entryAmount: 100,
    transactionId: "652961906628",
    paymentStatus: "verified",
    isWinner: false,
    predictionType: "score",
    createdAt: new Date("2026-06-12T16:01:27.542Z")
  },
  {
    _id: new mongoose.Types.ObjectId("6a2dca23500f76fc8567451d"),
    matchId: new mongoose.Types.ObjectId("6a2b139bab60bab1d5d3caf9"), // Brazil vs Morocco
    userName: "Jins jose",
    phoneNumber: "8592947554",
    upiId: "Jins7554@federal",
    predictedScoreA: 0,
    predictedScoreB: 1,
    entryAmount: 40,
    transactionId: "616502011758",
    paymentStatus: "verified",
    isWinner: false,
    predictionType: "score",
    createdAt: new Date("2026-06-13T21:22:43.646Z")
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Deleting existing predictions to clean up...');
    await Prediction.deleteMany({});
    
    console.log('Inserting all 10 verified/pending predictions...');
    const result = await Prediction.insertMany(predictionsToRestore);
    console.log(`Successfully restored ${result.length} predictions!`);

    mongoose.connection.close();
    console.log('Restore complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during restoration:', err);
    process.exit(1);
  });
