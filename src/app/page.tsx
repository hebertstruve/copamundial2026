"use client";
import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';

// --- CONFIGURACIÓN DE EQUIPOS (MUNDIAL 48 EQUIPOS) ---
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

// --- GENERADORES INICIALES ---
const generateInitialMatches = () => {
  const m: any[] = [];
  Object.keys(INITIAL_GROUPS).forEach(g => {
    const t = INITIAL_GROUPS[g as keyof typeof INITIAL_GROUPS];
    const pairs = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
    pairs.forEach((p, i) => m.push({ id: `${g}-${i}`, group: g, home: t[p[0]].name, away: t[p[1]].name, scoreH: 0, scoreA: 0, played: false }));
  });
  return m;
};

const generateInitialBracket = () => {
  const rounds = [
    { name: "32avos", count: 16, prefix: "R32" },
    { name: "Octavos", count: 8, prefix: "R16" },
    { name: "Cuartos", count: 4, prefix: "QF" },
    { name: "Semis", count: 2, prefix: "SF" },
    { name: "FINAL", count: 1, prefix: "FINAL" }
  ];
  const b: any[] = [];
  rounds.forEach((round, rIdx) => {
    for (let i = 1; i <= round.count; i++) {
      b.push({ 
        id: `${round.prefix}-${i}`, 
        round: round.name, 
        teamH: "TBD", 
        teamA: "TBD", 
        scoreH: 0, 
        scoreA: 0, 
        penH: 0,        // <--- Nuevos campos para penales
        penA: 0,        // <--- Nuevos campos para penales
        winner: null, 
        played: false,  // <--- Nuevo campo para rastrear si se editó
        next: rounds[rIdx + 1] ? `${rounds[rIdx + 1].prefix}-${Math.ceil(i / 2)}` : null 
      });
    }
  });
  return b;
};

const TeamLabel = ({ name, size = "w-6" }: { name: string, size?: string }) => {
  const allTeams = Object.values(INITIAL_GROUPS).flat();
  const team = allTeams.find(t => t.name === name);
  if (!team) return <span className="font-bold text-slate-300 italic text-xs">TBD</span>;
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img src={`https://flagcdn.com/w40/${team.code}.png`} alt={name} className={`${size} h-auto rounded-sm border border-slate-100 flex-shrink-0`} />
      <span className="font-bold truncate text-sm" style={{ color: team.color }}>{name}</span>
    </div>
  );
};

export default function WorldCupApp() {
  const [view, setView] = useState("groups");
  const [activeGroup, setActiveGroup] = useState("A");
  const [matches, setMatches] = useState<any[]>([]);
  const [bracket, setBracket] = useState<any[]>([]);

  useEffect(() => {
    const m = localStorage.getItem('wc26-v9-m');
    const b = localStorage.getItem('wc26-v9-b');
    setMatches(m ? JSON.parse(m) : generateInitialMatches());
    setBracket(b ? JSON.parse(b) : generateInitialBracket());
  }, []);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('wc26-v9-m', JSON.stringify(matches));
    if (bracket.length > 0) localStorage.setItem('wc26-v9-b', JSON.stringify(bracket));
  }, [matches, bracket]);

  const getTable = (groupId: string) => {
    const teams = INITIAL_GROUPS[groupId as keyof typeof INITIAL_GROUPS].map(t => ({ 
      name: t.name, pj: 0, gf: 0, gc: 0, pts: 0 
    }));
    matches.filter(m => m.group === groupId && m.played).forEach(m => {
      const h = teams.find(t => t.name === m.home)!;
      const a = teams.find(t => t.name === m.away)!;
      h.pj++; a.pj++; h.gf += m.scoreH; h.gc += m.scoreA; a.gf += m.scoreA; a.gc += m.scoreH;
      if (m.scoreH > m.scoreA) h.pts += 3; else if (m.scoreA > m.scoreH) a.pts += 3; else { h.pts += 1; a.pts += 1; }
    });
    return teams.sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf);
  };

  const handleScoreChange = (id: string, side: string, val: string, isBracket: boolean) => {
    const v = Math.max(0, parseInt(val) || 0);

    if (!isBracket) {
      setMatches(prev => prev.map(m => m.id === id ? { ...m, [side]: v, played: true } : m));
    } else {
      setBracket(prev => {
        const newB = [...prev];
        const idx = newB.findIndex(m => m.id === id);
        const m = { ...newB[idx], [side]: v, played: true };
        
        // Reset penales si el marcador principal deja de ser empate
        if ((side === 'scoreH' || side === 'scoreA') && m.scoreH !== m.scoreA) {
          m.penH = 0;
          m.penA = 0;
        }

        // Lógica de Ganador
        let winner = null;
        if (m.scoreH > m.scoreA) winner = m.teamH;
        else if (m.scoreA > m.scoreH) winner = m.teamA;
        else if (m.penH > m.penA) winner = m.teamH;
        else if (m.penA > m.penH) winner = m.teamA;

        m.winner = winner;
        newB[idx] = m;

        // Propagar al siguiente partido
        if (m.winner && m.next) {
          const nIdx = newB.findIndex(nb => nb.id === m.next);
          const matchNum = parseInt(id.split('-')[1]);
          if (matchNum % 2 !== 0) newB[nIdx].teamH = m.winner; 
          else newB[nIdx].teamA = m.winner;
        }

        if (id === "FINAL-1" && m.winner) confetti({ particleCount: 150, spread: 70 });
        return newB;
      });
    }
  };

  const simulateGroups = () => {
    if (!confirm("¿Simular todos los resultados?")) return;
    setMatches(matches.map(m => ({
      ...m, scoreH: Math.floor(Math.random() * 4), scoreA: Math.floor(Math.random() * 4), played: true
    })));
  };

  const resetTournament = () => {
    if (!confirm("¿Reiniciar todo?")) return;
    setMatches(generateInitialMatches());
    setBracket(generateInitialBracket());
    setView("groups");
  };

  const generateKnockout = () => {
    const winners: string[] = [];
    const runnersUp: string[] = [];
    const thirds: any[] = [];
    Object.keys(INITIAL_GROUPS).forEach(g => {
      const table = getTable(g);
      winners.push(table[0].name); 
      runnersUp.push(table[1].name); 
      thirds.push({name: table[2].name, pts: table[2].pts, gd: table[2].gf - table[2].gc});
    });
    const bestThirds = thirds.sort((a,b) => b.pts - a.pts || b.gd - a.gd).slice(0, 8).map(t => t.name);
    const qualified = [...winners, ...runnersUp, ...bestThirds];
    
    const newB = generateInitialBracket();
    for (let i = 0; i < 16; i++) {
      newB[i].teamH = qualified[i];
      newB[i].teamA = qualified[31-i];
    }
    setBracket(newB);
    setView("bracket");
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans">
      <header className="bg-blue-900 text-white p-6 shadow-xl mb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black italic tracking-tighter">WC 2026 SIM PRO</h1>
          <nav className="flex bg-blue-800 rounded-full p-1 border border-blue-700">
            {["groups", "thirds", "bracket"].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-6 py-2 rounded-full font-bold text-xs uppercase transition-all ${view === v ? 'bg-white text-blue-900 shadow-md' : 'text-blue-200 hover:text-white'}`}>
                {v === "groups" ? "Grupos" : v === "thirds" ? "Mejores 3º" : "Fase Final"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button onClick={simulateGroups} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-indigo-700 transition active:scale-95">⚡ Simular Grupos</button>
            <button onClick={generateKnockout} className="bg-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-amber-600 transition active:scale-95">🏆 Generar 32avos</button>
          </div>
          <button onClick={resetTournament} className="text-rose-500 font-bold text-xs uppercase px-5 py-2 hover:bg-rose-50 rounded-2xl transition">Reiniciar</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {view === "groups" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
              {Object.keys(INITIAL_GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)} className={`flex-shrink-0 w-12 h-12 rounded-xl font-black transition-all ${activeGroup === g ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-white text-slate-400 border'}`}>{g}</button>
              ))}
            </div>

            <div className="lg:col-span-7 space-y-3">
              {matches.filter(m => m.group === activeGroup).map(m => (
                <div key={m.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center shadow-sm">
                  <div className="flex-1 flex justify-end px-2"><TeamLabel name={m.home} /></div>
                  <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-2xl">
                    <input type="number" min="0" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, false)} className="w-12 h-12 text-center bg-white rounded-xl font-black text-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" />
                    <span className="text-slate-300 font-bold text-xs uppercase">Vs</span>
                    <input type="number" min="0" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, false)} className="w-12 h-12 text-center bg-white rounded-xl font-black text-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" />
                  </div>
                  <div className="flex-1 flex justify-start px-2"><TeamLabel name={m.away} /></div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 h-fit">
              <h2 className="bg-slate-900 text-white p-4 font-black text-center text-[11px] uppercase tracking-widest italic">Tabla Grupo {activeGroup}</h2>
              <div className="p-4">
                <table className="w-full text-xs">
                  <thead><tr className="text-slate-400 font-black border-b text-left"><th className="pb-2">Equipo</th><th className="pb-2 text-center">DG</th><th className="pb-2 text-center text-blue-600">PTS</th></tr></thead>
                  <tbody>
                    {getTable(activeGroup).map((t, i) => (
                      <tr key={t.name} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 flex items-center gap-2"><span className={`w-1 h-4 rounded-full ${i < 2 ? 'bg-green-500' : i === 2 ? 'bg-amber-400' : 'bg-slate-200'}`}></span><TeamLabel name={t.name} size="w-5" /></td>
                        <td className="py-3 text-center font-bold text-slate-500">{t.gf - t.gc}</td>
                        <td className="py-3 text-center font-black text-blue-600">{t.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === "thirds" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-[3rem] shadow-xl border border-slate-200">
            <h2 className="text-2xl font-black mb-6 text-center italic uppercase tracking-tighter">Ranking de Terceros</h2>
            <div className="space-y-3">
              {Object.keys(INITIAL_GROUPS).map(g => getTable(g)[2]).sort((a,b) => b.pts - a.pts || b.gf-b.gc - (a.gf-a.gc)).map((t, i) => (
                <div key={t.name} className={`flex justify-between items-center p-4 rounded-2xl ${i < 8 ? 'bg-green-50 border border-green-100' : 'opacity-40 grayscale'}`}>
                  <div className="flex items-center gap-4"><span className="font-black text-slate-400 text-sm">#{i+1}</span><TeamLabel name={t.name} /></div>
                  <div className="font-black text-blue-600">{t.pts} PTS</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "bracket" && (
          <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar items-start">
            {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map(round => (
              <div key={round} className="flex-shrink-0 w-72">
                <h3 className="text-center font-black text-slate-400 text-[10px] mb-8 uppercase border-b pb-3 tracking-widest">{round}</h3>
                <div className="flex flex-col gap-6">
                  {bracket.filter(m => m.round === round).map(m => {
                    const isDraw = m.played && m.scoreH === m.scoreA && m.teamH !== "TBD" && m.teamA !== "TBD";
                    return (
                      <div key={m.id} className={`p-5 rounded-[2.5rem] shadow-xl border-2 transition-all bg-white ${m.round === 'FINAL' ? 'border-amber-400 ring-4 ring-amber-50' : 'border-white'}`}>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <TeamLabel name={m.teamH} />
                            <div className="flex items-center gap-1.5">
                              {isDraw && (
                                <input type="number" min="0" value={m.penH} placeholder="P" onChange={e => handleScoreChange(m.id, 'penH', e.target.value, true)} className="w-8 h-8 text-center rounded-lg bg-amber-100 text-amber-900 text-xs font-black border border-amber-200" />
                              )}
                              <input type="number" min="0" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, true)} className="w-10 h-10 text-center rounded-xl font-black text-base bg-slate-50 shadow-inner border-none" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <TeamLabel name={m.teamA} />
                            <div className="flex items-center gap-1.5">
                              {isDraw && (
                                <input type="number" min="0" value={m.penA} placeholder="P" onChange={e => handleScoreChange(m.id, 'penA', e.target.value, true)} className="w-8 h-8 text-center rounded-lg bg-amber-100 text-amber-900 text-xs font-black border border-amber-200" />
                              )}
                              <input type="number" min="0" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, true)} className="w-10 h-10 text-center rounded-xl font-black text-base bg-slate-50 shadow-inner border-none" />
                            </div>
                          </div>
                        </div>
                        {isDraw && (
                          <div className="mt-3 text-[9px] font-black text-amber-500 uppercase text-center italic animate-pulse tracking-tighter">
                            Ingresa resultado de penales
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}