"use client";
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const INITIAL_GROUPS = {
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

// Generador de partidos iniciales
const generateInitialMatches = () => {
  const initialMatches: any[] = [];
  Object.keys(INITIAL_GROUPS).forEach(g => {
    const t = INITIAL_GROUPS[g as keyof typeof INITIAL_GROUPS];
    const pairings = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
    pairings.forEach((p, i) => {
      initialMatches.push({ id: `${g}-${i}`, group: g, home: t[p[0]].name, away: t[p[1]].name, scoreH: 0, scoreA: 0, played: false });
    });
  });
  return initialMatches;
};

// Estructura inicial de la fase final (32avos hasta la Final)
const generateInitialBracket = () => {
  const rounds = [
    { name: "32avos", count: 16, prefix: "R32" },
    { name: "Octavos", count: 8, prefix: "R16" },
    { name: "Cuartos", count: 4, prefix: "QF" },
    { name: "Semis", count: 2, prefix: "SF" },
    { name: "FINAL", count: 1, prefix: "FINAL" }
  ];

  const bracket: any[] = [];
  rounds.forEach((round, rIdx) => {
    for (let i = 1; i <= round.count; i++) {
      const nextRound = rounds[rIdx + 1];
      const nextMatchNum = Math.ceil(i / 2);
      bracket.push({
        id: `${round.prefix}-${i}`,
        round: round.name,
        teamH: "TBD",
        teamA: "TBD",
        scoreH: 0,
        scoreA: 0,
        winner: null,
        next: nextRound ? `${nextRound.prefix}-${nextMatchNum}` : null
      });
    }
  });
  return bracket;
};

const TeamLabel = ({ name, size = "w-6" }: { name: string, size?: string }) => {
  const allTeams = Object.values(INITIAL_GROUPS).flat();
  const team = allTeams.find(t => t.name === name);
  if (!team) return <span className="font-bold text-slate-400">{name}</span>;
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img src={`https://flagcdn.com/w40/${team.code}.png`} alt={name} className={`${size} h-auto rounded-sm shadow-sm border border-slate-100 flex-shrink-0`} />
      <span className="font-bold truncate" style={{ color: team.color }}>{name}</span>
    </div>
  );
};

export default function WorldCupApp() {
  const [view, setView] = useState("groups");
  const [activeGroup, setActiveGroup] = useState("A");
  const [matches, setMatches] = useState<any[]>([]);
  const [bracket, setBracket] = useState<any[]>([]);

  useEffect(() => {
    const savedMatches = localStorage.getItem('wc26-v6-matches');
    const savedBracket = localStorage.getItem('wc26-v6-bracket');
    setMatches(savedMatches ? JSON.parse(savedMatches) : generateInitialMatches());
    setBracket(savedBracket ? JSON.parse(savedBracket) : generateInitialBracket());
  }, []);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('wc26-v6-matches', JSON.stringify(matches));
    if (bracket.length > 0) localStorage.setItem('wc26-v6-bracket', JSON.stringify(bracket));
  }, [matches, bracket]);

  const resetTournament = () => {
    if (!confirm("¿Estás seguro de reiniciar todo el torneo? Se borrarán todos los resultados.")) return;
    localStorage.removeItem('wc26-v6-matches');
    localStorage.removeItem('wc26-v6-bracket');
    setMatches(generateInitialMatches());
    setBracket(generateInitialBracket());
    setView("groups");
  };

  const simulateTournament = () => {
    if (!confirm("¿Simular todos los resultados de la Fase de Grupos?")) return;
    setMatches(matches.map(m => ({ ...m, scoreH: Math.floor(Math.random() * 4), scoreA: Math.floor(Math.random() * 4), played: true })));
  };

  const getTable = (groupId: string, currentMatches = matches) => {
    const teams = INITIAL_GROUPS[groupId as keyof typeof INITIAL_GROUPS].map(t => ({ name: t.name, pts: 0, gf: 0, gc: 0, group: groupId }));
    currentMatches.filter(m => m.group === groupId && m.played).forEach(m => {
      const h = teams.find(t => t.name === m.home);
      const a = teams.find(t => t.name === m.away);
      if (h && a) {
        h.gf += m.scoreH; h.gc += m.scoreA;
        a.gf += m.scoreA; a.gc += m.scoreH;
        if (m.scoreH > m.scoreA) h.pts += 3;
        else if (m.scoreH < m.scoreA) a.pts += 3;
        else { h.pts += 1; a.pts += 1; }
      }
    });
    return teams.sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf);
  };

  const generateKnockout = () => {
    const allGroups = Object.keys(INITIAL_GROUPS);
    const qualified1st: string[] = [];
    const qualified2nd: string[] = [];
    const thirds: any[] = [];

    allGroups.forEach(g => {
      const table = getTable(g);
      qualified1st.push(table[0].name);
      qualified2nd.push(table[1].name);
      thirds.push(table[2]);
    });

    const bestThirds = thirds
      .sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc))
      .slice(0, 8)
      .map(t => t.name);

    const qualified32 = [...qualified1st, ...qualified2nd, ...bestThirds];
    
    // Mezclamos un poco para que no sea siempre A vs B
    const newBracket = generateInitialBracket();
    for (let i = 0; i < 16; i++) {
      newBracket[i].teamH = qualified32[i] || "TBD";
      newBracket[i].teamA = qualified32[31 - i] || "TBD";
    }

    setBracket(newBracket);
    setView("bracket");
    alert("¡Cruces de 32avos generados con éxito!");
  };

  const updateGroupScore = (id: string, side: string, val: string) => {
    setMatches(matches.map(m => m.id === id ? { ...m, [side]: parseInt(val) || 0, played: true } : m));
  };

  const updateBracketScore = (id: string, side: string, val: string) => {
    const v = parseInt(val) || 0;
    let newB = [...bracket];
    const matchIdx = newB.findIndex(m => m.id === id);
    const m = { ...newB[matchIdx], [side]: v };
    
    // Determinar ganador (en fase final no hay empates, si hay empate gana local por simplicidad o puedes agregar penales)
    if (m.scoreH > m.scoreA) m.winner = m.teamH;
    else if (m.scoreA > m.scoreH) m.winner = m.teamA;
    else m.winner = null;

    newB[matchIdx] = m;

    if (m.winner && m.next) {
      const nextMatchIdx = newB.findIndex(nb => nb.id === m.next);
      const isHome = id.split('-')[1] % 2 !== 0;
      if (isHome) newB[nextMatchIdx].teamH = m.winner;
      else newB[nextMatchIdx].teamA = m.winner;
    }

    if (id === "FINAL-1" && m.winner) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setBracket(newB);
  };

  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <header className="bg-indigo-900 text-white p-6 shadow-xl mb-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black italic tracking-tighter">MUNDIAL 2026 PRO</h1>
          <nav className="flex bg-indigo-800 rounded-full p-1">
            {["groups", "thirds", "bracket"].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-6 py-2 rounded-full font-bold text-xs uppercase transition ${view === v ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-300'}`}>
                {v === "groups" ? "Grupos" : v === "thirds" ? "Mejores 3º" : "Fase Final"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="bg-indigo-50 px-4 py-2 rounded-xl">
              <span className="text-indigo-800 font-black text-xl">⚽ {totalGoals}</span>
              <p className="text-[10px] uppercase font-bold text-indigo-400">Goles</p>
            </div>
            <button onClick={resetTournament} className="bg-rose-100 text-rose-600 px-4 py-2 rounded-xl font-bold text-xs uppercase hover:bg-rose-200 transition">
              Reset Torneo
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={simulateTournament} className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition">
              ⚡ Simular Grupos
            </button>
            <button onClick={generateKnockout} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition">
              🏆 Generar 32avos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {view === "groups" && (
          <>
            <div className="flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">
              {Object.keys(INITIAL_GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)} className={`flex-shrink-0 w-12 h-12 rounded-xl font-black border-2 transition-all ${activeGroup === g ? 'bg-indigo-600 border-indigo-600 text-white scale-110' : 'bg-white border-slate-200 text-slate-400'}`}>{g}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
                <h2 className="text-xl font-black mb-6 text-indigo-900 uppercase italic">Tabla Grupo {activeGroup}</h2>
                {getTable(activeGroup).map((t, i) => (
                  <div key={t.name} className={`flex justify-between items-center p-3 rounded-xl mb-2 ${i < 2 ? 'bg-green-50' : i === 2 ? 'bg-amber-50' : 'bg-slate-50'}`}>
                    <TeamLabel name={t.name} />
                    <div className="flex gap-3 font-bold text-sm">
                      <span className="w-8 text-center">{t.pts} <span className="text-[10px] text-slate-400 block">PTS</span></span>
                      <span className="w-8 text-center text-slate-500">{t.gf - t.gc} <span className="text-[10px] text-slate-400 block">DG</span></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2 space-y-3">
                {matches.filter(m => m.group === activeGroup).map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
                    <div className="flex-1 flex justify-end"><TeamLabel name={m.home} size="w-7" /></div>
                    <div className="flex gap-2 mx-6 items-center">
                      <input type="number" value={m.scoreH} onChange={e => updateGroupScore(m.id, 'scoreH', e.target.value)} className="w-12 h-12 text-center bg-slate-50 rounded-xl font-black text-xl border border-slate-200" />
                      <span className="text-slate-300 font-bold text-xs">VS</span>
                      <input type="number" value={m.scoreA} onChange={e => updateGroupScore(m.id, 'scoreA', e.target.value)} className="w-12 h-12 text-center bg-slate-50 rounded-xl font-black text-xl border border-slate-200" />
                    </div>
                    <div className="flex-1 flex justify-start"><TeamLabel name={m.away} size="w-7" /></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "thirds" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black mb-6 text-center italic">Ranking de Mejores Terceros</h2>
            <div className="space-y-2">
              {Object.keys(INITIAL_GROUPS).map(g => getTable(g)[2]).sort((a,b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc)).map((t, i) => (
                <div key={t.name} className={`flex justify-between items-center p-4 rounded-xl ${i < 8 ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 opacity-50 grayscale'}`}>
                   <div className="flex items-center gap-4">
                    <span className="font-black text-indigo-300">#{i+1}</span>
                    <TeamLabel name={t.name} />
                  </div>
                  <div className="text-right">
                    <span className="font-black text-indigo-600">{t.pts} PTS</span>
                    <span className="ml-4 text-xs font-bold text-slate-400">DG: {t.gf - t.gc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "bracket" && (
          <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar min-h-[600px]">
            {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map(round => (
              <div key={round} className="flex-shrink-0 w-64">
                <h3 className="text-center font-black text-indigo-900 bg-indigo-50 py-2 rounded-xl mb-6 uppercase text-xs tracking-widest border border-indigo-100">{round}</h3>
                <div className={`flex flex-col justify-around h-full gap-4`}>
                  {bracket.filter(m => m.round === round).map(m => (
                    <div key={m.id} className={`p-4 rounded-2xl shadow-md border-b-4 border-r-4 transition-all ${round === 'FINAL' ? 'bg-amber-400 border-amber-600' : 'bg-white border-slate-200'}`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <TeamLabel name={m.teamH} size="w-5" />
                          <input type="number" value={m.scoreH} onChange={e => updateBracketScore(m.id, 'scoreH', e.target.value)} className="w-8 h-8 text-center rounded-lg font-bold bg-slate-100 text-xs" />
                        </div>
                        <div className="flex justify-between items-center">
                          <TeamLabel name={m.teamA} size="w-5" />
                          <input type="number" value={m.scoreA} onChange={e => updateBracketScore(m.id, 'scoreA', e.target.value)} className="w-8 h-8 text-center rounded-lg font-bold bg-slate-100 text-xs" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}