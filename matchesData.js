const matchesData = [
  {
    _id: '6a2b139bab60bab1d5d3caf4',
    teamA: 'Mexico',
    teamALogo: '🇲🇽',
    teamB: 'South Africa',
    teamBLogo: '🇿🇦',
    kickoffTime: new Date('2026-06-12T00:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 2,
      scoreB: 0
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3caf5',
    teamA: 'South Korea',
    teamALogo: '🇰🇷',
    teamB: 'Czechia',
    teamBLogo: '🇨🇿',
    kickoffTime: new Date('2026-06-12T07:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 2,
      scoreB: 1
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3caf6',
    teamA: 'Canada',
    teamALogo: '🇨🇦',
    teamB: 'Bosnia and Herzegovina',
    teamBLogo: '🇧🇦',
    kickoffTime: new Date('2026-06-13T00:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 1,
      scoreB: 1
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3caf7',
    teamA: 'United States',
    teamALogo: '🇺🇸',
    teamB: 'Paraguay',
    teamBLogo: '🇵🇾',
    kickoffTime: new Date('2026-06-13T06:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 4,
      scoreB: 1
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3caf8',
    teamA: 'Qatar',
    teamALogo: '🇶🇦',
    teamB: 'Switzerland',
    teamBLogo: '🇨🇭',
    kickoffTime: new Date('2026-06-14T00:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 1,
      scoreB: 1
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3caf9',
    teamA: 'Brazil',
    teamALogo: '🇧🇷',
    teamB: 'Morocco',
    teamBLogo: '🇲🇦',
    kickoffTime: new Date('2026-06-14T03:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 1,
      scoreB: 1
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3cafa',
    teamA: 'Haiti',
    teamALogo: '🇭🇹',
    teamB: 'Scotland',
    teamBLogo: '🏴',
    kickoffTime: new Date('2026-06-14T06:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 0,
      scoreB: 1
    }
  },
  {
    _id: '6a2b139bab60bab1d5d3cafb',
    teamA: 'Australia',
    teamALogo: '🇦🇺',
    teamB: 'Türkiye',
    teamBLogo: '🇹🇷',
    kickoffTime: new Date('2026-06-14T09:30:00+05:30'),
    status: 'completed',
    result: {
      scoreA: 2,
      scoreB: 0
    }
  },
  {
    teamA: 'Germany',
    teamALogo: '🇩🇪',
    teamB: 'Willemstad Curacao',
    teamBLogo: '🇨🇼',
    kickoffTime: new Date('2026-06-14T22:30:00+05:30')
  },
  {
    teamA: 'Netherlands',
    teamALogo: '🇳🇱',
    teamB: 'Japan',
    teamBLogo: '🇯🇵',
    kickoffTime: new Date('2026-06-15T01:30:00+05:30')
  },
  {
    teamA: 'Ivory Coast',
    teamALogo: '🇨🇮',
    teamB: 'Ecuador',
    teamBLogo: '🇪🇨',
    kickoffTime: new Date('2026-06-15T04:30:00+05:30')
  },
  {
    teamA: 'Sweden',
    teamALogo: '🇸🇪',
    teamB: 'Tunisia',
    teamBLogo: '🇹🇳',
    kickoffTime: new Date('2026-06-15T07:30:00+05:30')
  },
  {
    teamA: 'Spain',
    teamALogo: '🇪🇸',
    teamB: 'Cape Verde',
    teamBLogo: '🇨🇻',
    kickoffTime: new Date('2026-06-15T21:30:00+05:30')
  },
  {
    teamA: 'Belgium',
    teamALogo: '🇧🇪',
    teamB: 'Egypt',
    teamBLogo: '🇪🇬',
    kickoffTime: new Date('2026-06-16T00:30:00+05:30')
  },
  {
    teamA: 'Saudi Arabia',
    teamALogo: '🇸🇦',
    teamB: 'Uruguay',
    teamBLogo: '🇺🇾',
    kickoffTime: new Date('2026-06-16T03:30:00+05:30')
  },
  {
    teamA: 'Iran',
    teamALogo: '🇮🇷',
    teamB: 'New Zealand',
    teamBLogo: '🇳🇿',
    kickoffTime: new Date('2026-06-16T06:30:00+05:30')
  },
  {
    teamA: 'France',
    teamALogo: '🇫🇷',
    teamB: 'Senegal',
    teamBLogo: '🇸🇳',
    kickoffTime: new Date('2026-06-17T00:30:00+05:30')
  },
  {
    teamA: 'Iraq',
    teamALogo: '🇮🇶',
    teamB: 'Norway',
    teamBLogo: '🇳🇴',
    kickoffTime: new Date('2026-06-17T03:30:00+05:30')
  },
  {
    teamA: 'Argentina',
    teamALogo: '🇦🇷',
    teamB: 'Algeria',
    teamBLogo: '🇩🇿',
    kickoffTime: new Date('2026-06-17T06:30:00+05:30')
  },
  {
    teamA: 'Austria',
    teamALogo: '🇦🇹',
    teamB: 'Amman Jordan',
    teamBLogo: '🇯🇴',
    kickoffTime: new Date('2026-06-17T09:30:00+05:30')
  },
  {
    teamA: 'Portugal',
    teamALogo: '🇵🇹',
    teamB: 'Congo DR',
    teamBLogo: '🇨🇩',
    kickoffTime: new Date('2026-06-17T22:30:00+05:30')
  },
  {
    teamA: 'England',
    teamALogo: '🏴',
    teamB: 'Croatia',
    teamBLogo: '🇭🇷',
    kickoffTime: new Date('2026-06-18T01:30:00+05:30')
  },
  {
    teamA: 'Ghana',
    teamALogo: '🇬🇭',
    teamB: 'Panama',
    teamBLogo: '🇵🇦',
    kickoffTime: new Date('2026-06-18T04:30:00+05:30')
  },
  {
    teamA: 'Uzbekistan',
    teamALogo: '🇺🇿',
    teamB: 'Colombia',
    teamBLogo: '🇨🇴',
    kickoffTime: new Date('2026-06-18T07:30:00+05:30')
  },
  {
    teamA: 'Czechia',
    teamALogo: '🇨🇿',
    teamB: 'South Africa',
    teamBLogo: '🇿🇦',
    kickoffTime: new Date('2026-06-18T21:30:00+05:30')
  },
  {
    teamA: 'Switzerland',
    teamALogo: '🇨🇭',
    teamB: 'Bosnia and Herzegovina',
    teamBLogo: '🇧🇦',
    kickoffTime: new Date('2026-06-19T00:30:00+05:30')
  },
  {
    teamA: 'Canada',
    teamALogo: '🇨🇦',
    teamB: 'Qatar',
    teamBLogo: '🇶🇦',
    kickoffTime: new Date('2026-06-19T03:30:00+05:30')
  },
  {
    teamA: 'Mexico',
    teamALogo: '🇲🇽',
    teamB: 'South Korea',
    teamBLogo: '🇰🇷',
    kickoffTime: new Date('2026-06-19T06:30:00+05:30')
  },
  {
    teamA: 'United States',
    teamALogo: '🇺🇸',
    teamB: 'Australia',
    teamBLogo: '🇦🇺',
    kickoffTime: new Date('2026-06-20T00:30:00+05:30')
  },
  {
    teamA: 'Scotland',
    teamALogo: '🏴',
    teamB: 'Morocco',
    teamBLogo: '🇲🇦',
    kickoffTime: new Date('2026-06-20T03:30:00+05:30')
  },
  {
    teamA: 'Brazil',
    teamALogo: '🇧🇷',
    teamB: 'Haiti',
    teamBLogo: '🇭🇹',
    kickoffTime: new Date('2026-06-20T06:00:00+05:30')
  },
  {
    teamA: 'Türkiye',
    teamALogo: '🇹🇷',
    teamB: 'Paraguay',
    teamBLogo: '🇵🇾',
    kickoffTime: new Date('2026-06-20T08:30:00+05:30')
  },
  {
    teamA: 'Netherlands',
    teamALogo: '🇳🇱',
    teamB: 'Sweden',
    teamBLogo: '🇸🇪',
    kickoffTime: new Date('2026-06-20T22:30:00+05:30')
  },
  {
    teamA: 'Germany',
    teamALogo: '🇩🇪',
    teamB: 'Ivory Coast',
    teamBLogo: '🇨🇮',
    kickoffTime: new Date('2026-06-21T01:30:00+05:30')
  },
  {
    teamA: 'Ecuador',
    teamALogo: '🇪🇨',
    teamB: 'Willemstad Curacao',
    teamBLogo: '🇨🇼',
    kickoffTime: new Date('2026-06-21T05:30:00+05:30')
  },
  {
    teamA: 'Tunisia',
    teamALogo: '🇹🇳',
    teamB: 'Japan',
    teamBLogo: '🇯🇵',
    kickoffTime: new Date('2026-06-21T09:30:00+05:30')
  },
  {
    teamA: 'Spain',
    teamALogo: '🇪🇸',
    teamB: 'Saudi Arabia',
    teamBLogo: '🇸🇦',
    kickoffTime: new Date('2026-06-21T21:30:00+05:30')
  },
  {
    teamA: 'Belgium',
    teamALogo: '🇧🇪',
    teamB: 'Iran',
    teamBLogo: '🇮🇷',
    kickoffTime: new Date('2026-06-22T00:30:00+05:30')
  },
  {
    teamA: 'Uruguay',
    teamALogo: '🇺🇾',
    teamB: 'Cape Verde',
    teamBLogo: '🇨🇻',
    kickoffTime: new Date('2026-06-22T03:30:00+05:30')
  },
  {
    teamA: 'New Zealand',
    teamALogo: '🇳🇿',
    teamB: 'Egypt',
    teamBLogo: '🇪🇬',
    kickoffTime: new Date('2026-06-22T06:30:00+05:30')
  },
  {
    teamA: 'Argentina',
    teamALogo: '🇦🇷',
    teamB: 'Austria',
    teamBLogo: '🇦🇹',
    kickoffTime: new Date('2026-06-22T22:30:00+05:30')
  },
  {
    teamA: 'France',
    teamALogo: '🇫🇷',
    teamB: 'Iraq',
    teamBLogo: '🇮🇶',
    kickoffTime: new Date('2026-06-23T02:30:00+05:30')
  },
  {
    teamA: 'Norway',
    teamALogo: '🇳🇴',
    teamB: 'Senegal',
    teamBLogo: '🇸🇳',
    kickoffTime: new Date('2026-06-23T05:30:00+05:30')
  },
  {
    teamA: 'Amman Jordan',
    teamALogo: '🇯🇴',
    teamB: 'Algeria',
    teamBLogo: '🇩🇿',
    kickoffTime: new Date('2026-06-23T08:30:00+05:30')
  },
  {
    teamA: 'Portugal',
    teamALogo: '🇵🇹',
    teamB: 'Uzbekistan',
    teamBLogo: '🇺🇿',
    kickoffTime: new Date('2026-06-23T22:30:00+05:30')
  },
  {
    teamA: 'England',
    teamALogo: '🏴',
    teamB: 'Ghana',
    teamBLogo: '🇬🇭',
    kickoffTime: new Date('2026-06-24T01:30:00+05:30')
  },
  {
    teamA: 'Panama',
    teamALogo: '🇵🇦',
    teamB: 'Croatia',
    teamBLogo: '🇭🇷',
    kickoffTime: new Date('2026-06-24T04:30:00+05:30')
  },
  {
    teamA: 'Colombia',
    teamALogo: '🇨🇴',
    teamB: 'Congo DR',
    teamBLogo: '🇨🇩',
    kickoffTime: new Date('2026-06-24T07:30:00+05:30')
  },
  {
    teamA: 'Switzerland',
    teamALogo: '🇨🇭',
    teamB: 'Canada',
    teamBLogo: '🇨🇦',
    kickoffTime: new Date('2026-06-25T00:30:00+05:30')
  },
  {
    teamA: 'Bosnia and Herzegovina',
    teamALogo: '🇧🇦',
    teamB: 'Qatar',
    teamBLogo: '🇶🇦',
    kickoffTime: new Date('2026-06-25T00:30:00+05:30')
  },
  {
    teamA: 'Scotland',
    teamALogo: '🏴',
    teamB: 'Brazil',
    teamBLogo: '🇧🇷',
    kickoffTime: new Date('2026-06-25T03:30:00+05:30')
  },
  {
    teamA: 'Morocco',
    teamALogo: '🇲🇦',
    teamB: 'Haiti',
    teamBLogo: '🇭🇹',
    kickoffTime: new Date('2026-06-25T03:30:00+05:30')
  },
  {
    teamA: 'Czechia',
    teamALogo: '🇨🇿',
    teamB: 'Mexico',
    teamBLogo: '🇲🇽',
    kickoffTime: new Date('2026-06-25T06:30:00+05:30')
  },
  {
    teamA: 'South Africa',
    teamALogo: '🇿🇦',
    teamB: 'South Korea',
    teamBLogo: '🇰🇷',
    kickoffTime: new Date('2026-06-25T06:30:00+05:30')
  },
  {
    teamA: 'Ecuador',
    teamALogo: '🇪🇨',
    teamB: 'Germany',
    teamBLogo: '🇩🇪',
    kickoffTime: new Date('2026-06-26T01:30:00+05:30')
  },
  {
    teamA: 'Willemstad Curacao',
    teamALogo: '🇨🇼',
    teamB: 'Ivory Coast',
    teamBLogo: '🇨🇮',
    kickoffTime: new Date('2026-06-26T01:30:00+05:30')
  },
  {
    teamA: 'Tunisia',
    teamALogo: '🇹🇳',
    teamB: 'Netherlands',
    teamBLogo: '🇳🇱',
    kickoffTime: new Date('2026-06-26T04:30:00+05:30')
  },
  {
    teamA: 'Japan',
    teamALogo: '🇯🇵',
    teamB: 'Sweden',
    teamBLogo: '🇸🇪',
    kickoffTime: new Date('2026-06-26T04:30:00+05:30')
  },
  {
    teamA: 'Türkiye',
    teamALogo: '🇹🇷',
    teamB: 'United States',
    teamBLogo: '🇺🇸',
    kickoffTime: new Date('2026-06-26T07:30:00+05:30')
  },
  {
    teamA: 'Paraguay',
    teamALogo: '🇵🇾',
    teamB: 'Australia',
    teamBLogo: '🇦🇺',
    kickoffTime: new Date('2026-06-26T07:30:00+05:30')
  },
  {
    teamA: 'Norway',
    teamALogo: '🇳🇴',
    teamB: 'France',
    teamBLogo: '🇫🇷',
    kickoffTime: new Date('2026-06-27T00:30:00+05:30')
  },
  {
    teamA: 'Senegal',
    teamALogo: '🇸🇳',
    teamB: 'Iraq',
    teamBLogo: '🇮🇶',
    kickoffTime: new Date('2026-06-27T00:30:00+05:30')
  },
  {
    teamA: 'Uruguay',
    teamALogo: '🇺🇾',
    teamB: 'Spain',
    teamBLogo: '🇪🇸',
    kickoffTime: new Date('2026-06-27T05:30:00+05:30')
  },
  {
    teamA: 'Cape Verde',
    teamALogo: '🇨🇻',
    teamB: 'Saudi Arabia',
    teamBLogo: '🇸🇦',
    kickoffTime: new Date('2026-06-27T05:30:00+05:30')
  },
  {
    teamA: 'New Zealand',
    teamALogo: '🇳🇿',
    teamB: 'Belgium',
    teamBLogo: '🇧🇪',
    kickoffTime: new Date('2026-06-27T08:30:00+05:30')
  },
  {
    teamA: 'Egypt',
    teamALogo: '🇪🇬',
    teamB: 'Iran',
    teamBLogo: '🇮🇷',
    kickoffTime: new Date('2026-06-27T08:30:00+05:30')
  },
  {
    teamA: 'Panama',
    teamALogo: '🇵🇦',
    teamB: 'England',
    teamBLogo: '🏴',
    kickoffTime: new Date('2026-06-28T02:30:00+05:30')
  },
  {
    teamA: 'Croatia',
    teamALogo: '🇭🇷',
    teamB: 'Ghana',
    teamBLogo: '🇬🇭',
    kickoffTime: new Date('2026-06-28T02:30:00+05:30')
  },
  {
    teamA: 'Colombia',
    teamALogo: '🇨🇴',
    teamB: 'Portugal',
    teamBLogo: '🇵🇹',
    kickoffTime: new Date('2026-06-28T05:00:00+05:30')
  },
  {
    teamA: 'Congo DR',
    teamALogo: '🇨🇩',
    teamB: 'Uzbekistan',
    teamBLogo: '🇺🇿',
    kickoffTime: new Date('2026-06-28T05:00:00+05:30')
  },
  {
    teamA: 'Amman Jordan',
    teamALogo: '🇯🇴',
    teamB: 'Argentina',
    teamBLogo: '🇦🇷',
    kickoffTime: new Date('2026-06-28T07:30:00+05:30')
  },
  {
    teamA: 'Algeria',
    teamALogo: '🇩🇿',
    teamB: 'Austria',
    teamBLogo: '🇦🇹',
    kickoffTime: new Date('2026-06-28T07:30:00+05:30')
  },
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

module.exports = matchesData;
