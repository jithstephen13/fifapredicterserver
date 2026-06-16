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
    teamA: '2A',
    teamALogo: '🏳️',
    teamB: '2B',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-06-29T00:30:00+05:30')
  },
  {
    teamA: '1C',
    teamALogo: '🏳️',
    teamB: '2F',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-06-29T22:30:00+05:30')
  },
  {
    teamA: '1E',
    teamALogo: '🏳️',
    teamB: '3ABCDF',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-06-30T02:00:00+05:30')
  },
  {
    teamA: '1F',
    teamALogo: '🏳️',
    teamB: '2C',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-06-30T06:30:00+05:30')
  },
  {
    teamA: '2E',
    teamALogo: '🏳️',
    teamB: '2I',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-06-30T22:30:00+05:30')
  },
  {
    teamA: '1I',
    teamALogo: '🏳️',
    teamB: '3CDFGH',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-01T02:30:00+05:30')
  },
  {
    teamA: '1A',
    teamALogo: '🏳️',
    teamB: '3CEFHI',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-01T06:30:00+05:30')
  },
  {
    teamA: '1L',
    teamALogo: '🏳️',
    teamB: '3EHIJK',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-01T21:30:00+05:30')
  },
  {
    teamA: '1G',
    teamALogo: '🏳️',
    teamB: '3AEHIJ',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-02T01:30:00+05:30')
  },
  {
    teamA: '1D',
    teamALogo: '🏳️',
    teamB: '3BEFIJ',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-02T05:30:00+05:30')
  },
  {
    teamA: '1H',
    teamALogo: '🏳️',
    teamB: '2J',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-03T00:30:00+05:30')
  },
  {
    teamA: '2K',
    teamALogo: '🏳️',
    teamB: '2L',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-03T04:30:00+05:30')
  },
  {
    teamA: '1B',
    teamALogo: '🏳️',
    teamB: '3EFGIJ',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-03T08:30:00+05:30')
  },
  {
    teamA: '2D',
    teamALogo: '🏳️',
    teamB: '2G',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-03T23:30:00+05:30')
  },
  {
    teamA: '1J',
    teamALogo: '🏳️',
    teamB: '2H',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-04T03:30:00+05:30')
  },
  {
    teamA: '1K',
    teamALogo: '🏳️',
    teamB: '3DEIJL',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-04T07:00:00+05:30')
  },
  {
    teamA: 'W73',
    teamALogo: '🏳️',
    teamB: 'W75',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-04T22:30:00+05:30')
  },
  {
    teamA: 'W74',
    teamALogo: '🏳️',
    teamB: 'W77',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-05T02:30:00+05:30')
  },
  {
    teamA: 'W76',
    teamALogo: '🏳️',
    teamB: 'W78',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-06T01:30:00+05:30')
  },
  {
    teamA: 'W79',
    teamALogo: '🏳️',
    teamB: 'W80',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-06T05:30:00+05:30')
  },
  {
    teamA: 'W83',
    teamALogo: '🏳️',
    teamB: 'W84',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T00:30:00+05:30')
  },
  {
    teamA: 'W81',
    teamALogo: '🏳️',
    teamB: 'W82',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T05:30:00+05:30')
  },
  {
    teamA: 'W86',
    teamALogo: '🏳️',
    teamB: 'W88',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-07T21:30:00+05:30')
  },
  {
    teamA: 'W85',
    teamALogo: '🏳️',
    teamB: 'W87',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-08T01:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-10T01:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-11T00:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-12T02:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-12T06:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-15T00:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-16T00:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-19T02:30:00+05:30')
  },
  {
    teamA: 'TBD',
    teamALogo: '🏳️',
    teamB: 'TBD',
    teamBLogo: '🏳️',
    kickoffTime: new Date('2026-07-20T00:30:00+05:30')
  }
];

module.exports = matchesData;
