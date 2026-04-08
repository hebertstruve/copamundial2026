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

// --- COMPONENTE DE NOTICIAS ---
const WorldCupNews = () => {
  const news = [
    {
      id: 1,
      title: "Calendario confirmado: CDMX, Toronto y LA listos para el 2026",
      summary: "La FIFA anunció fechas clave. México tendrá el partido inaugural en el Estadio Azteca.",
      image: "https://digitalhub.fifa.com/transform/54504193-41c0-4318-86d1-4328f415951d/World-Cup-2026-Generic-Image",
      link: "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026",
      tag: "OFICIAL"
    },
    {
      id: 2,
      title: "Formato de 48 selecciones: Todo lo que debes saber",
      summary: "Grupos de 4 equipos y una nueva ronda de 32avos de final. El mundial más grande de la historia.",
      image: "https://digitalhub.fifa.com/transform/7ec731b7-789a-41f2-9594-540c49cc8c3c/1498187816",
      link: "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/formato-copa-mundial-2026-es",
      tag: "FORMATO"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-16 mb-20">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">Noticias FIFA 2026</h2>
        <div className="h-1 flex-grow bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 w-24"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((n) => (
          <a key={n.id} href={n.link} target="_blank" rel="noopener noreferrer" 
             className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col md:flex-row">
            <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
              <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8 md:w-3/5">
              <span className="text-red-600 text-[10px] font-black px-3 py-1 rounded-full bg-red-50 mb-4 inline-block tracking-widest italic uppercase">
                {n.tag}
              </span>
              <h3 className="text-xl font-black leading-tight mb-3 group-hover:text-blue-900 transition-colors">{n.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{n.summary}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const TeamLabel = ({ name, size = "w-7" }: { name: string, size?: string }) => {
  const allTeams = Object.values(INITIAL_GROUPS).flat() as any[];
  const team = allTeams.find(t => t.name === name);
  if (!team) return <span className="font-bold text-slate-300 italic text-xs uppercase tracking-tighter">Por Definir</span>;
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <img src={`https://flagcdn.com/w40/${team.code}.png`} alt={name} className={`${size} h-auto rounded shadow-sm border border-slate-100 flex-shrink-0`} />
      <span className="font-black truncate text-sm uppercase tracking-tight" style={{ color: team.color }}>{name}</span>
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
    if (!confirm("¿Simular todos los resultados?")) return;
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
    <main className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header Estilo Qatar/2026 */}
      <header className="relative bg-blue-950 text-white pt-12 pb-20 px-6 overflow-hidden shadow-2xl">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-red-600 rounded-full blur-[120px] opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          <span className="bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full mb-6 tracking-[0.3em] shadow-xl shadow-red-900/40 uppercase">
            North America 2026
          </span>
          <h1 className="text-6xl font-black italic tracking-tighter mb-10 drop-shadow-2xl text-center leading-none">
            WORLD CUP <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white underline decoration-white underline-offset-8">SIMULATOR</span>
          </h1>
          
          <nav className="flex justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-1.5 w-full max-w-lg shadow-2xl">
            {["groups", "thirds", "bracket"].map(v => (
              <button 
                key={v} 
                onClick={() => setView(v)} 
                className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase transition-all duration-500 tracking-widest ${
                  view === v 
                  ? 'bg-white text-blue-950 shadow-2xl scale-105' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {v === "groups" ? "Grupos" : v === "thirds" ? "Ranking 3º" : "Fase Final"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Barra de Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 mb-12 relative z-20">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
              <span className="text-3xl">⚽</span>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Total Goles</p>
                <p className="text-2xl font-black text-blue-900 leading-none">{totalGoals}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-black text-green-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE SIMULATION
              </p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={simulateGroups} className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg">Simular Grupos</button>
            <button onClick={generateKnockout} className="flex-1 md:flex-none bg-red-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-200">Generar Fase Final</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {view === "groups" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Selector de Grupos */}
            <div className="lg:col-span-1 flex lg:flex-col gap-3 overflow-x-auto no-scrollbar pb-2">
              {Object.keys(INITIAL_GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)} className={`flex-shrink-0 w-12 h-12 rounded-2xl font-black transition-all duration-300 border-2 ${activeGroup === g ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-110' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`}>{g}</button>
              ))}
            </div>
            {/* Partidos */}
            <div className="lg:col-span-7 space-y-3">
              {matches.filter(m => m.group === activeGroup).map(m => (
                <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-1/3 text-right"><TeamLabel name={m.home} /></div>
                  <div className="flex gap-3 px-6">
                    <input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, false)} className="w-12 h-12 text-center rounded-2xl bg-slate-50 font-black border-2 border-slate-100 focus:border-blue-400 focus:outline-none transition-colors text-xl" />
                    <input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, false)} className="w-12 h-12 text-center rounded-2xl bg-slate-50 font-black border-2 border-slate-100 focus:border-blue-400 focus:outline-none transition-colors text-xl" />
                  </div>
                  <div className="w-1/3"><TeamLabel name={m.away} /></div>
                </div>
              ))}
            </div>
            {/* Tabla */}
            <div className="lg:col-span-4 h-fit sticky top-6">
              <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-50">
                <h2 className="font-black mb-8 text-center text-[10px] uppercase text-blue-400 tracking-[0.3em]">Clasificación Grupo {activeGroup}</h2>
                <div className="space-y-3">
                  {getTable(activeGroup).map((t, i) => (
                    <div key={t.name} className={`flex justify-between items-center p-4 rounded-2xl transition-all ${i < 2 ? 'bg-green-50/50' : i === 2 ? 'bg-amber-50/50' : 'opacity-60'}`}>
                      <div className="flex items-center gap-3"><span className="text-[10px] font-black text-slate-300 w-4">#{i+1}</span><TeamLabel name={t.name} size="w-6" /></div>
                      <span className="font-black text-slate-900">{t.pts} <span className="text-[9px] text-slate-400">PTS</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "thirds" && (
          <div className="max-w-xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
            <h2 className="text-2xl font-black mb-10 text-center italic uppercase text-blue-900 tracking-tighter">Ranking Mejores Terceros</h2>
            <div className="space-y-3">
              {Object.keys(INITIAL_GROUPS).map(g => getTable(g)[2]).filter(t => t).sort((a,b) => b.pts - a.pts).map((t, i) => (
                <div key={t.name} className={`flex justify-between items-center p-5 rounded-[1.5rem] transition-all border ${i < 8 ? 'bg-blue-50/50 border-blue-100' : 'opacity-40 grayscale border-slate-100'}`}>
                  <div className="flex items-center gap-4"><span className="font-black text-slate-300">#{i+1}</span><TeamLabel name={t.name} /></div>
                  <span className="font-black text-blue-700 text-lg">{t.pts} <span className="text-xs">PTS</span></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "bracket" && (
          <div className="flex gap-8 overflow-x-auto pb-16 no-scrollbar items-start px-4">
            {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map((round, rIdx) => (
              <div key={round} className="w-72 flex-shrink-0">
                <h3 className="text-center font-black text-slate-400 text-[10px] mb-8 uppercase tracking-[0.4em] border-b border-slate-100 pb-4 italic">{round}</h3>
                <div className="flex flex-col gap-6">
                  {bracket.filter(m => m.round === round).map(m => {
                    const isDraw = m.played && m.scoreH === m.scoreA && m.teamH !== "TBD" && m.teamA !== "TBD";
                    return (
                      <div key={m.id} className={`p-6 rounded-[2.5rem] shadow-xl border-2 transition-all ${round === 'FINAL' ? 'border-amber-400 bg-amber-50/20' : 'border-white bg-white'}`}>
                        <div className="flex justify-between items-center mb-4">
                          <TeamLabel name={m.teamH} />
                          <div className="flex gap-1.5 items-center">
                            {isDraw && <input type="number" placeholder="P" value={m.penH} onChange={e => handleScoreChange(m.id, 'penH', e.target.value, true)} className="w-8 h-8 bg-amber-100 text-[10px] text-center rounded-lg border border-amber-200 font-black" />}
                            <input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, true)} className="w-10 h-10 bg-slate-50 text-center rounded-xl font-black border-2 border-slate-100 focus:border-blue-400 focus:outline-none text-lg" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <TeamLabel name={m.teamA} />
                          <div className="flex gap-1.5 items-center">
                            {isDraw && <input type="number" placeholder="P" value={m.penA} onChange={e => handleScoreChange(m.id, 'penA', e.target.value, true)} className="w-8 h-8 bg-amber-100 text-[10px] text-center rounded-lg border border-amber-200 font-black" />}
                            <input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, true)} className="w-10 h-10 bg-slate-50 text-center rounded-xl font-black border-2 border-slate-100 focus:border-blue-400 focus:outline-none text-lg" />
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

      {/* SECCIÓN DE NOTICIAS FIFA */}
      <WorldCupNews />

      {/* Footer */}
      <footer className="py-20 text-center border-t border-slate-100 bg-white">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">Mundial 2026 Simulator • Hebert Struve</p>
        <div className="flex justify-center gap-6">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </footer>
    </main>
  );
}

// --- GENERADORES (Fuera del componente para evitar recreación) ---
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