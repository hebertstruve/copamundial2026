import { INITIAL_GROUPS } from '@/data/groups';
import { GROUP_SCHEDULE } from '@/data/schedule';

export function generateInitialMatches() {
  const m: any[] = [];
  Object.keys(INITIAL_GROUPS).forEach(g => {
    const t = INITIAL_GROUPS[g];
    const pairs = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
    pairs.forEach((p, i) => {
      const sched = GROUP_SCHEDULE[g]?.[i] ?? { venue: "Por confirmar", date: "TBD", time: "TBD" };
      m.push({
        id: `${g}-${i}`, group: g,
        home: t[p[0]].name, away: t[p[1]].name,
        scoreH: 0, scoreA: 0, played: false,
        venue: sched.venue, date: sched.date, time: sched.time,
      });
    });
  });
  return m;
}

export function generateInitialBracket() {
  const rounds = [
    { name: "32avos", count: 16, prefix: "R32" },
    { name: "Octavos", count: 8,  prefix: "R16" },
    { name: "Cuartos", count: 4,  prefix: "QF"  },
    { name: "Semis",   count: 2,  prefix: "SF"  },
    { name: "FINAL",   count: 1,  prefix: "FINAL" },
  ];
  const b: any[] = [];
  rounds.forEach((round, rIdx) => {
    for (let i = 1; i <= round.count; i++) {
      b.push({
        id: `${round.prefix}-${i}`, round: round.name,
        teamH: "TBD", teamA: "TBD",
        scoreH: 0, scoreA: 0, penH: 0, penA: 0,
        winner: null, played: false,
        next: rounds[rIdx + 1] ? `${rounds[rIdx + 1].prefix}-${Math.ceil(i / 2)}` : null,
      });
    }
  });
  return b;
}
