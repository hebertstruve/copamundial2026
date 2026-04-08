"use client";
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURACIÓN DE EQUIPOS ---
const INITIAL_GROUPS: any = {
  A: [{ name: "México", code: "mx", color: "#006847" }, { name: "USA", code: "us", color: "#002868" }, { name: "Canadá", code: "ca", color: "#FF0000" }, { name: "Panamá", code: "pa", color: "#DA121A" }],
  B: [{ name: "Argentina", code: "ar", color: "#74ACDF" }, { name: "Francia", code: "fr", color: "#002395" }, { name: "España", code: "es", color: "#FABD00" }, { name: "Marruecos", code: "ma", color: "#C1272D" }],
  C: [{ name: "Brasil", code: "br", color: "#CBAD23" }, { name: "Inglaterra", code: "gb-eng", color: "#CE1124" }, { name: "Japón", code: "jp", color: "#00008B" }, { name: "Ecuador", code: "ec", color: "#FFCC00" }],
  D: [{ name: "Bélgica", code: "be", color: "#000000" }, { name: "Portugal", code: "pt", color: "#E42518" }, { name: "Corea del Sur", code: "kr", color: "#CD2E3A" }, { name: "Colombia", code: "co", color: "#FCD116" }],
  E: [{ name: "Uruguay", code: "uy", color: "#0081C6" }, { name: "Alemania", code: "de", color: "#000000" }, { name: "Senegal", code: "sn", color: "#00853F" }, { name: "Australia", code: "au", color: "#00008B" }],
  F: [{ name: "Países Bajos", code: "nl", color: "#21468B" }, { name: "Croacia", code: "hr", color: "#FF0000" }, { name: "Nigeria", code: "ng", color: "#008751" }, { name: "Chile", code: "cl", color: "#0039A6" }],
  G: [{ name: "Italia", code: "it", color: "#008C45" }, { name: "Suiza", code: "ch", color: "#DA291C" }, { name: "Argelia", code: "dz", color: "#006233" }, { name: "Perú", code: "pe", color: "#D91023" }],
  H: [{ name: "Dinamarca", code: "dk", color: "#C60C30" }, { name: "Austria", code: "at", color: "#EF3340" }, { name: "Egipto", code: "eg", color: "#C09300" }, { name: "Costa Rica", code: "cr", color: "#EF3340" }],
  I: [{ name: "Túnez", code: "tn", color: "#E70013" }, { name: "Arabia Saudita", code: "sa", color: "#006C35" }, { name: "Paraguay", code: "py", color: "#D52B1E" }, { name: "Mali", code: "ml", color: "#FCD116" }],
  J: [{ name: "Eslovenia", code: "si", color: "#005EB8" }, { name: "Irak", code: "iq", color: "#007A33" }, { name: "Escocia", code: "gb-sct", color: "#0065BF" }, { name: "Ghana", code: "gh", color: "#ED1C24" }],
  K: [{ name: "Sudáfrica", code: "za", color: "#007A4D" }, { name: "Honduras", code: "hn", color: "#0073CF" }, { name: "Catar", code: "qa", color: "#8A1538" }, { name: "Georgia", code: "ge", color: "#FF0000" }],
  L: [{ name: "Jamaica", code: "jm", color: "#FED100" }, { name: "Grecia", code: "gr", color: "#0D5EAF" }, { name: "N. Zelanda", code: "nz", color: "#000000" }, { name: "Camerún", code: "cm", color: "#007A5E" }]
};

// --- COMPONENTE DE NOTICIAS ---
const WorldCupNews = () => {
  const news = [
    { id: 1, title: "Calendario confirmado: Sedes listas", summary: "La FIFA anunció fechas clave para el Mundial 2026.", image: "https://digitalhub.fifa.com/transform/54504193-41c0-4318-86d1-4328f415951d/World-Cup-2026-Generic-Image", link: "https://www.fifa.com", tag: "OFICIAL" },
    { id: 2, title: "Formato de 48 selecciones", summary: "Grupos de 4 equipos y nueva ronda de 32avos.", image: "https://digitalhub.fifa.com/transform/7ec731b7-789a-41f2-9594-540c49cc8c3c/1498187816", link: "https://www.fifa.com", tag: "FORMATO" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 mt-10 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter">Noticias</h2>
        <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((n) => (
          <motion.a whileHover={{ scale: 1.02 }} key={n.id} href={n.link} target="_blank" rel="noopener noreferrer" 
             className="group bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex transition-all">
            <div className="w-24 h-24 overflow-hidden">
              <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex flex-col justify-center">
              <span className="text-red-600 text-[8px] font-black uppercase tracking-widest">{n.tag}</span>
              <h3 className="text-xs font-black leading-tight group-hover:text-blue-900">{n.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

// --- COMPONENTES AUXILIARES ---
const TeamLabel = ({ name, size = "w-5" }: { name: string, size?: string }) => {
  const allTeams = Object.values(INITIAL_GROUPS).flat() as any[];
  const team = allTeams.find(t => t.name === name);
  if (!team) return <span className="font-bold text-slate-300 italic text-[10px] uppercase">TBD</span>;
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img src={`https://flagcdn.com/w40/${team.code}.png`} alt={name} className={`${size} h-auto rounded shadow-sm border border-slate-100 flex-shrink-0`} />
      <span className="font-black truncate text-[11px] uppercase tracking-tight" style={{ color: team.color }}>{name}</span>
    </div>
  );
};

export default function WorldCupApp() {
  const [view, setView] = useState("groups");
  const [activeGroup, setActiveGroup] = useState("A");
  const [matches, setMatches] = useState<any[]>([]);
  const [bracket, setBracket] = useState<any[]>([]);

  useEffect(() => {
    const m = localStorage.getItem('wc26-v12-m');
    const b = localStorage.getItem('wc26-v12-b');
    setMatches(m ? JSON.parse(m) : generateInitialMatches());
    setBracket(b ? JSON.parse(b) : generateInitialBracket());
  }, []);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('wc26-v12-m', JSON.stringify(matches));
    if (bracket.length > 0) localStorage.setItem('wc26-v12-b', JSON.stringify(bracket));
  }, [matches, bracket]);

  // --- FUNCIÓN PARA COLOR INTERACTIVO DE MARCADOR ---
  const getScoreColor = (scoreThis: number, scoreThat: number, played: boolean) => {
    if (!played) return 'bg-slate-50 border-slate-100 text-slate-900';
    if (scoreThis > scoreThat) return 'bg-green-100 border-green-200 text-green-700';
    if (scoreThis < scoreThat) return 'bg-red-50 border-red-100 text-red-600';
    return 'bg-amber-50 border-amber-200 text-amber-700'; // Empate
  };

  const getTable = (groupId: string) => {
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
    return teams.sort((a: any, b: any) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf);
  };

  const handleScoreChange = (id: string, side: string, val: string, isBracket: boolean) => {
    const v = Math.max(0, parseInt(val) || 0);
    if (!isBracket) {
      setMatches(prev => prev.map(m => m.id === id ? { ...m, [side]: v, played: true } : m));
    } else {
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
    }
  };

  const simulateGroups = () => {
    if (!confirm("¿Simular?")) return;
    setMatches(matches.map(m => ({ ...m, scoreH: Math.floor(Math.random() * 4), scoreA: Math.floor(Math.random() * 4), played: true })));
  };

  const generateKnockout = () => {
    const winners: any[] = [];
    const runnersUp: any[] = [];
    const thirds: any[] = [];
    Object.keys(INITIAL_GROUPS).forEach(g => {
      const table = getTable(g);
      if (table.length >= 3) {
        winners.push(table[0].name); runnersUp.push(table[1].name); 
        thirds.push({name: table[2].name, pts: table[2].pts, gd: table[2].gf - table[2].gc});
      }
    });
    const bestThirds = thirds.sort((a,b) => b.pts - a.pts || b.gd - a.gd).slice(0, 8).map(t => t.name);
    const qualified = [...winners, ...runnersUp, ...bestThirds];
    const newB = generateInitialBracket();
    for (let i = 0; i < 16; i++) {
      if (qualified[i]) newB[i].teamH = qualified[i];
      if (qualified[31-i]) newB[i].teamA = qualified[31-i];
    }
    setBracket(newB);
    setView("bracket");
  };

  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0);

  return (
    <main className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans">
      <header className="relative bg-blue-950 text-white pt-4 pb-10 px-6 overflow-hidden shadow-2xl">
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          <span className="bg-red-600 text-[8px] font-black px-3 py-1 rounded-full mb-3 tracking-[0.2em] shadow-xl uppercase">North America 2026</span>
          <h1 className="text-3xl font-black italic tracking-tighter mb-6 text-center leading-none">WORLD CUP <span className="text-red-500 underline decoration-white underline-offset-4">SIMULATOR</span></h1>
          <nav className="flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-1 w-full max-w-sm">
            {["groups", "thirds", "bracket"].map(v => (
              <button key={v} onClick={() => setView(v)} className={`flex-1 py-1.5 rounded-lg font-black text-[9px] uppercase transition-all tracking-widest ${view === v ? 'bg-white text-blue-950 shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}>{v === "groups" ? "Grupos" : v === "thirds" ? "3º" : "Final"}</button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 -mt-6 mb-6 relative z-20">
        <div className="bg-white/95 p-3 rounded-2xl shadow-xl border border-white flex justify-between items-center">
          <div className="bg-blue-50 px-3 py-2 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚽</span>
            <div>
              <p className="text-[7px] font-black text-blue-400 uppercase leading-none">Total Goles</p>
              <p className="text-lg font-black text-blue-900 leading-none">{totalGoals}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={simulateGroups} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Simular</button>
            <button onClick={generateKnockout} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Generar Final</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ANIMACIÓN DE ENTRADA AL CAMBIAR VISTA */}
        <AnimatePresence mode="wait">
          {view === "groups" && (
            <motion.div key="groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-1 flex lg:flex-col gap-1.5 overflow-x-auto pb-2">
                {Object.keys(INITIAL_GROUPS).map(g => (
                  <button key={g} onClick={() => setActiveGroup(g)} className={`flex-shrink-0 w-8 h-8 rounded-lg font-black text-xs transition-all border-2 ${activeGroup === g ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-400 border-slate-50'}`}>{g}</button>
                ))}
              </div>
              <div className="lg:col-span-7 space-y-1.5">
                {matches.filter(m => m.group === activeGroup).map(m => (
                  <motion.div layout key={m.id} className="bg-white p-3 rounded-xl border border-slate-50 flex items-center justify-between shadow-sm">
                    <div className="w-1/3 text-right"><TeamLabel name={m.home} /></div>
                    <div className="flex gap-2 px-2">
                      <input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, false)} 
                        className={`w-8 h-8 text-center rounded-lg font-black border text-sm outline-none transition-all ${getScoreColor(m.scoreH, m.scoreA, m.played)}`} />
                      <input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, false)} 
                        className={`w-8 h-8 text-center rounded-lg font-black border text-sm outline-none transition-all ${getScoreColor(m.scoreA, m.scoreH, m.played)}`} />
                    </div>
                    <div className="w-1/3"><TeamLabel name={m.away} /></div>
                  </motion.div>
                ))}
              </div>
              <div className="lg:col-span-4 h-fit sticky top-4">
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-50">
                  <h2 className="font-black mb-4 text-center text-[8px] uppercase text-blue-400 tracking-widest italic">Grupo {activeGroup}</h2>
                  <div className="space-y-1.5">
                    {getTable(activeGroup).map((t, i) => (
                      <motion.div layout key={t.name} className={`flex justify-between items-center p-2 rounded-lg transition-all ${i < 2 ? 'bg-green-50/50' : i === 2 ? 'bg-amber-50/50' : 'opacity-60'}`}>
                        <div className="flex items-center gap-2"><span className="text-[8px] font-black text-slate-300 w-3">#{i+1}</span><TeamLabel name={t.name} size="w-4" /></div>
                        <span className="font-black text-slate-900 text-xs">{t.pts} <span className="text-[8px] text-slate-400">PTS</span></span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === "thirds" && (
            <motion.div key="thirds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-slate-50">
              <h2 className="text-lg font-black mb-6 text-center uppercase text-blue-900 tracking-tight">Mejores Terceros</h2>
              <div className="space-y-2">
                {Object.keys(INITIAL_GROUPS).map(g => getTable(g)[2]).filter(t => t).sort((a,b) => b.pts - a.pts).map((t, i) => (
                  <div key={t.name} className={`flex justify-between items-center p-3 rounded-xl border ${i < 8 ? 'bg-blue-50/50 border-blue-100' : 'opacity-40 border-slate-50'}`}>
                    <div className="flex items-center gap-2"><span className="font-black text-slate-300 text-xs">#{i+1}</span><TeamLabel name={t.name} /></div>
                    <span className="font-black text-blue-700 text-sm">{t.pts} PTS</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "bracket" && (
            <motion.div key="bracket" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 overflow-x-auto pb-10 no-scrollbar px-2">
              {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map(round => (
                <div key={round} className="w-56 flex-shrink-0">
                  <h3 className="text-center font-black text-slate-400 text-[8px] mb-4 uppercase tracking-widest">{round}</h3>
                  <div className="flex flex-col gap-3">
                    {bracket.filter(m => m.round === round).map(m => {
                      const isDraw = m.played && m.scoreH === m.scoreA && m.teamH !== "TBD" && m.teamA !== "TBD";
                      return (
                        <motion.div layout key={m.id} className={`p-3 rounded-2xl shadow-md border ${round === 'FINAL' ? 'border-amber-400 bg-amber-50/10' : 'border-white bg-white hover:border-blue-100 transition-colors'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <TeamLabel name={m.teamH} />
                            <div className="flex gap-1 items-center">
                              {isDraw && <input type="number" placeholder="P" value={m.penH} onChange={e => handleScoreChange(m.id, 'penH', e.target.value, true)} className="w-6 h-6 bg-amber-50 text-[8px] text-center rounded border border-amber-200" />}
                              <input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, true)} 
                                className={`w-7 h-7 text-center rounded-lg font-black border text-xs outline-none ${getScoreColor(m.scoreH, m.scoreA, m.played)}`} />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <TeamLabel name={m.teamA} />
                            <div className="flex gap-1 items-center">
                              {isDraw && <input type="number" placeholder="P" value={m.penA} onChange={e => handleScoreChange(m.id, 'penA', e.target.value, true)} className="w-6 h-6 bg-amber-50 text-[8px] text-center rounded border border-amber-200" />}
                              <input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, true)} 
                                className={`w-7 h-7 text-center rounded-lg font-black border text-xs outline-none ${getScoreColor(m.scoreA, m.scoreH, m.played)}`} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WorldCupNews />
    </main>
  );
}

const generateInitialMatches = () => {
  const m: any[] = [];
  Object.keys(INITIAL_GROUPS).forEach(g => {
    const t = INITIAL_GROUPS[g];
    const pairs = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
    pairs.forEach((p, i) => m.push({ id: `${g}-${i}`, group: g, home: t[p[0]].name, away: t[p[1]].name, scoreH: 0, scoreA: 0, played: false }));
  });
  return m;
};

const generateInitialBracket = () => {
  const rounds = [
    { name: "32avos", count: 16, prefix: "R32" }, { name: "Octavos", count: 8, prefix: "R16" }, { name: "Cuartos", count: 4, prefix: "QF" }, { name: "Semis", count: 2, prefix: "SF" }, { name: "FINAL", count: 1, prefix: "FINAL" }
  ];
  const b: any[] = [];
  rounds.forEach((round, rIdx) => {
    for (let i = 1; i <= round.count; i++) {
      b.push({ id: `${round.prefix}-${i}`, round: round.name, teamH: "TBD", teamA: "TBD", scoreH: 0, scoreA: 0, penH: 0, penA: 0, winner: null, played: false, next: rounds[rIdx + 1] ? `${rounds[rIdx + 1].prefix}-${Math.ceil(i / 2)}` : null });
    }
  });
  return b;
};