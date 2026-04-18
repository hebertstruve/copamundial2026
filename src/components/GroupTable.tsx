'use client';
import { motion } from 'framer-motion';
import { getTable } from '@/lib/utils';
import { TeamLabel } from './TeamLabel';

interface GroupTableProps {
  groupId: string;
  matches: any[];
  dark: boolean;
}

export function GroupTable({ groupId, matches, dark }: GroupTableProps) {
  const card = dark ? 'bg-[#1e293b] border-blue-900/60' : 'bg-white border-blue-100';
  const textPrimary = dark ? 'text-slate-100' : 'text-slate-900';
  const textMuted = dark ? 'text-slate-400' : 'text-slate-400';
  const textFaint = dark ? 'text-slate-500' : 'text-slate-300';

  return (
    <div className={`rounded-2xl shadow-lg p-5 border transition-colors duration-300 ${card}`}>
      <h2 className="font-black mb-4 text-center text-[8px] uppercase text-blue-400 tracking-widest italic">Clasificación Grupo {groupId}</h2>
      <div className="space-y-1.5">
        {getTable(groupId, matches).map((t, i) => (
          <motion.div layout key={t.name}
            className={`flex justify-between items-center p-2 rounded-lg transition-all ${
              i < 2
                ? dark ? 'bg-green-900/20' : 'bg-green-50/50'
                : i === 2
                ? dark ? 'bg-amber-900/20' : 'bg-amber-50/50'
                : 'opacity-60'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-black w-3 ${textFaint}`}>#{i + 1}</span>
              <TeamLabel name={t.name} size="w-4" dark={dark} />
            </div>
            <span className={`font-black text-xs ${textPrimary}`}>{t.pts} <span className={`text-[8px] ${textMuted}`}>PTS</span></span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
