// Gera calendário de partidas para os 12 grupos
// Cada grupo tem 6 partidas (round-robin entre 4 times)
// Depois 16 avos (32 → 16), oitavas (16→8), quartas, semis, 3º lugar, final

(function() {
  const groups = window.TEAMS_DATA.groups;
  const groupKeys = Object.keys(groups);
  const venues = window.VENUES;

  // datas fase de grupos (11 jun - 27 jun 2026)
  const groupDates = [
    '11 JUN', '12 JUN', '13 JUN', '14 JUN', '15 JUN', '16 JUN',
    '17 JUN', '18 JUN', '19 JUN', '20 JUN', '21 JUN', '22 JUN',
    '23 JUN', '24 JUN', '25 JUN', '26 JUN', '27 JUN'
  ];
  const times = ['13:00', '15:00', '17:00', '19:00', '21:00'];

  // round-robin pairings for 4 teams: (0,1)(2,3), (0,2)(1,3), (0,3)(1,2)
  const pairings = [[[0,1],[2,3]], [[0,2],[1,3]], [[0,3],[1,2]]];

  const matches = [];
  let matchId = 0;

  groupKeys.forEach((gKey, gIdx) => {
    const teams = groups[gKey];
    pairings.forEach((round, rIdx) => {
      round.forEach((pair, pIdx) => {
        const dateIdx = (gIdx + rIdx * 6) % groupDates.length;
        const timeIdx = (gIdx + pIdx * 3) % times.length;
        const venueIdx = (matchId) % venues.length;
        matches.push({
          id: `G${gKey}-${rIdx}-${pIdx}`,
          phase: 'groups',
          group: gKey,
          round: rIdx + 1,
          date: groupDates[dateIdx],
          time: times[timeIdx],
          venue: venues[venueIdx],
          home: teams[pair[0]].code,
          away: teams[pair[1]].code,
          homeScore: null,
          awayScore: null,
          played: false
        });
        matchId++;
      });
    });
  });

  // Eliminatórias - placeholders preenchidos após fase de grupos
  // 48 equipes → top 2 de cada grupo (24) + 8 melhores terceiros = 32 para 16avos
  const knockoutRounds = [
    { key: 'R32', label: '16AVOS', slots: 16, dateStart: 28 }, // 32 times → 16
    { key: 'R16', label: 'OITAVAS', slots: 8, dateStart: 4 },  // 16 → 8
    { key: 'QF',  label: 'QUARTAS', slots: 4, dateStart: 10 },
    { key: 'SF',  label: 'SEMIFINAIS', slots: 2, dateStart: 14 },
    { key: '3P',  label: '3º LUGAR', slots: 1, dateStart: 18 },
    { key: 'F',   label: 'FINAL', slots: 1, dateStart: 19 }
  ];

  const knockoutMatches = [];
  knockoutRounds.forEach((kr) => {
    for (let i = 0; i < kr.slots; i++) {
      knockoutMatches.push({
        id: `${kr.key}-${i}`,
        phase: 'knockout',
        round: kr.key,
        roundLabel: kr.label,
        slotIndex: i,
        date: kr.key === 'F' ? '19 JUL' : kr.key === '3P' ? '18 JUL' : null,
        venue: venues[i % venues.length],
        home: null,
        away: null,
        homeScore: null,
        awayScore: null,
        homePenalties: null,
        awayPenalties: null,
        played: false
      });
    }
  });

  window.SCHEDULE = {
    groupMatches: matches,
    knockoutMatches: knockoutMatches
  };
})();
