import { ALL_TEAMS } from '@/data/groups';
import { scorersForTeam } from '@/data/scorers';

export interface ScorerGoal {
  matchId: string;
  player: string;
  team: string;
}

export interface TopScorer {
  player: string;
  team: string;
  goals: number;
}

function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/** Distribución ponderada más realista: más 0–2 goles que 4+. */
export function randomScore(): number {
  const r = Math.random();
  if (r < 0.32) return 0;
  if (r < 0.66) return 1;
  if (r < 0.86) return 2;
  if (r < 0.96) return 3;
  return 4;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(arr.length)];
}

export function assignScorersForMatch(
  matchId: string,
  homeName: string,
  scoreH: number,
  awayName: string,
  scoreA: number
): ScorerGoal[] {
  const goals: ScorerGoal[] = [];
  const home = ALL_TEAMS.find((t) => t.name === homeName);
  const away = ALL_TEAMS.find((t) => t.name === awayName);
  if (home) {
    const pool = scorersForTeam(home.code);
    for (let i = 0; i < scoreH; i++) {
      goals.push({ matchId, player: pick(pool), team: homeName });
    }
  }
  if (away) {
    const pool = scorersForTeam(away.code);
    for (let i = 0; i < scoreA; i++) {
      goals.push({ matchId, player: pick(pool), team: awayName });
    }
  }
  return goals;
}

/** Reemplaza los goleadores asociados a un matchId, devuelve el array completo. */
export function replaceScorersForMatch(
  scorers: ScorerGoal[],
  matchId: string,
  newForMatch: ScorerGoal[]
): ScorerGoal[] {
  return [...scorers.filter((s) => s.matchId !== matchId), ...newForMatch];
}

export function computeTopScorer(scorers: ScorerGoal[]): TopScorer | null {
  if (scorers.length === 0) return null;
  const counts = new Map<string, TopScorer>();
  scorers.forEach((g) => {
    const key = `${g.player}|${g.team}`;
    const prev = counts.get(key) ?? { player: g.player, team: g.team, goals: 0 };
    prev.goals++;
    counts.set(key, prev);
  });
  const list = [...counts.values()];
  list.sort((a, b) => b.goals - a.goals);
  return list[0] ?? null;
}

/** Simula todos los partidos de un grupo y devuelve (matches actualizados, goleadores nuevos). */
export function simulateGroupData(
  matches: any[],
  groupId: string
): { matches: any[]; goals: ScorerGoal[] } {
  const newGoals: ScorerGoal[] = [];
  const newMatches = matches.map((m) => {
    if (m.group !== groupId) return m;
    const scoreH = randomScore();
    const scoreA = randomScore();
    const assigned = assignScorersForMatch(m.id, m.home, scoreH, m.away, scoreA);
    newGoals.push(...assigned);
    return { ...m, scoreH, scoreA, played: true };
  });
  return { matches: newMatches, goals: newGoals };
}

/** Simula todos los 72 partidos de fase de grupos. */
export function simulateAllGroupsData(matches: any[]): {
  matches: any[];
  goals: ScorerGoal[];
} {
  const newGoals: ScorerGoal[] = [];
  const newMatches = matches.map((m) => {
    const scoreH = randomScore();
    const scoreA = randomScore();
    const assigned = assignScorersForMatch(m.id, m.home, scoreH, m.away, scoreA);
    newGoals.push(...assigned);
    return { ...m, scoreH, scoreA, played: true };
  });
  return { matches: newMatches, goals: newGoals };
}

/** Simula una ronda del bracket (por nombre) y propaga ganadores al siguiente. */
export function simulateBracketRoundData(
  bracket: any[],
  roundName: string
): { bracket: any[]; goals: ScorerGoal[] } {
  const newB = bracket.map((m) => ({ ...m }));
  const newGoals: ScorerGoal[] = [];

  newB
    .filter((m) => m.round === roundName && m.teamH !== 'TBD' && m.teamA !== 'TBD')
    .forEach((m) => {
      const scoreH = randomScore();
      const scoreA = randomScore();
      m.scoreH = scoreH;
      m.scoreA = scoreA;
      m.played = true;

      const assigned = assignScorersForMatch(m.id, m.teamH, scoreH, m.teamA, scoreA);
      newGoals.push(...assigned);

      let winner: string | null = null;
      if (scoreH > scoreA) winner = m.teamH;
      else if (scoreA > scoreH) winner = m.teamA;
      else {
        // Penales aleatorios 3–6 con ganador forzado
        const pH = randInt(4) + 3;
        let pA = randInt(4) + 3;
        while (pH === pA) pA = randInt(4) + 3;
        m.penH = pH;
        m.penA = pA;
        winner = pH > pA ? m.teamH : m.teamA;
      }
      m.winner = winner;

      if (winner && m.next) {
        const nIdx = newB.findIndex((nb) => nb.id === m.next);
        if (nIdx !== -1) {
          const matchNum = Number(String(m.id).split('-')[1]);
          if (matchNum % 2 !== 0) newB[nIdx].teamH = winner;
          else newB[nIdx].teamA = winner;
        }
      }
    });

  return { bracket: newB, goals: newGoals };
}
