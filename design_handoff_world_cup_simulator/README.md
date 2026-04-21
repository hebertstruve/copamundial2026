# Handoff: World Cup 2026 Simulator

## Overview
Simulador editorial del Mundial 2026 (FIFA World Cup Canadá · México · USA). Permite al usuario ingresar resultados manualmente o simular automáticamente los 104 partidos del torneo completo: 72 de fase de grupos (12 grupos × 6 partidos) + 32 de eliminación directa (16avos → octavos → cuartos → semis → 3er lugar → final). El diseño evoca una revista deportiva de cromos/stickers tipo Panini con 4 temas alternables.

## About the Design Files
Los archivos incluidos son **referencias de diseño creadas en HTML/React/CSS** — prototipos que muestran la apariencia e interacciones previstas, no código de producción para copiar literalmente. La tarea es **recrear estos diseños en el entorno existente de tu codebase** (React/Next/Vue/SwiftUI/Flutter/lo que uses) aplicando sus patrones, librerías de componentes y design system establecidos. Si no existe entorno aún, elige el framework más apropiado e implémentalos ahí.

## Fidelity
**High-fidelity (hifi)**: Los mockups incluyen colores finales, tipografías específicas, espaciado y tokens completos. Recrear pixel-perfect usando componentes del codebase destino.

---

## Estructura de Pantallas

### 1. Masthead (Cabecera editorial)
- **Layout**: 3 columnas (left meta · title central · right meta)
- **Left meta**: ★ EDICIÓN Nº 23 · fecha · región anfitriona
- **Title**: "COPA DEL MUNDO" en Anton display 900, clamp(48px, 7vw, 108px), uppercase, line-height 0.85. Subtítulo en Playfair Display italic accent (#e63222)
- **Right meta**: "USA · CAN · MEX" · "48 selecciones · 12 grupos" · "104 partidos"
- **Reglas decorativas**: 2px solid ink top & bottom; rule interna 1px

### 2. Metabar (stats bar)
- 5 celdas en flex con separadores verticales
- Cada celda: label mono uppercase 9px + value display 28px 900
- Métricas: Partidos jugados (N/104), Total de goles, Goleador actual, Campeón, Controles
- Controles: botón idioma (🇪🇸 ES / 🇧🇷 PT), toggle tema (📘/✨/☀/☾), undo/redo, reiniciar, simular todo

### 3. Phase Nav (tabs)
- 3 tabs: I · PRIMERA FASE / II · ELIMINATORIAS / III · LA GLORIA
- Numeración romana mono pequeña + label display grande
- Active: background ink, color paper, underline accent

### 4. Groups View
- **Group rail lateral**: 12 botones (A-L) en columna; cada uno muestra letra display 30px + mini counter "N/6"; estado active highlight accent
- **Group header**: etiqueta "GRUPO" mono + letra gigante (72px) + lista de equipos separados por " · " + botón "⚡ Simular Grupo"
- **Match cards**: flex horizontal con TeamSide · ScoreBlock · TeamSide
  - TeamSide: flag 32px · name display 26px 900 · code mono 10px
  - ScoreBlock: 2 inputs score 44×54px + separador "–"
  - Score input: font-size 24px, padding 6px 0 4px, border 2px solid ink
  - Winner state: background ink, color paper
  - Footer: match-bottom con "POR DISPUTAR" + jornada, o goleadores chips
- **Standings table**: clasificación con pos-1 (rojo), pos-2 (dorado), pos-3 (azul si mejor 3ero, gris si no)
- **Best Thirds panel**: tabla de los 12 terceros ordenados, 8 primeros con fila azul + borde, 4 últimos atenuados

### 5. Bracket View
- Título "LLAVE FINAL" display clamp(40,6vw,80)
- Columnas horizontales: R32 · R16 · QF · SF · 3P
- Bracket match cards: 2 team rows + divider punteado
- Winner: color accent; Loser: opacity 0.4 + line-through
- Click en score inputs para editar; penales aparecen si empate

### 6. Final View
- Overtitle mono uppercase "COPA DEL MUNDO 2026 — CAMPEÓN"
- Flag emoji gigante clamp(80,12vw,180)
- Champion name display clamp(80,14vw,220) 900 line-height 0.82
- Subtítulo italic con resultado de la final
- Podio 3 columnas (1º/2º/3º) con pos display 48px, flag 48px, name display 22px
- StatBlocks: Total goles, Partidas, Goleador, Goles del goleador

### 7. Team Modal
- Overlay ink 0.8 + card paper 80vw max 720
- Flag 80px + name display 56px 900
- Grid 4 columnas de stats: Jogos, V, E, D, GF, GC, Saldo, Pts (v: display 38px 900 + lbl mono 9px)
- Lista de goleadores del equipo

### 8. Tweaks Panel (floating bottom-right)
- Toggle desde toolbar del host (post `__edit_mode_available`)
- Rows: Idioma (ES/PT) · Estilo (Editorial/Dark/Panini/Foil) · Densidad · Tipografía · Sonido
- Botón activo: background ink, color paper

---

## Interacciones

- **Click en score input**: abre edición inline. Tab entre inputs. Enter confirma.
- **Click en bandera/nombre de equipo**: abre TeamModal con estadísticas
- **⚡ Simular Grupo**: genera resultados aleatorios para los 6 partidos del grupo; overlay FX con kicker + big text + sub 800ms
- **⚡ SIMULAR TODO**: secuencia overlay FX por fase (grupos → R32 → R16 → QF → SF → Final), cada fase 700ms; al terminar salta a tab "final"
- **REINICIAR**: confirm dialog; resetea state y vuelve a grupos/A
- **Undo/Redo**: snapshot stack en cada setMatchScore
- **Penales**: si empate en knockout, aparecen inputs adicionales bajo el score
- **Beeps**: audio osc square + gain envelope; frecuencias variadas (440-1100Hz) según acción

## Lógica de Torneo

- **Round-robin por grupo**: pairings (0,1)(2,3) / (0,2)(1,3) / (0,3)(1,2)
- **Clasificación**: pts (V=3, E=1, D=0) → SG (dif goles) → GF → head-to-head
- **Clasifican a R32**: 1º + 2º de cada grupo (24) + **8 mejores 3eros** (criterio: pts → SG → GF)
- **Pairing R32**: deterministic crossover 1º-vs-3º y 2º-vs-2º alternando mitades
- **Knockout**: empate → penales random 3-5; perdedor eliminado
- **Goleadores**: pool de nombres por equipo (ver `data/teams.js` equivalente), asignación aleatoria de goles

---

## Design Tokens

### Colores (Tema Editorial por defecto)
```css
--paper: #f1e8d5;           /* fondo papel crema */
--paper-edge: #e8dfc8;      /* fondo más oscuro */
--ink: #0b1d3a;             /* tinta navy principal */
--ink-soft: #1f3557;        /* tinta suave */
--accent: #e63222;          /* rojo editorial */
--accent-dark: #b8281b;     /* rojo oscuro */
--gold: #c9a34e;            /* dorado */
--rule: rgba(11,29,58,0.25);/* reglas dashed/solid */
--mute: #67748a;            /* texto apagado */
--card: #fffef8;            /* fondo card */
--shadow: 2px 3px 0 rgba(11,29,58,0.15);
```

### Colores Tema Dark
```css
--paper: #0f1115;
--ink: #f4ede0;
--accent: #ff3b30;
--gold: #f4c542;
```

### Colores Tema Panini Classic
```css
--paper: #d9c7a4;           /* kraft cartón */
--ink: #2a1f14;             /* marrón profundo */
--accent: #c4302b;          /* rojo sticker */
--gold: #e8a93a;
```

### Colores Tema Panini Premium (Foil)
```css
--paper: #0a0612;           /* púrpura casi negro */
--ink: #f0e9ff;
--accent: #ff2a6d;          /* rosa neón */
--purple: #8b5cf6;
--cyan: #00f0ff;
--gold: #ffd700;
```

### Tipografía
```css
--f-display: 'Anton', 'Oswald', Impact, sans-serif;  /* headlines */
--f-headline: 'Playfair Display', Georgia, serif;    /* italics editoriales */
--f-body: 'Inter', system-ui, sans-serif;
--f-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Escalas */
title-row1: clamp(48px, 7vw, 108px) 900 uppercase
title-row2: clamp(22px, 3vw, 40px) italic 900
champion-name: clamp(80px, 14vw, 220px) 900 line-height 0.82
bracket-title: clamp(40px, 6vw, 80px) 900
metabar-value: 28px 900
group-letter: 72px 900 line-height 0.8
team-name: 26px 900
score-input: 24px 900 (dentro de caja 44×54)
scorer-row-name: 14px 900 uppercase
body-mono: 10-11px uppercase letter-spacing 0.14-0.2em
```

### Spacing
```css
--pad-card: 14px 18px
--pad-section: 24px 28px
--gap-rail: 6px
--gap-grid: 16-24px
--radius-btn: 0 (flat editorial)
--radius-panini: 4-12px (dependiendo del tema)
```

### Sombras
```css
--shadow-editorial: 2px 3px 0 rgba(11,29,58,0.15)
--shadow-sticker: 3px 3px 0 var(--ink)  /* panini classic */
--shadow-foil: 0 0 25px rgba(255,42,109,0.5)  /* panini premium */
```

---

## Copy (Español/Portugués)

Todas las cadenas están centralizadas en `app/i18n.js` con claves para ambos idiomas. Ejemplo:

```js
edition: { es: 'EDICIÓN Nº 23', pt: 'EDIÇÃO Nº 23' }
simAll: { es: '⚡ SIMULAR TODO', pt: '⚡ SIMULAR TUDO' }
bestThirdsTitle: { es: 'MEJORES TERCEROS', pt: 'MELHORES TERCEIROS' }
```

## Data Model

### Grupos (data/teams.js)
```js
window.TEAMS_DATA = {
  groups: {
    A: [
      { code: 'MEX', name: 'México', flag: '🇲🇽', rank: 13 },
      { code: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', rank: 56 },
      { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', rank: 22 },
      { code: 'CZE', name: 'República Checa', flag: '🇨🇿', rank: 40 }
    ],
    // ... B a L
  }
}
```

Los 12 grupos oficiales del Mundial 2026 están listados tal cual en `data/teams.js`.

### Match
```ts
type Match = {
  id: number;
  phase: 'group' | 'knockout';
  round?: 'R32'|'R16'|'QF'|'SF'|'3P'|'F';
  group?: 'A'|...|'L';
  home: string;  // team code
  away: string;
  homeScore?: number;
  awayScore?: number;
  homePenalties?: number;
  awayPenalties?: number;
  date: string;
  time: string;
  venue: string;
  played: boolean;
}
```

### State
```ts
type State = {
  phase: 'groups'|'knockout'|'final';
  groupMatches: Match[];
  knockoutMatches: Match[];
  scorers: Record<string, { player: string, team: string, goals: number }>;
  history: State[];  // undo stack
  historyIndex: number;
}
```

Persistido en `localStorage['wc2026_sim_state_v3_draw']` con validación: si cached codes no coinciden con TEAMS_DATA actual, purga.

---

## Assets

- **Flags**: emojis Unicode regional indicators (🇲🇽, 🇧🇷, etc). Excepciones: Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿 y Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿 usan tag sequences (pueden no renderizar en todos los OS; fallback a GB 🇬🇧)
- **Fuentes**: Google Fonts (Anton, Playfair Display, Inter, JetBrains Mono)
- **Ninguna imagen externa** — todo dibujado con CSS/SVG

---

## Screenshots

Ver carpeta `screenshots/`:
- `01-panini-classic-groups.png` — Tema Panini Classic (kraft/stickers) · vista grupos
- `02-panini-premium-groups.png` — Tema Panini Premium (foil holográfico) · vista grupos
- `03-editorial-light-groups.png` — Tema Editorial claro · vista grupos
- `04-dark-groups.png` — Tema Dark · vista grupos
- `05-bracket-panini-classic.png` — Vista de la llave (eliminatorias)
- `06-final-champion.png` — Pantalla de campeón con podio y stats

---

## Files incluidos

- `Simulador Copa 2026.html` — shell principal; carga React UMD + Babel standalone + scripts en orden
- `data/teams.js` — los 48 equipos en 12 grupos
- `data/schedule.js` — generador determinístico del calendario (72 group + 32 knockout)
- `app/store.js` — state management con undo/redo, standings, mejores terceros, seedKnockout, advanceKnockout, simulateGroup, simulateAll
- `app/groups.jsx` — GroupsView, MatchCard, StandingsPanel, ScorersPanel, BestThirdsPanel
- `app/bracket.jsx` — BracketView con columnas knockout
- `app/final.jsx` — FinalView (podio + stats) + TeamModal
- `app/main.jsx` — App root, masthead, metabar, phase-nav, tweaks panel, FX overlay
- `app/styles.css` — tema editorial base
- `app/panini-themes.css` — overrides Panini Classic + Panini Premium
- `app/i18n.js` — traducciones ES/PT
