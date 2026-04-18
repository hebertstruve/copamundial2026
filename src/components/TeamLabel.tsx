'use client';
import { ALL_TEAMS } from '@/data/groups';

export function TeamLabel({ name, size = "w-5", dark = false }: { name: string; size?: string; dark?: boolean }) {
  const team = ALL_TEAMS.find(t => t.name === name);
  if (!team) return <span className={`font-bold italic text-[10px] uppercase ${dark ? 'text-slate-500' : 'text-slate-300'}`}>TBD</span>;
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img src={`https://flagcdn.com/w40/${team.code}.png`} alt={name}
        className={`${size} h-auto rounded shadow-sm flex-shrink-0 border ${dark ? 'border-slate-600' : 'border-slate-100'}`} />
      <span className="font-black truncate text-[11px] uppercase tracking-tight" style={{ color: team.color }}>{name}</span>
    </div>
  );
}
