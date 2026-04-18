'use client';
import { motion } from 'framer-motion';
import { VENUE_IMAGES, VENUE_LOCATION } from '@/data/schedule';
import { getScoreColor } from '@/lib/utils';
import { TeamLabel } from './TeamLabel';

interface MatchCardProps {
  match: any;
  dark: boolean;
  onScoreChange: (id: string, side: string, val: string) => void;
}

export function MatchCard({ match: m, dark, onScoreChange }: MatchCardProps) {
  const card = dark ? 'bg-[#1e293b] border-blue-900/60' : 'bg-white border-blue-100';
  const divider = dark ? 'border-slate-700' : 'border-slate-100';
  const imgBg = dark ? 'bg-slate-800' : 'bg-slate-100';

  return (
    <motion.div layout className={`rounded-xl border shadow-sm overflow-hidden transition-colors duration-300 ${card}`}>
      {VENUE_IMAGES[m.venue] && (
        <div className={`w-full h-24 flex items-center justify-center overflow-hidden ${imgBg}`}>
          <img src={VENUE_IMAGES[m.venue]} alt={m.venue} className="w-full h-full object-contain" />
        </div>
      )}
      <div className="px-4 pt-3 pb-4">
        <div className={`flex items-center justify-between mb-3 pb-2 border-b ${divider}`}>
          <span className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{m.date}</span>
          <div className="flex flex-col items-center mx-2 min-w-0">
            <span className={`text-[10px] font-black uppercase tracking-wide truncate ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{m.venue}</span>
            {VENUE_LOCATION[m.venue] && (
              <span className={`text-[9px] font-medium truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {VENUE_LOCATION[m.venue].country} · {VENUE_LOCATION[m.venue].city}
              </span>
            )}
          </div>
          <span className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{m.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-1/3 text-right"><TeamLabel name={m.home} size="w-6" dark={dark} /></div>
          <div className="flex gap-2 px-2">
            <input type="number" value={m.scoreH} onChange={e => onScoreChange(m.id, 'scoreH', e.target.value)}
              className={`w-10 h-10 text-center rounded-lg font-black border transition-all text-base outline-none ${getScoreColor(m.scoreH, m.scoreA, m.played, dark)}`} />
            <input type="number" value={m.scoreA} onChange={e => onScoreChange(m.id, 'scoreA', e.target.value)}
              className={`w-10 h-10 text-center rounded-lg font-black border transition-all text-base outline-none ${getScoreColor(m.scoreA, m.scoreH, m.played, dark)}`} />
          </div>
          <div className="w-1/3"><TeamLabel name={m.away} size="w-6" dark={dark} /></div>
        </div>
      </div>
    </motion.div>
  );
}
