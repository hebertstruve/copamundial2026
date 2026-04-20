'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface TeamModalContextValue {
  open: (name: string) => void;
  close: () => void;
  isOpen: boolean;
  currentTeam: string | null;
}

const TeamModalCtx = createContext<TeamModalContextValue | null>(null);

export function TeamModalProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<string | null>(null);
  return (
    <TeamModalCtx.Provider
      value={{
        open: (n) => setTeam(n),
        close: () => setTeam(null),
        isOpen: team !== null,
        currentTeam: team,
      }}
    >
      {children}
    </TeamModalCtx.Provider>
  );
}

/** Tolerant hook — returns null if not within a provider so TeamLabel can be used standalone. */
export function useTeamModal(): TeamModalContextValue | null {
  return useContext(TeamModalCtx);
}
