# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version

This project uses **Next.js 16.2.2** which has breaking changes from older versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.

## Commands

```bash
npm run dev      # Start dev server (defaults to :3000, falls back to :3001 if occupied)
npm run build    # Production build (TS and ESLint errors are suppressed via next.config.ts)
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

Single-page app with three views: **Grupos** (group stage), **3º** (best third-place teams), **Final** (knockout bracket).

### Data flow

```
src/data/           → static config (teams, schedules, venue images/locations)
src/lib/            → pure functions (generateInitialMatches, generateInitialBracket, getTable, getScoreColor)
src/hooks/          → useDarkMode (persists to localStorage)
src/components/     → UI components, each receives dark + data props
src/app/page.tsx    → orchestrator: holds all state, wires handlers to components
```

### State in `page.tsx`

- `matches` — group stage match objects, persisted to `localStorage['wc26-v13-m']`
- `bracket` — knockout bracket objects, persisted to `localStorage['wc26-v13-b']`
- `dark` — from `useDarkMode()`, persisted to `localStorage['wc26-dark']`

Match shape: `{ id, group, home, away, scoreH, scoreA, played, venue, date, time }`  
Bracket shape: `{ id, round, teamH, teamA, scoreH, scoreA, penH, penA, winner, played, next }`

### Dark mode

Tailwind's `dark:` variant is **not used**. Dark mode is implemented via conditional className expressions throughout, passing `dark: boolean` as a prop to every component. The root background switches between `bg-[#0f172a]` (dark) and `bg-[#fcfdfe]` (light).

### Styling conventions

- `getScoreColor(scoreThis, scoreThat, played, dark)` returns Tailwind classes for win/loss/draw/unplayed score inputs
- Card shorthand: `dark ? 'bg-[#1e293b] border-blue-900/60' : 'bg-white border-blue-100'`
- All animations via Framer Motion (`motion.div layout`, `AnimatePresence`)
- Stadium images served from `/public/stadiums/*.jpg` (17 local files, not CDN)
- Team flags from `https://flagcdn.com/w40/{code}.png`

### Path alias

`@/` maps to `src/` (configured in `tsconfig.json`).
