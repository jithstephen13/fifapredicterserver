require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('./models/Match');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifaprediction';

const knockoutMatches = [
  // Round of 32 (16 matches)
  {
    teamA: 'South Africa',
    teamALogo: '🇿🇦',
    teamB: 'Canada',
    teamBLogo: '🇨🇦',
    kickoffTime: new Date('2026-06-28T20:00:00+05:30'),
    matchCode: 'R32-3',
    venue: 'Los Angeles Stadium'
  },
  {
    teamA: 'Brazil',
    teamALogo: '🇧🇷',
    teamB: 'Japan',
    teamBLogo: '🇯🇵',
    kickoffTime: new Date('2026-06-29T18:00:00+05:30'),
    matchCode: 'R32-9',
    venue: 'Houston Stadium'
  },
  {
    teamA: 'Germany',
    teamALogo: '🇩🇪',
    teamB: 'Paraguay',
    teamBLogo: '🇵🇾',
    kickoffTime: new Date('2026-06-29T21:30:00+05:30'),
    matchCode: 'R32-1',
    venue: 'Boston Stadium'
  },
  {
    teamA: 'Netherlands',
    teamALogo: '🇳🇱',
    teamB: 'Morocco',
    teamBLogo: '🇲🇦',
    kickoffTime: new Date('2026-06-30T02:00:00+05:30'),
    matchCode: 'R32-4',
    venue: 'Estadio Monterrey'
  },
  {
    teamA: 'Ivory Coast',
    teamALogo: '🇨🇮',
    teamB: 'Norway',
    teamBLogo: '🇳🇴',
    kickoffTime: new Date('2026-06-30T18:00:00+05:30'),
    matchCode: 'R32-10',
    venue: 'Dallas Stadium'
  },
  {
    teamA: 'France',
    teamALogo: '🇫🇷',
    teamB: 'Sweden',
    teamBLogo: '🇸🇪',
    kickoffTime: new Date('2026-06-30T22:00:00+05:30'),
    matchCode: 'R32-2',
    venue: 'New York New Jersey Stadium'
  },
  {
    teamA: 'Mexico',
    teamALogo: '🇲🇽',
    teamB: 'Ecuador',
    teamBLogo: '🇪🇨',
    kickoffTime: new Date('2026-07-01T02:00:00+05:30'),
    matchCode: 'R32-11',
    venue: 'Mexico City Stadium'
  },
  {
    teamA: 'England',
    teamALogo: '🏴',
    teamB: 'Congo DR',
    teamBLogo: '🇨🇩',
    kickoffTime: new Date('2026-07-01T17:00:00+05:30'),
    matchCode: 'R32-12',
    venue: 'Atlanta Stadium'
  },
  {
    teamA: 'Belgium',
    teamALogo: '🇧🇪',
    teamB: 'Senegal',
    teamBLogo: '🇸🇳',
    kickoffTime: new Date('2026-07-01T21:00:00+05:30'),
    matchCode: 'R32-8',
    venue: 'Seattle Stadium'
  },
  {
    teamA: 'United States',
    teamALogo: '🇺🇸',
    teamB: 'Bosnia-Herzegovina',
    teamBLogo: '🇧🇦',
    kickoffTime: new Date('2026-07-02T01:00:00+05:30'),
    matchCode: 'R32-7',
    venue: 'San Francisco Bay Area Stadium'
  },
  {
    teamA: 'Spain',
    teamALogo: '🇪🇸',
    teamB: 'Austria',
    teamBLogo: '🇦🇹',
    kickoffTime: new Date('2026-07-02T20:00:00+05:30'),
    matchCode: 'R32-6',
    venue: 'Los Angeles Stadium'
  },
  {
    teamA: 'Portugal',
    teamALogo: '🇵🇹',
    teamB: 'Croatia',
    teamBLogo: '🇭🇷',
    kickoffTime: new Date('2026-07-03T00:00:00+05:30'),
    matchCode: 'R32-5',
    venue: 'Toronto Stadium'
  },
  {
    teamA: 'Switzerland',
    teamALogo: '🇨🇭',
    teamB: 'Algeria',
    teamBLogo: '🇩🇿',
    kickoffTime: new Date('2026-07-03T04:00:00+05:30'),
    matchCode: 'R32-15',
    venue: 'BC Place Vancouver'
  },
  {
    teamA: 'Australia',
    teamALogo: '🇦🇺',
    teamB: 'Egypt',
    teamBLogo: '🇪🇬',
    kickoffTime: new Date('2026-07-03T19:00:00+05:30'),
    matchCode: 'R32-14',
    venue: 'Dallas Stadium'
  },
  {
    teamA: 'Argentina',
    teamALogo: '🇦🇷',
    teamB: 'Cape Verde',
    teamBLogo: '🇨🇻',
    kickoffTime: new Date('2026-07-03T23:00:00+05:30'),
    matchCode: 'R32-13',
    venue: 'Miami Stadium'
  },
  {
    teamA: 'Colombia',
    teamALogo: '🇨🇴',
    teamB: 'Ghana',
    teamBLogo: '🇬🇭',
    kickoffTime: new Date('2026-07-04T02:30:00+05:30'),
    matchCode: 'R32-16',
    venue: 'Kansas City Stadium'
  },

  // Round of 16 (8 matches)
  {
    teamA: 'W-32-2',
    teamALogo: '🏳️',
    teamB: 'W-32-5',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-04T22:00:00+05:30'),
    matchCode: 'R16-1',
    venue: 'Philadelphia Stadium'
  },
  {
    teamA: 'W-32-1',
    teamALogo: '🏳️',
    teamB: 'W-32-3',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-04T18:00:00+05:30'),
    matchCode: 'R16-2',
    venue: 'Houston Stadium'
  },
  {
    teamA: 'W-32-11',
    teamALogo: '🏳️',
    teamB: 'W-32-12',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-06T20:00:00+05:30'),
    matchCode: 'R16-3',
    venue: 'Dallas Stadium'
  },
  {
    teamA: 'W-32-9',
    teamALogo: '🏳️',
    teamB: 'W-32-10',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T01:00:00+05:30'),
    matchCode: 'R16-4',
    venue: 'Seattle Stadium'
  },
  {
    teamA: 'W-32-4',
    teamALogo: '🏳️',
    teamB: 'W-32-6',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-05T21:00:00+05:30'),
    matchCode: 'R16-5',
    venue: 'New York New Jersey Stadium'
  },
  {
    teamA: 'W-32-7',
    teamALogo: '🏳️',
    teamB: 'W-32-8',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-06T01:00:00+05:30'),
    matchCode: 'R16-6',
    venue: 'Mexico City Stadium'
  },
  {
    teamA: 'W-32-14',
    teamALogo: '🏳️',
    teamB: 'W-32-16',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T17:00:00+05:30'),
    matchCode: 'R16-7',
    venue: 'Atlanta Stadium'
  },
  {
    teamA: 'W-32-13',
    teamALogo: '🏳️',
    teamB: 'W-32-15',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T21:00:00+05:30'),
    matchCode: 'R16-8',
    venue: 'BC Place Vancouver'
  },

  // Quarter-finals (4 matches)
  {
    teamA: 'W-16-1',
    teamALogo: '🏳️',
    teamB: 'W-16-2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-09T21:00:00+05:30'),
    matchCode: 'QF-1',
    venue: 'Boston Stadium'
  },
  {
    teamA: 'W-16-5',
    teamALogo: '🏳️',
    teamB: 'W-16-6',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-10T20:00:00+05:30'),
    matchCode: 'QF-2',
    venue: 'Los Angeles Stadium'
  },
  {
    teamA: 'W-16-3',
    teamALogo: '🏳️',
    teamB: 'W-16-4',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-11T22:00:00+05:30'),
    matchCode: 'QF-3',
    venue: 'Miami Stadium'
  },
  {
    teamA: 'W-16-7',
    teamALogo: '🏳️',
    teamB: 'W-16-8',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-12T02:00:00+05:30'),
    matchCode: 'QF-4',
    venue: 'Kansas City Stadium'
  },

  // Semi-finals (2 matches)
  {
    teamA: 'W-QF1',
    teamALogo: '🏳️',
    teamB: 'W-QF2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-14T20:00:00+05:30'),
    matchCode: 'SF-1',
    venue: 'Dallas Stadium'
  },
  {
    teamA: 'W-QF3',
    teamALogo: '🏳️',
    teamB: 'W-QF4',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-15T20:00:00+05:30'),
    matchCode: 'SF-2',
    venue: 'Atlanta Stadium'
  },

  // Final (1 match)
  {
    teamA: 'W-SF1',
    teamALogo: '🏳️',
    teamB: 'W-SF2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-19T20:00:00+05:30'),
    matchCode: 'F',
    venue: 'New York New Jersey Stadium'
  }
];

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Starting database migration for knockout matches...');

    // 1. Get all matches sorted chronologically
    const allMatches = await Match.find().sort({ kickoffTime: 1 });
    console.log(`Currently there are ${allMatches.length} matches in the database.`);

    if (allMatches.length < 72) {
      console.error('Error: Database has less than 72 group-stage matches. Seed the DB first.');
      process.exit(1);
    }

    // 2. Separate group stage matches (first 72) from the rest
    const groupStageMatches = allMatches.slice(0, 72);
    const matchesToDelete = allMatches.slice(72);

    console.log(`Preserving ${groupStageMatches.length} group stage matches.`);
    console.log(`Deleting ${matchesToDelete.length} post-group stage matches...`);

    const deleteIds = matchesToDelete.map(m => m._id);
    await Match.deleteMany({ _id: { $in: deleteIds } });
    console.log('Post-group stage matches deleted successfully.');

    // 3. Insert the new knockout matches
    console.log(`Inserting ${knockoutMatches.length} correct knockout stage matches...`);
    const inserted = await Match.insertMany(knockoutMatches);
    console.log(`Seeded ${inserted.length} knockout matches!`);

    mongoose.connection.close();
    console.log('Migration complete. Database connection closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during migration:', err);
    process.exit(1);
  });
