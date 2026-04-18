'use client';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/lib/utils';
import { TeamLabel } from './TeamLabel';

interface BracketMatchProps {
  match: any;
  dark: boolean;
  onScoreChange: (id: string, side: string, val: string) => void;
}

export function BracketMatch({ match: m, dark, onScoreChange }: BracketMatchProps) {
  const isDraw = m.played && m.scoreH === m.scoreA && m.teamH !== "TBD" && m.teamA !== "TBD";
  const isFinal = m.id === "FINAL-1";
  const textFaint = dark ? 'text-slate-500' : 'text-slate-300';

  return (
    <motion.div layout
      className={`p-4 rounded-2xl shadow-md border transition-colors duration-300 ${isFinal
        ? dark ? 'border-amber-600 bg-amber-900/10' : 'border-amber-400 bg-amber-50/10'
        : dark ? 'border-slate-700 bg-[#1e293b] hover:border-blue-700' : 'border-white bg-white hover:border-blue-100'}`}>
      <div className="flex justify-between items-center mb-3">
        <TeamLabel name={m.teamH} dark={dark} />
        <div className="flex gap-2 items-center">
          {isDraw && (
            <div className="flex flex-col items-center">
              <span className="text-[6px] font-bold text-amber-500 uppercase">Pen</span>
              <input type="number" value={m.penH} onChange={e => onScoreChange(m.id, 'penH', e.target.value)}
                className={`w-8 h-8 text-[10px] text-center rounded-lg border font-bold focus:ring-1 focus:ring-amber-400 outline-none ${dark ? 'bg-amber-900/30 border-amber-700 text-amber-300' : 'bg-amber-50 border-amber-200'}`} />
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className={`text-[6px] font-bold uppercase ${textFaint}`}>Gol</span>
            <input type="number" value={m.scoreH} onChange={e => onScoreChange(m.id, 'scoreH', e.target.value)}
              className={`w-9 h-9 text-center rounded-lg font-black border text-sm outline-none ${getScoreColor(m.scoreH, m.scoreA, m.played, dark)}`} />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <TeamLabel name={m.teamA} dark={dark} />
        <div className="flex gap-2 items-center">
          {isDraw && (
            <div className="flex flex-col items-center">
              <input type="number" value={m.penA} onChange={e => onScoreChange(m.id, 'penA', e.target.value)}
                className={`w-8 h-8 text-[10px] text-center rounded-lg border font-bold focus:ring-1 focus:ring-amber-400 outline-none ${dark ? 'bg-amber-900/30 border-amber-700 text-amber-300' : 'bg-amber-50 border-amber-200'}`} />
            </div>
          )}
          <input type="number" value={m.scoreA} onChange={e => onScoreChange(m.id, 'scoreA', e.target.value)}
            className={`w-9 h-9 text-center rounded-lg font-black border text-sm outline-none ${getScoreColor(m.scoreA, m.scoreH, m.played, dark)}`} />
        </div>
      </div>
    </motion.div>
  );
}
