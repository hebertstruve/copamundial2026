'use client';
import { motion } from 'framer-motion';

export function WorldCupNews({ dark }: { dark: boolean }) {
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
            <div className="w-24 h-24 overflow-hidden flex-shrink-0">
              <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex flex-col justify-center">
              <span className="text-red-500 text-[8px] font-black uppercase tracking-widest">{n.tag}</span>
              <h3 className={`text-xs font-black leading-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{n.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
