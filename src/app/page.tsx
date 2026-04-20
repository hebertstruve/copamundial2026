"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy: canvas-confetti (~10KB gz) only fires on FINAL win or simulateAll climax.
const fireConfetti = async (opts: { particleCount: number; spread: number }) => {
  const mod = await import('canvas-confetti');
  mod.default(opts);
};
import { INITIAL_GROUPS } from '@/data/groups';
import { useTheme } from '@/contexts/ThemeContext';
import { generateInitialMatches, generateInitialBracket } from '@/lib/generators';
import { getTable } from '@/lib/utils';
import {
  ScorerGoal,
  assignScorersForMatch,
  replaceScorersForMatch,
  computeTopScorer,
  simulateGroupData,
  simulateAllGroupsData,
  simulateBracketRoundData,
} from '@/lib/simulate';
import { MatchCard } from '@/components/MatchCard';
import { GroupTable } from '@/components/GroupTable';
import { BracketMatch } from '@/components/BracketMatch';
import { Masthead } from '@/components/Masthead';
import { Metabar } from '@/components/Metabar';
import { PhaseNav, PhaseView } from '@/components/PhaseNav';
import { GroupRail } from '@/components/GroupRail';
import { GroupHeader } from '@/components/GroupHeader';
import { BestThirdsPanel } from '@/components/BestThirdsPanel';
import { FinalView } from '@/components/FinalView';
import { FxOverlay, FxMessage } from '@/components/FxOverlay';
import { TeamModalProvider } from '@/contexts/TeamModalContext';
import { TeamModal } from '@/components/TeamModal';
import { TweaksPanel } from '@/components/TweaksPanel';

const LS_MATCHES = 'wc26-v14-m';
const LS_BRACKET = 'wc26-v14-b';
const LS_SCORERS = 'wc26-v14-s';

interface Snapshot {
  matches: any[];
  bracket: any[];
  scorers: ScorerGoal[];
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function WorldCupApp() {
  const { t } = useTheme();
  const [view, setView] = useState<PhaseView>('groups');
  const [activeGroup, setActiveGroup] = useState('A');
  const [matches, setMatches] = useState<any[]>([]);
  const [bracket, setBracket] = useState<any[]>([]);
  const [scorers, setScorers] = useState<ScorerGoal[]>([]);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [fx, setFx] = useState<FxMessage | null>(null);
  const simulatingRef = useRef(false);

  const snapshot = (): Snapshot => ({ matches, bracket, scorers });
  const pushHistory = () => {
    setPast((p) => [...p.slice(-19), snapshot()]);
    setFuture([]);
  };
  const undo = () => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [snapshot(), ...f]);
    setMatches(prev.matches);
    setBracket(prev.bracket);
    setScorers(prev.scorers);
  };
  const redo = () => {
    if (future.length === 0) return;
    const nxt = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, snapshot()]);
    setMatches(nxt.matches);
    setBracket(nxt.bracket);
    setScorers(nxt.scorers);
  };

  useEffect(() => {
    const m = localStorage.getItem(LS_MATCHES);
    const b = localStorage.getItem(LS_BRACKET);
    const s = localStorage.getItem(LS_SCORERS);
    setMatches(m ? JSON.parse(m) : generateInitialMatches());
    setBracket(b ? JSON.parse(b) : generateInitialBracket());
    if (s) setScorers(JSON.parse(s));
  }, []);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem(LS_MATCHES, JSON.stringify(matches));
    if (bracket.length > 0) localStorage.setItem(LS_BRACKET, JSON.stringify(bracket));
    localStorage.setItem(LS_SCORERS, JSON.stringify(scorers));
  }, [matches, bracket, scorers]);

  const resetAll = () => {
    if (!confirm(t('confirmReset'))) return;
    pushHistory();
    setMatches(generateInitialMatches());
    setBracket(generateInitialBracket());
    setScorers([]);
    setView('groups');
    setActiveGroup('A');
  };

  const handleGroupScoreChange = (id: string, side: string, val: string) => {
    const v = Math.max(0, parseInt(val) || 0);
    setMatches((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, [side]: v, played: true } : m
      );
      const updated = next.find((m) => m.id === id);
      if (updated) {
        const newGoals = assignScorersForMatch(
          id,
          updated.home,
          updated.scoreH,
          updated.away,
          updated.scoreA
        );
        setScorers((s) => replaceScorersForMatch(s, id, newGoals));
      }
      return next;
    });
  };

  const handleBracketScoreChange = (id: string, side: string, val: string) => {
    const v = Math.max(0, parseInt(val) || 0);
    setBracket((prev) => {
      const newB = [...prev];
      const idx = newB.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const m = { ...newB[idx], [side]: v, played: true };
      if ((side === 'scoreH' || side === 'scoreA') && m.scoreH !== m.scoreA) {
        m.penH = 0;
        m.penA = 0;
      }
      let winner = null;
      if (m.scoreH > m.scoreA) winner = m.teamH;
      else if (m.scoreA > m.scoreH) winner = m.teamA;
      else if (m.penH > m.penA) winner = m.teamH;
      else if (m.penA > m.penH) winner = m.teamA;
      m.winner = winner;
      newB[idx] = m;
      if (m.winner && m.next) {
        const nIdx = newB.findIndex((nb) => nb.id === m.next);
        if (nIdx !== -1) {
          const matchNum = Number(String(id).split('-')[1]);
          if (matchNum % 2 !== 0) newB[nIdx].teamH = m.winner;
          else newB[nIdx].teamA = m.winner;
        }
      }
      if (id === 'FINAL-1' && m.winner) fireConfetti({ particleCount: 150, spread: 70 });
      if (side === 'scoreH' || side === 'scoreA') {
        const newGoals = assignScorersForMatch(id, m.teamH, m.scoreH, m.teamA, m.scoreA);
        setScorers((s) => replaceScorersForMatch(s, id, newGoals));
      }
      return newB;
    });
  };

  const simulateGroup = async (g: string) => {
    if (simulatingRef.current) return;
    simulatingRef.current = true;
    pushHistory();
    setFx({ kicker: t('simulateGroup'), title: `${t('group')} ${g}` });
    await wait(700);
    const { matches: newM, goals } = simulateGroupData(matches, g);
    setMatches(newM);
    setScorers((prev) => {
      const keep = prev.filter((s) => !newM.some((m) => m.group === g && m.id === s.matchId));
      return [...keep, ...goals];
    });
    setFx(null);
    simulatingRef.current = false;
  };

  const seedKnockoutFromGroups = (currentMatches: any[]): any[] => {
    const winners: string[] = [];
    const runnersUp: string[] = [];
    const thirds: any[] = [];
    Object.keys(INITIAL_GROUPS).forEach((g) => {
      const table = getTable(g, currentMatches);
      if (table.length >= 3) {
        winners.push(table[0].name);
        runnersUp.push(table[1].name);
        thirds.push({
          name: table[2].name,
          pts: table[2].pts,
          sg: table[2].sg,
          gf: table[2].gf,
        });
      }
    });
    const bestThirds = thirds
      .sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gf - a.gf)
      .slice(0, 8)
      .map((t) => t.name);
    const qualified = [...winners, ...runnersUp, ...bestThirds];
    const newB = generateInitialBracket();
    for (let i = 0; i < 16; i++) {
      if (qualified[i]) newB[i].teamH = qualified[i];
      if (qualified[31 - i]) newB[i].teamA = qualified[31 - i];
    }
    return newB;
  };

  const generateKnockout = () => {
    pushHistory();
    setBracket(seedKnockoutFromGroups(matches));
    setView('bracket');
  };

  const simulateAll = async () => {
    if (simulatingRef.current) return;
    simulatingRef.current = true;
    pushHistory();

    setFx({ kicker: 'SIMULANDO', title: t('phaseGroups'), subtitle: '72 partidos' });
    await wait(700);
    const { matches: simM, goals: groupGoals } = simulateAllGroupsData(
      matches.length > 0 ? matches : generateInitialMatches()
    );
    setMatches(simM);
    setView('groups');

    await wait(400);
    setFx({ kicker: 'SIMULANDO', title: t('roundR32') });
    await wait(500);
    let newB = seedKnockoutFromGroups(simM);
    const r32 = simulateBracketRoundData(newB, '32avos');
    newB = r32.bracket;
    setBracket(newB);
    setView('bracket');

    await wait(400);
    setFx({ kicker: 'SIMULANDO', title: t('roundR16') });
    await wait(500);
    const r16 = simulateBracketRoundData(newB, 'Octavos');
    newB = r16.bracket;
    setBracket(newB);

    await wait(400);
    setFx({ kicker: 'SIMULANDO', title: t('roundQF') });
    await wait(500);
    const qf = simulateBracketRoundData(newB, 'Cuartos');
    newB = qf.bracket;
    setBracket(newB);

    await wait(400);
    setFx({ kicker: 'SIMULANDO', title: t('roundSF') });
    await wait(500);
    const sf = simulateBracketRoundData(newB, 'Semis');
    newB = sf.bracket;
    setBracket(newB);

    await wait(400);
    setFx({ kicker: t('phaseFinalTag'), title: t('phaseFinal'), subtitle: '⚡' });
    await wait(600);
    const fin = simulateBracketRoundData(newB, 'FINAL');
    newB = fin.bracket;
    setBracket(newB);

    const allGoals = [
      ...groupGoals,
      ...r32.goals,
      ...r16.goals,
      ...qf.goals,
      ...sf.goals,
      ...fin.goals,
    ];
    setScorers(allGoals);

    const finalMatch = newB.find((m) => m.id === 'FINAL-1');
    if (finalMatch?.winner) {
      await wait(300);
      fireConfetti({ particleCount: 250, spread: 90 });
      setFx({
        kicker: t('champion'),
        title: finalMatch.winner,
        subtitle: '— Copa del Mundo 2026 —',
      });
      await wait(1400);
    }

    setFx(null);
    setView('final');
    simulatingRef.current = false;
  };

  const totalGoals = useMemo(
    () =>
      matches.reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0) +
      bracket
        .filter((m) => m.played && m.teamH !== 'TBD' && m.teamA !== 'TBD')
        .reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0),
    [matches, bracket]
  );

  const matchesPlayed =
    matches.filter((m) => m.played).length +
    bracket.filter((m) => m.played && m.teamH !== 'TBD' && m.teamA !== 'TBD').length;

  const playedPerGroup = useMemo(() => {
    const acc: Record<string, number> = {};
    Object.keys(INITIAL_GROUPS).forEach((g) => {
      acc[g] = matches.filter((m) => m.group === g && m.played).length;
    });
    return acc;
  }, [matches]);

  const top = useMemo(() => computeTopScorer(scorers), [scorers]);
  const topScorerLabel = top ? `${top.player} · ${top.goals}` : null;

  const champion = useMemo(() => {
    const finalMatch = bracket.find((m) => m.id === 'FINAL-1');
    return finalMatch?.winner ?? null;
  }, [bracket]);

  return (
    <TeamModalProvider>
    <main
      className="min-h-screen"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <Masthead />
      <Metabar
        matchesPlayed={matchesPlayed}
        totalGoals={totalGoals}
        topScorer={topScorerLabel}
        champion={champion}
        onReset={resetAll}
        onSimulateAll={simulateAll}
        onUndo={undo}
        onRedo={redo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
      />
      <PhaseNav view={view} onChange={setView} />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {view === 'groups' && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5"
            >
              <div className="md:col-span-1">
                <GroupRail
                  active={activeGroup}
                  onSelect={setActiveGroup}
                  playedPerGroup={playedPerGroup}
                />
              </div>

              <div className="md:col-span-7 space-y-4">
                <GroupHeader
                  groupId={activeGroup}
                  onSimulateGroup={() => simulateGroup(activeGroup)}
                />
                {matches
                  .filter((m) => m.group === activeGroup)
                  .map((m) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      onScoreChange={handleGroupScoreChange}
                    />
                  ))}
              </div>

              <div className="md:col-span-4 space-y-4 h-fit md:sticky md:top-4">
                <GroupTable groupId={activeGroup} matches={matches} />
                <BestThirdsPanel matches={matches} />
                <button
                  onClick={generateKnockout}
                  className="w-full font-mono uppercase tracking-[0.2em] py-2.5 border-2"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--paper)',
                    borderColor: 'var(--ink)',
                    fontSize: 10,
                  }}
                >
                  ⚡ Generar llave
                </button>
              </div>
            </motion.div>
          )}

          {view === 'bracket' && (
            <motion.div
              key="bracket"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div
                className="mb-6 md:mb-10 flex items-end justify-between gap-6 border-b pb-4"
                style={{ borderColor: 'var(--rule)' }}
              >
                <h2
                  className="font-display uppercase leading-[0.85]"
                  style={{
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    color: 'var(--ink)',
                  }}
                >
                  {t('bracketTitle')}
                </h2>
                <div
                  className="font-mono uppercase tracking-[0.2em] pb-2 hidden md:block"
                  style={{ fontSize: 10, color: 'var(--mute)' }}
                >
                  R32 · R16 · QF · SF · F
                </div>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-10 px-1">
                {[
                  { id: '32avos', key: 'roundR32' },
                  { id: 'Octavos', key: 'roundR16' },
                  { id: 'Cuartos', key: 'roundQF' },
                  { id: 'Semis', key: 'roundSF' },
                  { id: 'FINAL', key: 'roundFinal' },
                ].map((round) => (
                  <div key={round.id} className="w-64 flex-shrink-0">
                    <h3
                      className="text-center font-mono mb-4 uppercase tracking-[0.2em] pb-2 border-b"
                      style={{
                        fontSize: 10,
                        color: 'var(--accent)',
                        borderColor: 'var(--rule)',
                      }}
                    >
                      {t(round.key)}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {bracket
                        .filter((m) => m.round === round.id)
                        .map((m) => (
                          <BracketMatch
                            key={m.id}
                            match={m}
                            onScoreChange={handleBracketScoreChange}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'final' && (
            <FinalView matches={matches} bracket={bracket} topScorer={top} />
          )}
        </AnimatePresence>
      </div>

      <FxOverlay message={fx} />
      <TeamModal matches={matches} scorers={scorers} />
      <TweaksPanel />
    </main>
    </TeamModalProvider>
  );
}
