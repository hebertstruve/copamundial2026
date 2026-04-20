import { INITIAL_GROUPS } from '@/data/groups';

export interface StandingRow {
  name: string;
  pj: number;
  v: number;
  e: number;
  d: number;
  gf: number;
  gc: number;
  sg: number;
  pts: number;
}

export function getTable(groupId: string, matches: any[]): StandingRow[] {
  const groupTeams = INITIAL_GROUPS[groupId];
  if (!groupTeams) return [];
  const teams: StandingRow[] = groupTeams.map((t) => ({
    name: t.name,
    pj: 0, v: 0, e: 0, d: 0,
    gf: 0, gc: 0, sg: 0, pts: 0,
  }));

  matches
    .filter((m) => m.group === groupId && m.played)
    .forEach((m) => {
      const h = teams.find((t) => t.name === m.home);
      const a = teams.find((t) => t.name === m.away);
      if (!h || !a) return;
      h.pj++; a.pj++;
      h.gf += m.scoreH; h.gc += m.scoreA;
      a.gf += m.scoreA; a.gc += m.scoreH;
      if (m.scoreH > m.scoreA) {
        h.v++; a.d++; h.pts += 3;
      } else if (m.scoreA > m.scoreH) {
        a.v++; h.d++; a.pts += 3;
      } else {
        h.e++; a.e++; h.pts++; a.pts++;
      }
    });

  teams.forEach((t) => (t.sg = t.gf - t.gc));
  return teams.sort(
    (a, b) => b.pts - a.pts || b.sg - a.sg || b.gf - a.gf
  );
}

export function computeBestThirds(matches: any[]): Set<string> {
  const thirds = Object.keys(INITIAL_GROUPS)
    .map((g) => getTable(g, matches)[2])
    .filter(Boolean);
  return new Set(
    thirds
      .sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gf - a.gf)
      .slice(0, 8)
      .map((t) => t.name)
  );
}

/** Legacy helper kept for BracketMatch during Phase 2 (bracket re-skin happens in Phase 3). */
export function getScoreColor(
  scoreThis: number,
  scoreThat: number,
  played: boolean,
  dark: boolean
): string {
  if (!played)
    return dark
      ? 'bg-slate-700 border-slate-600 text-slate-100'
      : 'bg-slate-50 border-slate-100 text-slate-900';
  if (scoreThis > scoreThat)
    return dark
      ? 'bg-green-900/50 border-green-700 text-green-400 font-black'
      : 'bg-green-100 border-green-200 text-green-700 font-black';
  if (scoreThis < scoreThat)
    return dark
      ? 'bg-red-900/50 border-red-700 text-red-400'
      : 'bg-red-50 border-red-100 text-red-600';
  return dark
    ? 'bg-amber-900/50 border-amber-700 text-amber-400'
    : 'bg-amber-50 border-amber-200 text-amber-700';
}
