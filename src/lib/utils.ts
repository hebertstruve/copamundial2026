import { INITIAL_GROUPS } from '@/data/groups';

export function getTable(groupId: string, matches: any[]) {
  const groupTeams = INITIAL_GROUPS[groupId];
  if (!groupTeams) return [];
  const teams = groupTeams.map((t: any) => ({ name: t.name, pj: 0, gf: 0, gc: 0, pts: 0 }));
  matches.filter(m => m.group === groupId && m.played).forEach(m => {
    const h = teams.find((t: any) => t.name === m.home);
    const a = teams.find((t: any) => t.name === m.away);
    if (h && a) {
      h.pj++; a.pj++; h.gf += m.scoreH; h.gc += m.scoreA; a.gf += m.scoreA; a.gc += m.scoreH;
      if (m.scoreH > m.scoreA) h.pts += 3; else if (m.scoreA > m.scoreH) a.pts += 3; else { h.pts += 1; a.pts += 1; }
    }
  });
  return teams.sort((a: any, b: any) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));
}

export function getScoreColor(scoreThis: number, scoreThat: number, played: boolean, dark: boolean): string {
  if (!played) return dark
    ? 'bg-slate-700 border-slate-600 text-slate-100'
    : 'bg-slate-50 border-slate-100 text-slate-900';
  if (scoreThis > scoreThat) return dark
    ? 'bg-green-900/50 border-green-700 text-green-400 font-black'
    : 'bg-green-100 border-green-200 text-green-700 font-black';
  if (scoreThis < scoreThat) return dark
    ? 'bg-red-900/50 border-red-700 text-red-400'
    : 'bg-red-50 border-red-100 text-red-600';
  return dark
    ? 'bg-amber-900/50 border-amber-700 text-amber-400'
    : 'bg-amber-50 border-amber-200 text-amber-700';
}
