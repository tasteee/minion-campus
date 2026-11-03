# Minion Campus — Agent Guide

Cozy third-person creature-raising game in the browser. The player is a **Headmaster** who raises, cares for, trains, breeds and beckons individual **minions** on their campus. Tournaments are optional. Serverless, single-player.

## Read these first

- `docs/game-design.md` — full game vision (source of truth). Read the relevant section before building a feature.
- `docs/roadmap.md` — MVP definition, milestones, **current status**, provisional values log.

## How to work

- Work only on the **current approved milestone** in `docs/roadmap.md`.
- When a milestone is done: update its status, report what was built and what is unfinished, then **stop for approval**.
- Open design questions (`game-design.md §22`) are not decided. Use configurable placeholders, mark them provisional, and log them in the roadmap's provisional values table.
- Run builds/tests at milestones, not after every tiny change.

## Non-negotiable rules

- **Time belongs to the player.** Days advance only on End Day. Nothing happens while the game is closed.
- **Sim owns the rules.** `packages/sim` is pure TS: no Svelte, Three, DOM, or ECS. Deterministic, seeded RNG in state.
- **One day pipeline.** All daily changes go through `advanceDay(state, assignments) => { nextState, report }` in a fixed order.
- **ECS is view-only.** Miniplex holds in-scene entities only. Persistent minion data lives in sim state.
- **No game rules in UI.** UI calls sim functions.
- **No required AI/API.** Game must work fully offline. No API keys in the client.
- **Terminology:** "Beckoning" / "The Beckoning Center" — never "cloning". Breeding is gender-agnostic.

## Stack

pnpm workspaces · Vite · strict TypeScript · Svelte 5 (runes) · Threlte · Three.js · Rapier · Miniplex · IndexedDB · Vitest · GitHub Pages.

Layout: `apps/client`, `packages/sim`, `packages/content`.

Sim map: tuning in `sim/src/config.ts` · state types in `sim/src/types.ts` · day pipeline in `sim/src/day/advanceDay.ts` (one file per phase) · care actions in `sim/src/care` · test helpers in `sim/src/test/testHelpers.ts`. Sim functions never mutate input; they return `{ nextState, ... }`.

## Code style

- Arrow functions only. No `function` declarations. No classes.
- No destructuring. No `else`.
- `type`, never `interface`. Custom types end in `T`. Use `import type`.
- Booleans use clear prefixes (`is`, `has`, `should`, `can`).
- Small, flat functions. Descriptive names. async/await. Sparse comments.
- Blank line before multiline functions, objects and invocations.
- CSS: kebab-case classes, modifiers as `.base.isModifier`, CSS in sibling files, design tokens, no inline styles, avoid shadows/gradients.
- No ESLint/Prettier unless asked.
