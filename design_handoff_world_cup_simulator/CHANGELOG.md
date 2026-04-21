# CHANGELOG — Editorial Redesign

Implementación del diseño `design_handoff_world_cup_simulator/` sobre la app existente (Next.js 16.2.2 · React 19 · Tailwind 4).

---

## 2026-04-20 · Integration pass

### Added
- **Editorial theme system (4 temas):** `editorial` (default), `dark`, `panini-classic`, `panini-premium`. Tokens CSS en `[data-theme="…"]` con switch en `<html>`. Script inline en [layout.tsx](../src/app/layout.tsx) evita el flash al hidratar.
- **Tipografía editorial:** `Anton` (display), `Playfair Display` (italics), `Inter` (body), `JetBrains Mono` (labels) vía `next/font/google`.
- **i18n ES/PT:** diccionario en [src/data/i18n.ts](../src/data/i18n.ts), hook `useTheme().t(key)`.
- **Masthead** 3 columnas con título Anton + subtítulo Playfair italic + borde `3px double`.
- **Metabar** 5 celdas (partidos / goles / goleador / campeón / controles) con botones de idioma, tema cíclico, undo/redo, reset y simular-todo.
- **PhaseNav** con roles `tablist`/`tab` + flechas izquierda/derecha + Home/End.
- **GroupRail** (A–L) con `radiogroup`/`radio` + navegación por flechas.
- **GroupHeader** con letra gigante + lista de selecciones + botón "Simular Grupo".
- **BestThirdsPanel** (top-8 azul, resto atenuado).
- **FinalView** con bandera gigante, podio 1º/2º/3º y bloques de stats.
- **TeamModal** (`role="dialog"`, ESC cierra): bandera · nombre · stats completas (J/V/E/D/GF/GC/SG/Pts) + goleadores del equipo.
- **TweaksPanel** flotante bottom-right (idioma + tema).
- **FxOverlay** con `aria-live="polite"` para anunciar fases de simulación.
- **Undo/Redo** con stack de snapshots (matches + bracket + scorers).
- **Scorers:** pool por selección en [src/data/scorers.ts](../src/data/scorers.ts) + `assignScorersForMatch` + `computeTopScorer` en [src/lib/simulate.ts](../src/lib/simulate.ts).
- **Simulación completa:** `simulateGroupData`, `simulateAllGroupsData`, `simulateBracketRoundData` (penales aleatorios forzados si empate). Secuencia animada: Grupos → R32 → R16 → QF → SF → Final con `FxOverlay`.
- **Textura newsprint:** noise SVG en `body::before` + gradientes radiales por tema.

### Changed
- Groups view: breakpoint de 3-col pasa de `lg:` (1024) a `md:` (768) → tablets verticales ya obtienen el layout completo.
- `MatchCard` re-skineado pero **mantiene la foto del estadio** (`VENUE_IMAGES` / `/public/stadiums/*.jpg`).
- `BracketMatch`: winner → fondo `--ink` y color `--accent`; loser → `line-through` + opacity 0.4; divider punteado entre filas.
- `GroupTable`: columnas POS/EQUIPO/J/SG/PTS con `pos1` rojo, `pos2` dorado, `pos3` azul (si mejor tercero).
- `TeamLabel`: variantes `inline | compact | stacked | large`; click abre `TeamModal`.
- `getTable` extendido a V/E/D (además de PJ/GF/GC/PTS/SG).

### Accessibility
- `role="tablist"` en PhaseNav, `role="radiogroup"` en GroupRail con navegación completa por teclado.
- `aria-label` en cada score input nombrando equipo local y rival.
- `:focus-visible` global: outline 2px `var(--accent)` con offset 2px.
- `@media (prefers-reduced-motion: reduce)` desactiva animaciones.
- `role="dialog"` + `aria-modal` + ESC cierra en `TeamModal`.
- `role="status"` + `aria-live="polite"` en `FxOverlay`.

### Performance
- `canvas-confetti` (~10 KB gz) lazy-imported — solo se carga al ganar la final.
- Bundle total gzipped ~252 KB (React 19 + Next 16 + framer-motion + código propio + CSS). Código propio estimado en ~25 KB gz — muy por debajo del umbral de 80 KB solicitado.
- Propuesto (no ejecutado): si se necesita ahorrar más, lazy-load de `TeamModal`, `TweaksPanel` y `FxOverlay` vía `next/dynamic({ ssr: false })` — ahorraría ~3–5 KB gz iniciales a costa de un micro-delay al abrirlos por primera vez.

### Persistence
- Scores sobreviven deploys en Vercel via `localStorage`: `wc26-v14-m` (matches), `wc26-v14-b` (bracket), `wc26-v14-s` (scorers). Temas e idioma en `wc26-theme` / `wc26-lang`.
- Sin migración automática desde estados previos a `v14` (los códigos de equipo cambiaron entre versiones y un diff no es trivial).

### Removed
- `src/components/WorldCupNews.tsx` — no figura en el handoff.
- `src/components/icons/IconSun.tsx`, `IconMoon.tsx` — reemplazados por el cycle de temas.
- `src/hooks/useDarkMode.ts` — sustituido por `useTheme`.
- `src/_backup/` — código legacy.

### Known gaps vs. full handoff
Decisiones conscientes de alcance: lo estructural está completo, lo siguiente falta:

1. **Panini Classic:** en el handoff el título va rotado con text-stroke + text-shadow + fondo metabar rojo sobre cartón kraft con patrón de puntos. Yo solo hago swap de tokens; el styling "sticker" con rotaciones no está.
2. **Panini Premium:** efecto foil holográfico (gradientes animados en letras + card::before con blur) no replicado.
3. **Beeps Web Audio:** no implementados (osc square + gain envelope del handoff).
4. **Partido de 3er lugar (3P):** el generador actual tiene R32→R16→QF→SF→FINAL, no hay 3P. El podio muestra "—" para la 3ª posición.
5. **Head-to-head en desempates de grupo:** criterio actual es pts → SG → GF. Head-to-head FIFA no está implementado.
6. **Tweaks extras:** densidad compacta/espaciosa y toggle serif/grotesk del handoff no implementados (placeholder en TweaksPanel).
7. **Verificación visual en navegador:** no tengo herramienta de browser automation en este entorno, por lo que la paridad pixel-perfect contra `screenshots/*.png` requiere revisión manual del usuario en `npm run dev` y comparación lado a lado.

### Testing
- No existe suite de tests (`CLAUDE.md` lo indica explícitamente). No se añadió una en este pase por estar fuera de alcance solicitado.
- `npm run build` pasa limpio (Next suprime TS/ESLint por `next.config.ts`).
- `npm run lint` reporta warnings de `@next/next/no-img-element` (intencional: `flagcdn.com` + `/public/stadiums/*.jpg`) y errores de `@typescript-eslint/no-explicit-any` heredados del código original (matches/bracket tipados como `any[]`). Ninguno rompe el build.

### Files touched
```
src/app/layout.tsx              · fuentes + anti-flash script + ThemeProvider
src/app/globals.css             · tokens 4 temas + grain + gradientes + a11y
src/app/page.tsx                · orchestrator (history stack + FX + providers)
src/contexts/ThemeContext.tsx   · NEW — theme + lang + t()
src/contexts/TeamModalContext.tsx · NEW
src/data/i18n.ts                · NEW
src/data/scorers.ts             · NEW
src/data/groups.ts              · 48 selecciones actualizadas (pase previo)
src/lib/simulate.ts             · NEW
src/lib/utils.ts                · getTable extendido + computeBestThirds
src/components/{Masthead,Metabar,PhaseNav,GroupRail,GroupHeader,BestThirdsPanel,FinalView,FxOverlay,TeamModal,TweaksPanel}.tsx · NEW
src/components/{MatchCard,BracketMatch,GroupTable,TeamLabel}.tsx · re-skin editorial
```
