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

const GROUP_SCHEDULE: Record<string, Array<{ venue: string; date: string; time: string }>> = {
  A: [{ venue: "Estadio Azteca", date: "11 Jun", time: "19:00 CT" }, { venue: "SoFi Stadium", date: "12 Jun", time: "15:00 PT" }, { venue: "Estadio Akron", date: "18 Jun", time: "19:00 CT" }, { venue: "Hard Rock Stadium", date: "19 Jun", time: "15:00 ET" }, { venue: "Estadio BBVA", date: "26 Jun", time: "19:00 CT" }, { venue: "MetLife Stadium", date: "26 Jun", time: "19:00 ET" }],
  B: [{ venue: "MetLife Stadium", date: "13 Jun", time: "21:00 ET" }, { venue: "AT&T Stadium", date: "14 Jun", time: "18:00 CT" }, { venue: "SoFi Stadium", date: "20 Jun", time: "18:00 PT" }, { venue: "Levi's Stadium", date: "20 Jun", time: "21:00 PT" }, { venue: "Lumen Field", date: "27 Jun", time: "16:00 PT" }, { venue: "Gillette Stadium", date: "27 Jun", time: "16:00 ET" }],
  C: [{ venue: "SoFi Stadium", date: "13 Jun", time: "20:00 PT" }, { venue: "Levi's Stadium", date: "14 Jun", time: "14:00 PT" }, { venue: "MetLife Stadium", date: "20 Jun", time: "21:00 ET" }, { venue: "NRG Stadium", date: "21 Jun", time: "18:00 CT" }, { venue: "Arrowhead Stadium", date: "27 Jun", time: "16:00 CT" }, { venue: "Empower Field", date: "27 Jun", time: "16:00 MT" }],
  D: [{ venue: "AT&T Stadium", date: "12 Jun", time: "21:00 CT" }, { venue: "Lumen Field", date: "12 Jun", time: "15:00 PT" }, { venue: "Hard Rock Stadium", date: "19 Jun", time: "21:00 ET" }, { venue: "Gillette Stadium", date: "19 Jun", time: "15:00 ET" }, { venue: "Lincoln Financial", date: "26 Jun", time: "16:00 ET" }, { venue: "SoFi Stadium", date: "26 Jun", time: "16:00 PT" }],
  E: [{ venue: "NRG Stadium", date: "14 Jun", time: "18:00 CT" }, { venue: "Arrowhead Stadium", date: "14 Jun", time: "15:00 CT" }, { venue: "BC Place", date: "21 Jun", time: "18:00 PT" }, { venue: "BMO Field", date: "21 Jun", time: "15:00 ET" }, { venue: "Soldier Field", date: "28 Jun", time: "17:00 CT" }, { venue: "NRG Stadium", date: "28 Jun", time: "20:00 CT" }],
  F: [{ venue: "Empower Field", date: "15 Jun", time: "17:00 MT" }, { venue: "Soldier Field", date: "15 Jun", time: "14:00 CT" }, { venue: "Lumen Field", date: "22 Jun", time: "18:00 PT" }, { venue: "AT&T Stadium", date: "22 Jun", time: "21:00 CT" }, { venue: "MetLife Stadium", date: "29 Jun", time: "16:00 ET" }, { venue: "SoFi Stadium", date: "29 Jun", time: "16:00 PT" }],
  G: [{ venue: "MetLife Stadium", date: "15 Jun", time: "19:00 ET" }, { venue: "NRG Stadium", date: "16 Jun", time: "15:00 CT" }, { venue: "Soldier Field", date: "22 Jun", time: "17:00 CT" }, { venue: "AT&T Stadium", date: "23 Jun", time: "20:00 CT" }, { venue: "Hard Rock Stadium", date: "29 Jun", time: "18:00 ET" }, { venue: "Levi's Stadium", date: "29 Jun", time: "18:00 PT" }],
  H: [{ venue: "Gillette Stadium", date: "13 Jun", time: "18:00 ET" }, { venue: "Lincoln Financial", date: "14 Jun", time: "14:00 ET" }, { venue: "Empower Field", date: "20 Jun", time: "14:00 MT" }, { venue: "BC Place", date: "21 Jun", time: "14:00 PT" }, { venue: "BC Place", date: "28 Jun", time: "15:00 PT" }, { venue: "BMO Field", date: "28 Jun", time: "15:00 ET" }],
  I: [{ venue: "Arrowhead Stadium", date: "16 Jun", time: "16:00 CT" }, { venue: "NRG Stadium", date: "16 Jun", time: "19:00 CT" }, { venue: "AT&T Stadium", date: "23 Jun", time: "17:00 CT" }, { venue: "Empower Field", date: "23 Jun", time: "14:00 MT" }, { venue: "Levi's Stadium", date: "30 Jun", time: "14:00 PT" }, { venue: "SoFi Stadium", date: "30 Jun", time: "14:00 PT" }],
  J: [{ venue: "Lumen Field", date: "16 Jun", time: "14:00 PT" }, { venue: "BC Place", date: "17 Jun", time: "15:00 PT" }, { venue: "Arrowhead Stadium", date: "23 Jun", time: "19:00 CT" }, { venue: "Gillette Stadium", date: "24 Jun", time: "14:00 ET" }, { venue: "BMO Field", date: "30 Jun", time: "17:00 ET" }, { venue: "Lumen Field", date: "30 Jun", time: "17:00 PT" }],
  K: [{ venue: "Estadio BBVA", date: "17 Jun", time: "18:00 CT" }, { venue: "Estadio Azteca", date: "17 Jun", time: "21:00 CT" }, { venue: "NRG Stadium", date: "24 Jun", time: "16:00 CT" }, { venue: "Soldier Field", date: "24 Jun", time: "19:00 CT" }, { venue: "Estadio BBVA", date: "30 Jun", time: "18:00 CT" }, { venue: "Estadio Azteca", date: "30 Jun", time: "18:00 CT" }],
  L: [{ venue: "BMO Field", date: "17 Jun", time: "18:00 ET" }, { venue: "BC Place", date: "18 Jun", time: "14:00 PT" }, { venue: "Lincoln Financial", date: "24 Jun", time: "17:00 ET" }, { venue: "Arrowhead Stadium", date: "25 Jun", time: "19:00 CT" }, { venue: "Levi's Stadium", date: "01 Jul", time: "14:00 PT" }, { venue: "Empower Field", date: "01 Jul", time: "14:00 MT" }],
};

const VENUE_IMAGES: Record<string, string> = {
  "Estadio Azteca": "/stadiums/azteca.jpg", "Estadio Akron": "/stadiums/akron.jpg", "Estadio BBVA": "/stadiums/bbva.jpg",
  "SoFi Stadium": "/stadiums/sofi.jpg", "MetLife Stadium": "/stadiums/metlife.jpg", "AT&T Stadium": "/stadiums/att.jpg",
  "Hard Rock Stadium": "/stadiums/hardrock.jpg", "Levi's Stadium": "/stadiums/levis.jpg", "NRG Stadium": "/stadiums/nrg.jpg",
  "Arrowhead Stadium": "/stadiums/arrowhead.jpg", "Lumen Field": "/stadiums/lumenfield.jpg", "Empower Field": "/stadiums/empower.jpg",
  "Soldier Field": "/stadiums/soldier.jpg", "Gillette Stadium": "/stadiums/gillette.jpg", "Lincoln Financial": "/stadiums/lincoln.jpg",
  "BC Place": "/stadiums/bcplace.jpg", "BMO Field": "/stadiums/bmo.jpg",
};

const VENUE_LOCATION: Record<string, { country: string; city: string }> = {
  "Estadio Azteca": { country: "México", city: "Ciudad de México" }, "Estadio Akron": { country: "México", city: "Guadalajara" },
  "Estadio BBVA": { country: "México", city: "Monterrey" }, "SoFi Stadium": { country: "USA", city: "Inglewood, CA" },
  "MetLife Stadium": { country: "USA", city: "East Rutherford, NJ" }, "AT&T Stadium": { country: "USA", city: "Arlington, TX" },
  "Hard Rock Stadium": { country: "USA", city: "Miami Gardens, FL" }, "Levi's Stadium": { country: "USA", city: "Santa Clara, CA" },
  "NRG Stadium": { country: "USA", city: "Houston, TX" }, "Arrowhead Stadium": { country: "USA", city: "Kansas City, MO" },
  "Lumen Field": { country: "USA", city: "Seattle, WA" }, "Empower Field": { country: "USA", city: "Denver, CO" },
  "Soldier Field": { country: "USA", city: "Chicago, IL" }, "Gillette Stadium": { country: "USA", city: "Foxborough, MA" },
  "Lincoln Financial": { country: "USA", city: "Filadelfia, PA" }, "BC Place": { country: "Canadá", city: "Vancouver" },
  "BMO Field": { country: "Canadá", city: "Toronto" },
};

const WorldCupNews = ({ dark }: { dark: boolean }) => {
  const news = [
    { id: 1, title: "Sedes listas", summary: "FIFA anunció fechas para el 2026.", image: "https://digitalhub.fifa.com/transform/54504193-41c0-4318-86d1-4328f415951d/World-Cup-2026-Generic-Image", link: "https://www.fifa.com", tag: "OFICIAL" },
    { id: 2, title: "Formato 48 selecciones", summary: "Nueva ronda de 32avos.", image: "https://digitalhub.fifa.com/transform/7ec731b7-789a-41f2-9594-540c49cc8c3c/1498187816", link: "https://www.fifa.com", tag: "FORMATO" }
  ];
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 mt-10 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className={`text-xl font-black italic uppercase tracking-tighter ${dark ? 'text-slate-100' : 'text-slate-900'}`}>Noticias</h2>
        <div className={`h-1 flex-grow rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((n) => (
          <motion.a whileHover={{ scale: 1.02 }} key={n.id} href={n.link} target="_blank"
            className={`rounded-2xl overflow-hidden shadow-md flex transition-all border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="w-24 h-24 overflow-hidden flex-shrink-0"><img src={n.image} alt={n.title} className="w-full h-full object-cover" /></div>
            <div className="p-3 flex flex-col justify-center">
              <span className="text-red-500 text-[8px] font-black uppercase tracking-widest">{n.tag}</span>
              <h3 className={`text-xs font-black leading-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{n.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

const TeamLabel = ({ name, size = "w-5", dark = false }: { name: string; size?: string; dark?: boolean }) => {
  const allTeams = Object.values(INITIAL_GROUPS).flat() as any[];
  const team = allTeams.find(t => t.name === name);
  if (!team) return <span className={`font-bold italic text-[10px] uppercase ${dark ? 'text-slate-500' : 'text-slate-300'}`}>TBD</span>;
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img src={`https://flagcdn.com/w40/${team.code}.png`} alt={name} className={`${size} h-auto rounded shadow-sm flex-shrink-0 border ${dark ? 'border-slate-600' : 'border-slate-100'}`} />
      <span className="font-black truncate text-[11px] uppercase tracking-tight" style={{ color: team.color }}>{name}</span>
    </div>
  );
};

const IconSun = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const IconMoon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);

export default function WorldCupApp() {
  const [view, setView] = useState("groups");
  const [activeGroup, setActiveGroup] = useState("A");
  const [matches, setMatches] = useState<any[]>([]);
  const [bracket, setBracket] = useState<any[]>([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.getItem('wc26-dark');
    if (savedDark !== null) setDark(JSON.parse(savedDark));
    const m = localStorage.getItem('wc26-v13-m');
    const b = localStorage.getItem('wc26-v13-b');
    setMatches(m ? JSON.parse(m) : generateInitialMatches());
    setBracket(b ? JSON.parse(b) : generateInitialBracket());
  }, []);
  useEffect(() => { if (matches.length > 0) localStorage.setItem('wc26-v13-m', JSON.stringify(matches)); if (bracket.length > 0) localStorage.setItem('wc26-v13-b', JSON.stringify(bracket)); }, [matches, bracket]);
  useEffect(() => { localStorage.setItem('wc26-dark', JSON.stringify(dark)); }, [dark]);

  const getScoreColor = (scoreThis: number, scoreThat: number, played: boolean) => {
    if (!played) return dark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-slate-50 border-slate-100 text-slate-900';
    if (scoreThis > scoreThat) return dark ? 'bg-green-900/50 border-green-700 text-green-400 font-black' : 'bg-green-100 border-green-200 text-green-700 font-black';
    if (scoreThis < scoreThat) return dark ? 'bg-red-900/50 border-red-700 text-red-400' : 'bg-red-50 border-red-100 text-red-600';
    return dark ? 'bg-amber-900/50 border-amber-700 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700';
  };
  const resetAll = () => { if (!confirm("¿Seguro que quieres borrar todos los resultados?")) return; setMatches(generateInitialMatches()); setBracket(generateInitialBracket()); localStorage.removeItem('wc26-v13-m'); localStorage.removeItem('wc26-v13-b'); };
  const getTable = (groupId: string) => {
    const groupTeams = INITIAL_GROUPS[groupId]; if (!groupTeams) return [];
    const teams = groupTeams.map((t: any) => ({ name: t.name, pj: 0, gf: 0, gc: 0, pts: 0 }));
    matches.filter(m => m.group === groupId && m.played).forEach(m => { const h = teams.find((t: any) => t.name === m.home); const a = teams.find((t: any) => t.name === m.away); if (h && a) { h.pj++; a.pj++; h.gf += m.scoreH; h.gc += m.scoreA; a.gf += m.scoreA; a.gc += m.scoreH; if (m.scoreH > m.scoreA) h.pts += 3; else if (m.scoreA > m.scoreH) a.pts += 3; else { h.pts += 1; a.pts += 1; } } });
    return teams.sort((a: any, b: any) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));
  };
  const handleScoreChange = (id: string, side: string, val: string, isBracket: boolean) => {
    const v = Math.max(0, parseInt(val) || 0);
    if (!isBracket) { setMatches(prev => prev.map(m => m.id === id ? { ...m, [side]: v, played: true } : m)); }
    else { setBracket(prev => { const newB = [...prev]; const idx = newB.findIndex(m => m.id === id); if (idx === -1) return prev; const m = { ...newB[idx], [side]: v, played: true }; if ((side === 'scoreH' || side === 'scoreA') && m.scoreH !== m.scoreA) { m.penH = 0; m.penA = 0; } let winner = null; if (m.scoreH > m.scoreA) winner = m.teamH; else if (m.scoreA > m.scoreH) winner = m.teamA; else if (m.penH > m.penA) winner = m.teamH; else if (m.penA > m.penH) winner = m.teamA; m.winner = winner; newB[idx] = m; if (m.winner && m.next) { const nIdx = newB.findIndex(nb => nb.id === m.next); if (nIdx !== -1) { const matchNum = Number(id.split('-')[1]); if (matchNum % 2 !== 0) newB[nIdx].teamH = m.winner; else newB[nIdx].teamA = m.winner; } } if (id === "FINAL-1" && m.winner) confetti({ particleCount: 150, spread: 70 }); return newB; }); }
  };
  const generateKnockout = () => {
    const winners: any[] = []; const runnersUp: any[] = []; const thirds: any[] = [];
    Object.keys(INITIAL_GROUPS).forEach(g => { const table = getTable(g); if (table.length >= 3) { winners.push(table[0].name); runnersUp.push(table[1].name); thirds.push({ name: table[2].name, pts: table[2].pts, gd: table[2].gf - table[2].gc }); } });
    const bestThirds = thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd).slice(0, 8).map(t => t.name);
    const qualified = [...winners, ...runnersUp, ...bestThirds]; const newB = generateInitialBracket();
    for (let i = 0; i < 16; i++) { if (qualified[i]) newB[i].teamH = qualified[i]; if (qualified[31 - i]) newB[i].teamA = qualified[31 - i]; }
    setBracket(newB); setView("bracket");
  };
  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0);
  const card = dark ? 'bg-[#1e293b] border-blue-900/60' : 'bg-white border-blue-100';
  const textPrimary = dark ? 'text-slate-100' : 'text-slate-900';
  const textMuted = dark ? 'text-slate-400' : 'text-slate-400';
  const textFaint = dark ? 'text-slate-500' : 'text-slate-300';
  const divider = dark ? 'border-slate-700' : 'border-slate-100';
  const imgBg = dark ? 'bg-slate-800' : 'bg-slate-100';

  return (
    <main className={`min-h-screen font-sans transition-colors duration-300 ${dark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#fcfdfe] text-slate-900'}`}>
      <header className="relative bg-blue-950 text-white pt-4 pb-10 px-6 overflow-hidden shadow-2xl">
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          <button onClick={() => setDark(!dark)} className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-[9px] font-black uppercase tracking-widest">{dark ? <IconSun /> : <IconMoon />}{dark ? 'Claro' : 'Oscuro'}</button>
          <span className="bg-red-600 text-[8px] font-black px-3 py-1 rounded-full mb-3 tracking-[0.2em] shadow-xl uppercase">North America 2026</span>
          <h1 className="text-3xl font-black italic tracking-tighter mb-6 text-center leading-none">WORLD CUP <span className="text-red-500 underline decoration-white underline-offset-4">SIMULATOR</span></h1>
          <nav className="flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-1 w-full max-w-sm">{["groups", "thirds", "bracket"].map(v => (<button key={v} onClick={() => setView(v)} className={`flex-1 py-1.5 rounded-lg font-black text-[9px] uppercase transition-all tracking-widest ${view === v ? 'bg-white text-blue-950 shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}>{v === "groups" ? "Grupos" : v === "thirds" ? "3º" : "Final"}</button>))}</nav>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 -mt-6 mb-6 relative z-20">
        <div className={`p-3 rounded-2xl shadow-xl border flex justify-between items-center transition-colors duration-300 ${dark ? 'bg-[#1e293b]/95 border-slate-700' : 'bg-white/95 border-white'}`}>
          <div className={`px-3 py-2 rounded-xl flex items-center gap-3 ${dark ? 'bg-blue-900/30' : 'bg-blue-50'}`}><span className="text-xl">⚽</span><div><p className="text-[7px] font-black text-blue-400 uppercase leading-none text-left">Total Goles</p><p className={`text-lg font-black leading-none text-left ${dark ? 'text-blue-300' : 'text-blue-900'}`}>{totalGoals}</p></div></div>
          <div className="flex gap-2 items-center">
            <button onClick={resetAll} className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${dark ? 'bg-red-900/30 text-red-400 border-red-800 hover:bg-red-600 hover:text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'}`}>Reiniciar</button>
            <button onClick={() => setMatches(matches.map(m => ({ ...m, scoreH: Math.floor(Math.random() * 4), scoreA: Math.floor(Math.random() * 4), played: true })))} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Simular</button>
            <button onClick={generateKnockout} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all">Generar Final</button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {view === "groups" && (
            <motion.div key="groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-1 flex lg:flex-col gap-1.5 overflow-x-auto pb-2">{Object.keys(INITIAL_GROUPS).map(g => (<button key={g} onClick={() => setActiveGroup(g)} className={`flex-shrink-0 w-8 h-8 rounded-lg font-black text-xs transition-all border-2 ${activeGroup === g ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : dark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-50'}`}>{g}</button>))}</div>
              <div className="lg:col-span-7 space-y-1.5">
                {matches.filter(m => m.group === activeGroup).map(m => (
                  <motion.div layout key={m.id} className={`rounded-xl border shadow-sm overflow-hidden transition-colors duration-300 ${card}`}>
                    {VENUE_IMAGES[m.venue] && (<div className={`w-full h-24 flex items-center justify-center overflow-hidden ${imgBg}`}><img src={VENUE_IMAGES[m.venue]} alt={m.venue} className="w-full h-full object-contain" /></div>)}
                    <div className="px-4 pt-3 pb-4">
                      <div className={`flex items-center justify-between mb-3 pb-2 border-b ${divider}`}>
                        <span className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{m.date}</span>
                        <div className="flex flex-col items-center mx-2 min-w-0"><span className={`text-[10px] font-black uppercase tracking-wide truncate ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{m.venue}</span>{VENUE_LOCATION[m.venue] && (<span className={`text-[9px] font-medium truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{VENUE_LOCATION[m.venue].country} · {VENUE_LOCATION[m.venue].city}</span>)}</div>
                        <span className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{m.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-1/3 text-right"><TeamLabel name={m.home} size="w-6" dark={dark} /></div>
                        <div className="flex gap-2 px-2"><input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, false)} className={`w-10 h-10 text-center rounded-lg font-black border transition-all text-base outline-none ${getScoreColor(m.scoreH, m.scoreA, m.played)}`} /><input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, false)} className={`w-10 h-10 text-center rounded-lg font-black border transition-all text-base outline-none ${getScoreColor(m.scoreA, m.scoreH, m.played)}`} /></div>
                        <div className="w-1/3"><TeamLabel name={m.away} size="w-6" dark={dark} /></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="lg:col-span-4 h-fit sticky top-4">
                <div className={`rounded-2xl shadow-lg p-5 border transition-colors duration-300 ${card}`}>
                  <h2 className="font-black mb-4 text-center text-[8px] uppercase text-blue-400 tracking-widest italic">Clasificación Grupo {activeGroup}</h2>
                  <div className="space-y-1.5">{getTable(activeGroup).map((t, i) => (<motion.div layout key={t.name} className={`flex justify-between items-center p-2 rounded-lg transition-all ${i < 2 ? dark ? 'bg-green-900/20' : 'bg-green-50/50' : i === 2 ? dark ? 'bg-amber-900/20' : 'bg-amber-50/50' : 'opacity-60'}`}><div className="flex items-center gap-2"><span className={`text-[8px] font-black w-3 ${textFaint}`}>#{i + 1}</span><TeamLabel name={t.name} size="w-4" dark={dark} /></div><span className={`font-black text-xs ${textPrimary}`}>{t.pts} <span className={`text-[8px] ${textMuted}`}>PTS</span></span></motion.div>))}</div>
                </div>
              </div>
            </motion.div>
          )}
          {view === "thirds" && (
            <motion.div key="thirds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-md mx-auto p-8 rounded-3xl shadow-2xl border transition-colors duration-300 ${card}`}>
              <h2 className={`text-lg font-black mb-6 text-center uppercase tracking-tight italic ${dark ? 'text-blue-300' : 'text-blue-900'}`}>Mejores Terceros</h2>
              <div className="space-y-2">{Object.keys(INITIAL_GROUPS).map(g => getTable(g)[2]).filter(t => t).sort((a, b) => b.pts - a.pts).map((t, i) => (<div key={t.name} className={`flex justify-between items-center p-3 rounded-xl border ${i < 8 ? dark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50/50 border-blue-100' : `opacity-40 ${dark ? 'border-slate-700' : 'border-slate-50'}`}`}><div className="flex items-center gap-2"><span className={`font-black text-xs ${textFaint}`}>#{i + 1}</span><TeamLabel name={t.name} dark={dark} /></div><span className={`font-black text-sm ${dark ? 'text-blue-400' : 'text-blue-700'}`}>{t.pts} PTS</span></div>))}</div>
            </motion.div>
          )}
          {view === "bracket" && (
            <motion.div key="bracket" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6 overflow-x-auto pb-10 no-scrollbar px-2">
              {["32avos", "Octavos", "Cuartos", "Semis", "FINAL"].map(round => (
                <div key={round} className="w-64 flex-shrink-0">
                  <h3 className={`text-center font-black text-[8px] mb-4 uppercase tracking-widest ${textFaint}`}>{round}</h3>
                  <div className="flex flex-col gap-3">{bracket.filter(m => m.round === round).map(m => { const isDraw = m.played && m.scoreH === m.scoreA && m.teamH !== "TBD" && m.teamA !== "TBD"; return (<motion.div layout key={m.id} className={`p-4 rounded-2xl shadow-md border transition-colors duration-300 ${round === 'FINAL' ? dark ? 'border-amber-600 bg-amber-900/10' : 'border-amber-400 bg-amber-50/10' : dark ? 'border-slate-700 bg-[#1e293b] hover:border-blue-700' : 'border-white bg-white hover:border-blue-100'}`}><div className="flex justify-between items-center mb-3"><TeamLabel name={m.teamH} dark={dark} /><div className="flex gap-2 items-center">{isDraw && (<div className="flex flex-col items-center"><span className="text-[6px] font-bold text-amber-500 uppercase">Pen</span><input type="number" value={m.penH} onChange={e => handleScoreChange(m.id, 'penH', e.target.value, true)} className={`w-8 h-8 text-[10px] text-center rounded-lg border font-bold focus:ring-1 focus:ring-amber-400 outline-none ${dark ? 'bg-amber-900/30 border-amber-700 text-amber-300' : 'bg-amber-50 border-amber-200'}`} /></div>)}<div className="flex flex-col items-center"><span className={`text-[6px] font-bold uppercase ${textFaint}`}>Gol</span><input type="number" value={m.scoreH} onChange={e => handleScoreChange(m.id, 'scoreH', e.target.value, true)} className={`w-9 h-9 text-center rounded-lg font-black border text-sm outline-none ${getScoreColor(m.scoreH, m.scoreA, m.played)}`} /></div></div></div><div className="flex justify-between items-center"><TeamLabel name={m.teamA} dark={dark} /><div className="flex gap-2 items-center">{isDraw && (<div className="flex flex-col items-center"><input type="number" value={m.penA} onChange={e => handleScoreChange(m.id, 'penA', e.target.value, true)} className={`w-8 h-8 text-[10px] text-center rounded-lg border font-bold focus:ring-1 focus:ring-amber-400 outline-none ${dark ? 'bg-amber-900/30 border-amber-700 text-amber-300' : 'bg-amber-50 border-amber-200'}`} /></div>)}<input type="number" value={m.scoreA} onChange={e => handleScoreChange(m.id, 'scoreA', e.target.value, true)} className={`w-9 h-9 text-center rounded-lg font-black border text-sm outline-none ${getScoreColor(m.scoreA, m.scoreH, m.played)}`} /></div></div></motion.div>); })}</div>
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

const generateInitialMatches = () => { const m: any[] = []; Object.keys(INITIAL_GROUPS).forEach(g => { const t = INITIAL_GROUPS[g]; const pairs = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]]; pairs.forEach((p, i) => { const sched = GROUP_SCHEDULE[g]?.[i] ?? { venue: "Por confirmar", date: "TBD", time: "TBD" }; m.push({ id: `${g}-${i}`, group: g, home: t[p[0]].name, away: t[p[1]].name, scoreH: 0, scoreA: 0, played: false, venue: sched.venue, date: sched.date, time: sched.time }); }); }); return m; };
const generateInitialBracket = () => { const rounds = [{ name: "32avos", count: 16, prefix: "R32" }, { name: "Octavos", count: 8, prefix: "R16" }, { name: "Cuartos", count: 4, prefix: "QF" }, { name: "Semis", count: 2, prefix: "SF" }, { name: "FINAL", count: 1, prefix: "FINAL" }]; const b: any[] = []; rounds.forEach((round, rIdx) => { for (let i = 1; i <= round.count; i++) { b.push({ id: `${round.prefix}-${i}`, round: round.name, teamH: "TBD", teamA: "TBD", scoreH: 0, scoreA: 0, penH: 0, penA: 0, winner: null, played: false, next: rounds[rIdx + 1] ? `${rounds[rIdx + 1].prefix}-${Math.ceil(i / 2)}` : null }); } }); return b; };
