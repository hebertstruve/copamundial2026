# Prompts para Claude Code — World Cup 2026 Simulator

Copia y pega estos prompts en Claude Code (VS Code) en orden. Adapta las rutas (`src/`, `components/`, etc.) a tu estructura real.

---

## 🟢 Prompt 0 — Onboarding (úsalo primero, SIEMPRE)

```
Voy a implementar un simulador del Mundial 2026 en este proyecto.
Tengo una especificación de diseño completa en la carpeta:
  design_handoff_world_cup_simulator/

Haz lo siguiente, en este orden, sin escribir código todavía:

1. Lee design_handoff_world_cup_simulator/README.md completo.
2. Lista las imágenes en design_handoff_world_cup_simulator/screenshots/
   y ábrelas una por una para entender el look & feel.
3. Explora MI codebase actual: framework (React/Next/Vue/etc),
   estructura de carpetas, design system existente, librerías de UI,
   gestión de estado (Redux/Zustand/Context/etc), routing, estilos
   (CSS modules / Tailwind / styled-components / etc).
4. Resúmeme en una tabla:
   - Qué patrones del proyecto usarás
   - Qué tokens del design system mapean a los del handoff
   - Qué componentes nuevos necesitas crear
   - Qué componentes existentes puedes reutilizar
5. Propón un plan de implementación en fases (NO ejecutes aún).

Al final, pregúntame si apruebo el plan antes de escribir código.
```

---

## 🔵 Prompt 1 — Data + Estado

```
Implementa la capa de datos y estado del simulador:

1. Crea los tipos TypeScript a partir de la sección "Data Model" del README
   (Match, State, Team, Group).
2. Copia los 48 equipos de design_handoff_world_cup_simulator/data/teams.js
   a un archivo de datos en MI proyecto, con los tipos aplicados.
3. Convierte design_handoff_world_cup_simulator/app/store.js al patrón de
   gestión de estado que ya uso (detecta si es Zustand/Redux/Context/Pinia).
   Preserva toda la lógica: standings, mejores terceros, seedKnockout,
   advanceKnockout, simulateGroup, simulateAll, undo/redo.
4. Agrega validación al cargar desde localStorage: si los team codes
   cacheados no existen en los datos actuales, purga.
5. Escribe tests unitarios para: computeStandings, getBestThirds,
   seedKnockout. Al menos 5 casos cada uno.

No toques UI todavía.
```

---

## 🟣 Prompt 2 — Design Tokens

```
Crea los design tokens del simulador en el formato que usa mi proyecto
(variables CSS / theme object de Tailwind / tokens.ts / etc).

Fuente: sección "Design Tokens" del README.

Debes generar TOKENS para los 4 temas:
- editorial-light (default)
- dark
- panini-classic (kraft sticker album)
- panini-premium (foil neón)

Cada tema expone las mismas variables (paper, ink, accent, gold, mute,
rule, card, shadow) para que se puedan alternar con un atributo
[data-theme] en el root. Incluye también la escala tipográfica
(display/headline/body/mono) con @font-face o imports de Google Fonts
según lo que ya usa mi proyecto.

Muéstrame el diff antes de aplicarlo.
```

---

## 🟠 Prompt 3 — Componentes base

```
Implementa los componentes base del simulador como PIEZAS REUTILIZABLES,
en mi carpeta de componentes, siguiendo las convenciones existentes:

- Masthead (cabecera editorial de 3 columnas)
- Metabar (stats + controles)
- PhaseNav (tabs con numeración romana)
- MatchCard (TeamSide · ScoreBlock · TeamSide + footer goleadores)
- StandingsTable (con highlight pos-1/2/3-best)
- BestThirdsPanel
- BracketMatch (para vista knockout)
- TeamModal

Cada componente:
- Props tipadas en TS
- Sin lógica de negocio (recibe data por props)
- Storybook story o ejemplo en Ladle/cookbook si mi proyecto los usa
- Responsivo: desktop / tablet / mobile

Sigue EXACTAMENTE las especificaciones visuales del README sección
"Estructura de Pantallas". Usa las screenshots en
design_handoff_world_cup_simulator/screenshots/ como referencia pixel.
```

---

## 🔴 Prompt 4 — Pantallas completas

```
Ensambla las 3 pantallas principales conectando los componentes base
al store que ya implementamos:

1. GroupsScreen — rail lateral A-L, group header, match cards editables,
   StandingsTable, BestThirdsPanel
2. BracketScreen — 5 columnas (R32/R16/QF/SF/3P) con BracketMatch cards
3. FinalScreen — champion hero + podio + stat blocks

Usa el router de mi proyecto para las 3 rutas.
Persiste la tab activa en localStorage.
Implementa la acción "Simular Grupo" y "Simular Todo" con overlay FX
(kicker + big text + sub) tal como en app/main.jsx del handoff.
```

---

## 🟡 Prompt 5 — i18n + Tweaks Panel

```
1. Integra el archivo design_handoff_world_cup_simulator/app/i18n.js
   al sistema de traducciones que ya usa mi proyecto (i18next,
   next-intl, vue-i18n, lo que sea). Claves en ES y PT.
   Botón toggle 🇪🇸 ES / 🇧🇷 PT en el Metabar.

2. Implementa el Tweaks Panel flotante bottom-right con toggles para:
   - Idioma
   - Tema (Editorial/Dark/Panini/Foil)
   - Densidad (compact/normal/spacious)
   - Tipografía (Anton/Serif/Grotesk)
   - Sonido (on/off)

   Persiste cada ajuste en localStorage.

3. Agrega los beeps de audio (Web Audio API square oscillator) en las
   acciones simular/reset/undo/redo.
```

---

## 🟢 Prompt 6 — QA & Polish

```
Fase de pulido:

1. Corre mis tests. Arregla cualquier rotura.
2. Verifica accesibilidad: roles ARIA en tabs, labels en score inputs,
   focus visible, navegación por teclado en el rail de grupos.
3. Verifica responsive: mobile (<640), tablet (768), desktop (>1100).
4. Verifica los 4 temas: toma screenshot de GroupsScreen en cada uno
   y compáralos visualmente con design_handoff_world_cup_simulator/screenshots/.
5. Perf: mide el bundle size del feature. Si supera 80KB gzipped,
   propón cómo lazy-loadearlo.
6. Escribe un CHANGELOG.md en la feature folder resumiendo qué hiciste.
```

---

## 💡 Consejos

- **Pega un prompt a la vez** y espera a que Claude Code termine antes del siguiente.
- Si Claude Code pregunta algo, respóndele con contexto específico de tu proyecto.
- Después del Prompt 0, puedes saltarte prompts que no apliquen (ej. si ya tienes design tokens, salta Prompt 2).
- Para iteraciones rápidas usa: *"Ajusta X siguiendo la sección Y del README"*.
- Si algo se ve distinto al prototipo HTML, di: *"Abre `Simulador Copa 2026.html` en el handoff y compara"*.
