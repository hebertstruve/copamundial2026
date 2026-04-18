"use client";
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_GROUPS } from '@/data/groups';
import { useDarkMode } from '@/hooks/useDarkMode';
import { generateInitialMatches, generateInitialBracket } from '@/lib/generators';
import { getTable } from '@/lib/utils';
import { IconSun } from '@/components/icons/IconSun';
import { IconMoon } from '@/components/icons/IconMoon';
import { TeamLabel } from '@/components/TeamLabel';
import { MatchCard } from '@/components/MatchCard';
import { GroupTable } from '@/components/GroupTable';
import { BracketMatch } from '@/components/BracketMatch';
import { WorldCupNews } from '@/components/WorldCupNews';

export default function WorldCupApp() {
  const [view, setView] = useState("groups");
  const [activeGroup, setActiveGroup] = useState("A");
  const [matches, setMatches] = useState<any[]>([]);
  const [bracket, setBracket] = useState<any[]>([]);
  const { dark, setDark } = useDarkMode();

  useEffect(() => {
    const m = localStorage.getItem('wc26-v13-m');
    const b = localStorage.getItem('wc26-v13-b');
    setMatches(m ? JSON.parse(m) : generateInitialMatches());
    setBracket(b ? JSON.parse(b) : generateInitialBracket());
  }, []);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('wc26-v13-m', JSON.stringify(matches));
    if (bracket.length > 0) localStorage.setItem('wc26-v13-b', JSON.stringify(bracket));
  }, [matches, bracket]);

  const resetAll = () => {
    if (!confirm("¿Seguro que quieres borrar todos los resultados?")) return;
    setMatches(generateInitialMatches());
    setBracket(generateInitialBracket());
    localStorage.removeItem('wc26-v13-m');
    localStorage.removeItem('wc26-v13-b');
  };

  const handleGroupScoreChange = (id: string, side: string, val: string) => {
    const v = Math.max(0, parseInt(val) || 0);
    setMatches(prev => prev.map(m => m.id === id ? { ...m, [side]: v, played: true } : m));
  };

  const handleBracketScoreChange = (id: string, side: string, val: string) => {
    const v = Math.max(0, parseInt(val) || 0);
    setBracket(prev => {
      const newB = [...prev];
      const idx = newB.findIndex(m => m.id === id);
      if (idx === -1) return prev;
      const m = { ...newB[idx], [side]: v, played: true };
      if ((side === 'scoreH' || side === 'scoreA') && m.scoreH !== m.scoreA) { m.penH = 0; m.penA = 0; }
      let winner = null;
      if (m.scoreH > m.scoreA) winner = m.teamH;
      else if (m.scoreA > m.scoreH) winner = m.teamA;
      else if (m.penH > m.penA) winner = m.teamH;
      else if (m.penA > m.penH) winner = m.teamA;
      m.winner = winner;
      newB[idx] = m;
      if (m.winner && m.next) {
        const nIdx = newB.findIndex(nb => nb.id === m.next);
        if (nIdx !== -1) {
          const matchNum = Number(id.split('-')[1]);
          if (matchNum % 2 !== 0) newB[nIdx].teamH = m.winner;
          else newB[nIdx].teamA = m.winner;
        }
      }
      if (id === "FINAL-1" && m.winner) confetti({ particleCount: 150, spread: 70 });
      return newB;
    });
  };

  const generateKnockout = () => {
    const winners: any[] = [];
    const runnersUp: any[] = [];
    const thirds: any[] = [];
    Object.keys(INITIAL_GROUPS).forEach(g => {
      const table = getTable(g, matches);
      if (table.length >= 3) {
        winners.push(table[0].name); runnersUp.push(table[1].name);
        thirds.push({ name: table[2].name, pts: table[2].pts, gd: table[2].gf - table[2].gc });
      }
    });
    const bestThirds = thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd).slice(0, 8).map(t => t.name);
    const qualified = [...winners, ...runnersUp, ...bestThirds];
    const newB = generateInitialBracket();
    for (let i = 0; i < 16; i++) {
      if (qualified[i]) newB[i].teamH = qualified[i];
      if (qualified[31 - i]) newB[i].teamA = qualified[31 - i];
    }
    setBracket(newB);
    setView("bracket");
  };

  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0);
  const card = dark ? 'bg-[#1e293b] border-blue-900/60' : 'bg-white border-blue-100';
  const textFaint = dark ? 'text-slate-500' : 'text-slate-300';

  return (
    <main className={`min-h-screen font-sans transition-colors duration-300 ${dark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#fcfdfe] text-slate-900'}`}>
      <header className="relative bg-blue-950 text-white pt-4 pb-10 px-6 overflow-hidden shadow-2xl">
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          <button onClick={() => setDark(!dark)}
            className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-[9px] font-black uppercase tracking-widest">
            {dark ? <IconSun /> : <IconMoon />}
            {dark ? 'Claro' : 'Oscuro'}
          </button>
          <span className="bg-red-600 text-[8px] font-black px-3 py-1 rounded-full mb-3 tracking-[0.2em] shadow-xl uppercase">North America 2026</span>
          <h1 className="text-3xl font-black italic tracking-tighter mb-6 text-center leading-none">WORLD CUP <span className="text-red-500 underline decoration-white underline-offset-4">SIMULATOR</span></h1>
          <nav className="flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-1 w-full max-w-sm">
            {["groups", "thirds", "bracket"].map(v => (
              <button key={v} onClick={() => setView(v)} className={`flex-1 py-1.5 rounded-lg font-black text-[9px] uppercase transition-all tracking-widest ${view === v ? 'bg-white text-blue-950 shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}>
                {v === "groups" ? "Grupos" : v === "thirds" ? "3º" : "Final"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 -mt-6 mb-6 relative z-20">
        <div className={`p-3 rounded-2xl shadow-xl border flex justify-between items-center transition-colors duration-300 ${dark ? 'bg-[#1e293b]/95 border-slate-700' : 'bg-white/95 border-white'}`}>
          <div className={`px-3 py-2 rounded-xl flex items-center gap-3 ${dark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <span className="text-xl">⚽</span>
            <div>
              <p className="text-[7px] font-black text-blue-400 uppercase leading-none text-left">Total Goles</p>
              <p className={`text-lg font-black leading-none text-left ${dark ? 'text-blue-300' : 'text-blue-900'}`}>{totalGoals}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={resetAll}
              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${dark ? 'bg-red-900/30 text-red-400 border-red-800 hover:bg-red-600 hover:text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'}`}>
              Reiniciar
            </button>
            <button onClick={() => setMatches(matches.map(m => ({ ...m, scoreH: Math.floor(Math.random() * 4), scoreA: Math.floor(Math.random() * 4), played: true })))}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
              Simular
            </button>
            <button onClick={generateKnockout}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all">
              Generar Final
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {view === "groups" && (
            <motion.div key="groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-1 flex lg:flex-col gap-1.5 overflow-x-auto pb-2">
                {Object.keys(INITIAL_GROUPS).map(g => (
                  <button key={g} onClick={() => setActiveGroup(g)}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg font-black text-xs transition-all border-2 ${activeGroup === g
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : dark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-50'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="lg:col-span-7 space-y-1.5">
                {matches.filter(m => m.group === activeGroup).map(m => (
                  <MatchCard key={m.id} match={m} dark={dark} onScoreChange={handleGroupScoreChange} />
                ))}
              </div>
              <div className="lg:col-span-4 h-fit sticky top-4">
                <GroupTable groupId={activeGroup} matches={matches} dark={dark} />
              </div>
            </motion.div>
          )}

          {view === "thirds" && (
            <motion.div key="thirds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`max-w-md mx-auto p-8 rounded-3xl shadow-2xl border transition-colors duration-300 ${card}`}>
              <h2 className={`text-lg font-black mb-6 text-center uppercase tracking-tight italic ${dark ? 'text-blue-300' : 'text-blue-900'}`}>Mejores Terceros</h2>
              <div className="space-y-2">
                {Object.keys(INITIAL_GROUPS).map(g => getTable(g, matches)[2]).filter(t => t).sort((a, b) => b.pts - a.pts).map((t, i) => (
                  <div key={t.name}
                    className={`flex justify-between items-center p-3 rounded-xl border ${i < 8
                      ? dark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50/50 border-blue-100'
                      : `opacity-40 ${dark ? 'border-slate-700' : 'border-slate-50'}`}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-xs ${textFaint}`}>#{i + 1}</span>
                      <TeamLabel name={t.name} dark={dark} />
                    </div>
                    <span className={`font-black text-sm ${dark ? 'text-blue-400' : 'text-blue-700'}`}>{t.pts} PTS</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "bracket" && (
            <motion.div key="bracket" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6 overflow-x-auto pb-10 no-scrollbar px-2">
              {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map(round => (
                <div key={round} className="w-64 flex-shrink-0">
                  <h3 className={`text-center font-black text-[8px] mb-4 uppercase tracking-widest ${textFaint}`}>{round}</h3>
                  <div className="flex flex-col gap-3">
                    {bracket.filter(m => m.round === round).map(m => (
                      <BracketMatch key={m.id} match={m} dark={dark} onScoreChange={handleBracketScoreChange} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WorldCupNews dark={dark} />
    </main>
  );
}
