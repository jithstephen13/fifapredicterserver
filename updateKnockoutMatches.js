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
    kickoffTime: new Date('2026-06-29T00:30:00+05:30'),
    matchCode: 'R32-3',
    venue: 'SoFi Stadium'
  },
  {
    teamA: 'Brazil',
    teamALogo: '🇧🇷',
    teamB: 'Japan',
    teamBLogo: '🇯🇵',
    kickoffTime: new Date('2026-06-29T22:30:00+05:30'),
    matchCode: 'R32-9',
    venue: 'NRG Stadium'
  },
  {
    teamA: 'Germany',
    teamALogo: '🇩🇪',
    teamB: 'Paraguay',
    teamBLogo: '🇵🇾',
    kickoffTime: new Date('2026-06-30T02:00:00+05:30'),
    matchCode: 'R32-1',
    venue: 'Gillette Stadium'
  },
  {
    teamA: 'Netherlands',
    teamALogo: '🇳🇱',
    teamB: 'Morocco',
    teamBLogo: '🇲🇦',
    kickoffTime: new Date('2026-06-30T06:30:00+05:30'),
    matchCode: 'R32-4',
    venue: 'Estadio BBVA'
  },
  {
    teamA: 'Ivory Coast',
    teamALogo: '🇨🇮',
    teamB: 'Norway',
    teamBLogo: '🇳🇴',
    kickoffTime: new Date('2026-06-30T22:30:00+05:30'),
    matchCode: 'R32-10',
    venue: 'AT&T Stadium'
  },
  {
    teamA: 'France',
    teamALogo: '🇫🇷',
    teamB: 'Sweden',
    teamBLogo: '🇸🇪',
    kickoffTime: new Date('2026-07-01T02:30:00+05:30'),
    matchCode: 'R32-2',
    venue: 'MetLife Stadium'
  },
  {
    teamA: 'Mexico',
    teamALogo: '🇲🇽',
    teamB: 'Ecuador',
    teamBLogo: '🇪🇨',
    kickoffTime: new Date('2026-07-01T06:30:00+05:30'),
    matchCode: 'R32-11',
    venue: 'Estadio Azteca'
  },
  {
    teamA: 'England',
    teamALogo: '🏴',
    teamB: 'Congo DR',
    teamBLogo: '🇨🇩',
    kickoffTime: new Date('2026-07-01T21:30:00+05:30'),
    matchCode: 'R32-12',
    venue: 'Mercedes-Benz Stadium'
  },
  {
    teamA: 'Belgium',
    teamALogo: '🇧🇪',
    teamB: 'Senegal',
    teamBLogo: '🇸🇳',
    kickoffTime: new Date('2026-07-02T01:30:00+05:30'),
    matchCode: 'R32-8',
    venue: 'Lumen Field'
  },
  {
    teamA: 'United States',
    teamALogo: '🇺🇸',
    teamB: 'Bosnia-Herzegovina',
    teamBLogo: '🇧🇦',
    kickoffTime: new Date('2026-07-02T05:30:00+05:30'),
    matchCode: 'R32-7',
    venue: "Levi's Stadium"
  },
  {
    teamA: 'Spain',
    teamALogo: '🇪🇸',
    teamB: 'Austria',
    teamBLogo: '🇦🇹',
    kickoffTime: new Date('2026-07-03T00:30:00+05:30'),
    matchCode: 'R32-6',
    venue: 'SoFi Stadium'
  },
  {
    teamA: 'Portugal',
    teamALogo: '🇵🇹',
    teamB: 'Croatia',
    teamBLogo: '🇭🇷',
    kickoffTime: new Date('2026-07-03T04:30:00+05:30'),
    matchCode: 'R32-5',
    venue: 'BMO Field'
  },
  {
    teamA: 'Switzerland',
    teamALogo: '🇨🇭',
    teamB: 'Algeria',
    teamBLogo: '🇩🇿',
    kickoffTime: new Date('2026-07-03T08:30:00+05:30'),
    matchCode: 'R32-15',
    venue: 'BC Place'
  },
  {
    teamA: 'Australia',
    teamALogo: '🇦🇺',
    teamB: 'Egypt',
    teamBLogo: '🇪🇬',
    kickoffTime: new Date('2026-07-03T23:30:00+05:30'),
    matchCode: 'R32-14',
    venue: 'AT&T Stadium'
  },
  {
    teamA: 'Argentina',
    teamALogo: '🇦🇷',
    teamB: 'Cape Verde',
    teamBLogo: '🇨🇻',
    kickoffTime: new Date('2026-07-04T03:30:00+05:30'),
    matchCode: 'R32-13',
    venue: 'Hard Rock Stadium'
  },
  {
    teamA: 'Colombia',
    teamALogo: '🇨🇴',
    teamB: 'Ghana',
    teamBLogo: '🇬🇭',
    kickoffTime: new Date('2026-07-04T07:00:00+05:30'),
    matchCode: 'R32-16',
    venue: 'Arrowhead Stadium'
  },

  // Round of 16 (8 matches)
  {
    teamA: 'W-32-1',
    teamALogo: '🏳️',
    teamB: 'W-32-2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-05T02:30:00+05:30'),
    matchCode: 'R16-1',
    venue: 'Lincoln Financial Field'
  },
  {
    teamA: 'W-32-3',
    teamALogo: '🏳️',
    teamB: 'W-32-4',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-04T22:30:00+05:30'),
    matchCode: 'R16-2',
    venue: 'NRG Stadium'
  },
  {
    teamA: 'W-32-11',
    teamALogo: '🏳️',
    teamB: 'W-32-12',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-06T05:30:00+05:30'),
    matchCode: 'R16-3',
    venue: 'Estadio Azteca'
  },
  {
    teamA: 'W-32-9',
    teamALogo: '🏳️',
    teamB: 'W-32-10',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-06T01:30:00+05:30'),
    matchCode: 'R16-4',
    venue: 'MetLife Stadium'
  },
  {
    teamA: 'W-32-5',
    teamALogo: '🏳️',
    teamB: 'W-32-6',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T00:30:00+05:30'),
    matchCode: 'R16-5',
    venue: 'AT&T Stadium'
  },
  {
    teamA: 'W-32-7',
    teamALogo: '🏳️',
    teamB: 'W-32-8',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T05:30:00+05:30'),
    matchCode: 'R16-6',
    venue: 'Lumen Field'
  },
  {
    teamA: 'W-32-15',
    teamALogo: '🏳️',
    teamB: 'W-32-16',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-08T01:30:00+05:30'),
    matchCode: 'R16-7',
    venue: 'BC Place'
  },
  {
    teamA: 'W-32-13',
    teamALogo: '🏳️',
    teamB: 'W-32-14',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T21:30:00+05:30'),
    matchCode: 'R16-8',
    venue: 'Mercedes-Benz Stadium'
  },

  // Quarter-finals (4 matches)
  {
    teamA: 'W-16-1',
    teamALogo: '🏳️',
    teamB: 'W-16-2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-10T01:30:00+05:30'),
    matchCode: 'QF-1',
    venue: 'Gillette Stadium'
  },
  {
    teamA: 'W-16-5',
    teamALogo: '🏳️',
    teamB: 'W-16-6',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-11T00:30:00+05:30'),
    matchCode: 'QF-2',
    venue: 'SoFi Stadium'
  },
  {
    teamA: 'W-16-4',
    teamALogo: '🏳️',
    teamB: 'W-16-3',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-12T02:30:00+05:30'),
    matchCode: 'QF-3',
    venue: 'Hard Rock Stadium'
  },
  {
    teamA: 'W-16-8',
    teamALogo: '🏳️',
    teamB: 'W-16-7',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-12T06:30:00+05:30'),
    matchCode: 'QF-4',
    venue: 'Arrowhead Stadium'
  },

  // Semi-finals (2 matches)
  {
    teamA: 'W-QF1',
    teamALogo: '🏳️',
    teamB: 'W-QF2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-15T00:30:00+05:30'),
    matchCode: 'SF-1',
    venue: 'AT&T Stadium'
  },
  {
    teamA: 'W-QF3',
    teamALogo: '🏳️',
    teamB: 'W-QF4',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-16T00:30:00+05:30'),
    matchCode: 'SF-2',
    venue: 'Mercedes-Benz Stadium'
  },

  // Final (1 match)
  {
    teamA: 'W-SF1',
    teamALogo: '🏳️',
    teamB: 'W-SF2',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-20T00:30:00+05:30'),
    matchCode: 'F',
    venue: 'MetLife Stadium'
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
