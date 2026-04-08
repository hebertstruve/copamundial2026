"use client";
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

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

// --- GENERADORES ---
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
        teamH: "TBD", teamA: "TBD", 
        scoreH: 0, scoreA: 0, penH: 0, penA: 0, 
        winner: null, played: false, 
        next: rounds[rIdx + 1] ? `${rounds[rIdx + 1].prefix}-${Math.ceil(i / 2)}` : null 
      });
    }
  });
  return b;
};

const TeamLabel = ({ name, size = "w-6" }: { name: string, size?: string }) => {
  const allTeams = Object.values(INITIAL_GROUPS).flat() as any[];
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
    const m = localStorage.getItem('wc26-v12-m');
    const b = localStorage.getItem('wc26-v12-b');
    setMatches(m ? JSON.parse(m) : generateInitialMatches());
    setBracket(b ? JSON.parse(b) : generateInitialBracket());
  }, []);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('wc26-v12-m', JSON.stringify(matches));
    if (bracket.length > 0) localStorage.setItem('wc26-v12-b', JSON.stringify(bracket));
  }, [matches, bracket]);

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
        
        if ((side === 'scoreH' || side === 'scoreA') && m.scoreH !== m.scoreA) {
          m.penH = 0; m.penA = 0;
        }

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
            // CORRECCIÓN AQUÍ: Convertimos a Number antes del % 2
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
    if (!confirm("¿Simular resultados?")) return;
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
    <main className="min-h-screen bg-slate-100 pb-20 font-sans">
      <header className="bg-blue-900 text-white p-6 shadow-xl mb-6 text-center">
        <h1 className="text-3xl font-black italic tracking-tighter mb-4">WC 2026 SIMULATOR</h1>
        <nav className="flex justify-center bg-blue-800 rounded-full p-1 max-w-sm mx-auto">
          {["groups", "thirds", "bracket"].map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-full font-bold text-xs uppercase transition ${view === v ? 'bg-white text-blue-900 shadow-md' : 'text-blue-200'}`}>
              {v === "groups" ? "Grupos" : v === "thirds" ? "3º" : "Final"}
            </button>
          ))}
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm">
        <div className="font-black text-blue-800">⚽ {totalGoals} GOLES</div>
        <div className="flex gap-2">
          <button onClick={simulateGroups} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">Simular</button>
          <button onClick={generateKnockout} className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold uppercase">🏆 Generar 32avos</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {view === "groups" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2">
              {Object.keys(INITIAL_GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)} className={`flex-shrink-0 w-10 h-10 rounded-lg font-black transition ${activeGroup === g ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border'}`}>{g}</button>
              ))}
            </div>
            <div className="lg:col-span-7 space-y-2">
              {matches.filter(m => m.group === activeGroup).map(m => (
                <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="w-1/3 text-right"><TeamLabel name={m.home} /></div>
                  <div className="flex gap-2"><input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, false)} className="w-10 h-10 text-center rounded-lg bg-slate-50 font-bold" /><input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, false)} className="w-10 h-10 text-center rounded-lg bg-slate-50 font-bold" /></div>
                  <div className="w-1/3"><TeamLabel name={m.away} /></div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-md p-4 h-fit">
              <h2 className="font-black mb-4 text-center">Grupo {activeGroup}</h2>
              {getTable(activeGroup).map((t, i) => (
                <div key={t.name} className={`flex justify-between p-2 mb-1 rounded-lg ${i < 2 ? 'bg-green-50' : i === 2 ? 'bg-amber-50' : ''}`}><TeamLabel name={t.name} /> <span className="font-black">{t.pts} PTS</span></div>
              ))}
            </div>
          </div>
        )}

        {view === "thirds" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-black mb-4 text-center underline italic">Ranking de Terceros</h2>
            {Object.keys(INITIAL_GROUPS).map(g => getTable(g)[2]).filter(t => t).sort((a,b) => b.pts - a.pts).map((t, i) => (
              <div key={t.name} className={`flex justify-between p-3 mb-2 rounded-xl ${i < 8 ? 'bg-blue-50' : 'opacity-40 grayscale'}`}><TeamLabel name={t.name} /> <span className="font-bold text-blue-600">{t.pts} PTS</span></div>
            ))}
          </div>
        )}

        {view === "bracket" && (
          <div className="flex gap-4 overflow-x-auto pb-10 no-scrollbar">
            {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map(round => (
              <div key={round} className="w-64 flex-shrink-0">
                <h3 className="text-center font-black text-slate-400 text-xs mb-6 uppercase tracking-widest">{round}</h3>
                <div className="flex flex-col gap-4">
                  {bracket.filter(m => m.round === round).map(m => {
                    const isDraw = m.played && m.scoreH === m.scoreA && m.teamH !== "TBD" && m.teamA !== "TBD";
                    return (
                      <div key={m.id} className="p-4 bg-white rounded-2xl shadow-md border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <TeamLabel name={m.teamH} />
                          <div className="flex gap-1">
                            {isDraw && <input type="number" value={m.penH} onChange={e => handleScoreChange(m.id, 'penH', e.target.value, true)} className="w-7 h-7 bg-amber-50 text-xs text-center rounded border" />}
                            <input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, true)} className="w-8 h-8 bg-slate-50 text-center rounded font-bold" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <TeamLabel name={m.teamA} />
                          <div className="flex gap-1">
                            {isDraw && <input type="number" value={m.penA} onChange={e => handleScoreChange(m.id, 'penA', e.target.value, true)} className="w-7 h-7 bg-amber-50 text-xs text-center rounded border" />}
                            <input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, true)} className="w-8 h-8 bg-slate-50 text-center rounded font-bold" />
                          </div>
                        </div>
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