# Minion Campus — Roadmap to MVP

> Living document. Update the **Status** table as milestones finish.
> Vision and rules: [`game-design.md`](./game-design.md). Section refs like `§4.10` point there.

---

## Status

| # | Milestone | Status |
|---|---|---|
| M0 | Vision docs + roadmap | ✅ Done |
| M1 | Project foundation | ✅ Done |
| M2 | World interaction | ✅ Done — awaiting review |
| M3 | Simulation foundation | ⬜ Next — awaiting approval |
| M4 | Campus gameplay | ⬜ |
| M5 | Starter experience + town | ⬜ |
| M6 | Breeding + Beckoning | ⬜ |
| M7 | Tournament | ⬜ |
| M8 | MVP polish + deploy | ⬜ |

**Rule:** work only on the current approved milestone. On finish → report what was built, what is unfinished, then stop for approval (`§20`).

---

## MVP definition

**The MVP proves one thing:** raising a minion feels good.

### The MVP player journey

A new player can do all of this in one save, in the browser, with no backend:

1. Start a new game. Pick Quick / Intermediate / Exhaustive questionnaire.
2. Answer questions. Receive a matched starter minion.
3. Arrive on campus. See the date and season.
4. Walk up to the minion in third person. Feed it. Pet it. Check its panel.
5. Assign it to training equipment. Watch it use the equipment.
6. End the day. Read the daily report. Stats, needs, age and relationship change.
7. Walk to town. Talk to NPCs. Buy food, equipment and remains.
8. Beckon a new minion from remains at The Beckoning Center.
9. Breed two minions at the Breeding Center. Get a new, different-looking offspring next day.
10. Enter a tournament against AI minions. Win or lose money.
11. Over many days, minions age. One eventually dies. The player can keep its remains.
12. Close the tab. Reopen. Everything is exactly where it was. Time did not pass.

### MVP must-haves (from `§17.1`)

| Area | MVP scope |
|---|---|
| Movement | Third-person walk/run, follow camera, Rapier collisions |
| Scenes | Campus, Town, Arena. Scene manager state machine |
| Interaction | One interaction system for minions, NPCs, objects. Prompt + dialogue box |
| Calendar | 7-day week, 28-day month, 3-month season, 4 seasons. Data-driven config |
| Day cycle | End Day button → deterministic `advanceDay` pipeline → daily report |
| Minion model | ID, species, name, gender, appearance params, stats, personality, traits, needs, age, hidden lifespan budget, relationship, parentage, life history |
| Needs | Hunger, Energy, Happiness, Affection, Health, Stress |
| Care | Feed, pet, play. Personality changes how much care is needed |
| Personality | Hidden at start, revealed over time through interaction |
| Relationship | Trust/affection score with Headmaster. Grows with consistent care |
| Training | Assign minion → equipment. Stat gain vs fatigue/stress. Overtraining hurts |
| Aging | Hidden lifespan budget. Poor care burns budget faster. Visible life stages |
| Death | Permanent. Option to keep remains. (Ask-for-remains dialogue is stretch) |
| Appearance | Procedural primitive minions driven by genes: size, proportions, colors, pattern, ears, horns, tail |
| Starter | Questionnaire (3 lengths), deterministic authored scoring |
| Town | Walkable town, NPC-fronted facilities: Shop, Breeding Center, Beckoning Center, Tournament desk |
| Economy | Money. Buy food, equipment, remains. Earn from tournaments |
| Breeding | Any two compatible minions, gender-agnostic. 1-day duration. Seeded inheritance of species, genes, stats potential, traits, lifespan tendency. Vague hints only |
| Beckoning | Spend remains → seeded outcome. Rarity gated by Headmaster progression |
| Headmaster progression | Experience from raising, discovering, relationships — not only tournaments |
| Tournament | Arena scene. AI opponents. Same match rules for all. Simple auto-resolved match |
| Persistence | IndexedDB, schema version, autosave after End Day, export/import JSON |
| Deploy | GitHub Pages |

### MVP content (all provisional, all in `packages/content`)

| Content | MVP amount |
|---|---|
| Species | ~6 (4 Common, 1 Uncommon, 1 Rare/Epic) |
| Personalities | ~8 |
| Traits | ~10 |
| Equipment | 3–4 (e.g. exercise machine, chessboard, running track, nap mat) |
| Food | 2–3 items |
| Remains | 2–3 types (mystery, common, curated) |
| NPCs | 4–5 (shopkeeper, breeder, beckoner, tournament clerk, greeter) |
| Questionnaire | 50 authored questions (Quick uses 10, Intermediate 25) |
| AI tournament minions | 3–5 |

### Not in MVP (from `§17.2`)

AI-generated models · expeditions · festivals · farming · campus construction · revival · complex combat · environmental inheritance (beyond a stub) · rare mutations · visiting other Headmasters · multiplayer.

The data model should leave room for these. Do not build them.

---

## Architecture at a glance

```
apps/client          Svelte 5 + Threlte + Rapier + Miniplex
  scenes/            campus, town, arena, scene-manager
  world/             player, camera, interactables, minion views
  ui/                hud, minion-panel, dialogue, day-report, questionnaire
  state/             runes/stores wrapping sim state
  persistence/       IndexedDB save/load, export/import
packages/sim         pure TS, no browser/Svelte/Three. Vitest
packages/content     static data: species, traits, personalities, equipment, NPCs, dialogue, items
```

### Data flow

1. **Sim state** (plain JSON) is the source of truth.
2. **Client store** holds the current state.
3. **Scenes** read state → spawn Miniplex entities → render.
4. **Player action** (feed, assign, buy) → calls a pure sim function → new state → store updates.
5. **End Day** → `advanceDay(state, assignments, seed)` → `{ nextState, report }` → autosave to IndexedDB → show report.
6. **Scene unload** → ECS entities dropped. Sim state untouched.

### Key rules

- All randomness goes through a **seeded RNG** stored in state. Same seed + inputs = same result.
- All daily changes go through **one pipeline**, in the `§3.4` order.
- Game rules live in `sim` only. Never in UI components.
- Every tuning number lives in a **config object**, marked provisional.

---

## Milestones

Each milestone lists **Build**, **Done when**, and **Decide first** (owner input needed before or during the milestone; I'll propose placeholders).

### M1 — Project foundation (`§20` Step 1)

**Build**
- pnpm workspace: `apps/client`, `packages/sim`, `packages/content`.
- Vite + Svelte 5 + strict TS + Threlte + Three + Rapier.
- Vitest wired in `packages/sim`.
- Test scene: ground, a few obstacles, light, sky color.
- Third-person player capsule: WASD move, run, camera follows and orbits.
- GitHub Pages deploy workflow.

**Done when**
- `pnpm dev` runs. Player walks around a 3D scene with collisions.
- `pnpm test` runs (one placeholder test).
- Pages build works.

**Decided**
- Camera: right-drag orbit, wheel zoom.
- Platform: desktop keyboard + mouse for MVP.

**Built**
- Workspace + strict TS. Test scene `apps/client/src/scenes/test-scene`.
- Player: Rapier kinematic character controller (`world/player`). WASD/arrows, Shift run, Space hop, auto-step, slope limit, fall reset.
- Camera: `world/camera` orbit state + smoothed follow.
- Scene manager stub: `scenes/sceneManager.svelte.ts` (test scene only).
- CI + Pages: `.github/workflows/deploy.yml` (check, test, build on PRs; deploy on `main`).

**Unfinished / notes**
- Pages needs a one-time repo setting: Settings → Pages → Source: **GitHub Actions**.
- Bundle is ~5 MB (Rapier WASM inlined). Code-split later (M8).
- Miniplex installed, not used until M2.
- Player is a placeholder capsule.

### M2 — World interaction (`§20` Step 2)

**Build**
- Interactable component + proximity detection + "Press E" prompt.
- One interaction path for NPCs, minions and objects.
- Dialogue box UI with simple branching lines from content data.
- Placeholder NPC and placeholder minion in the test scene.

**Done when**
- Walk up to an NPC → prompt → dialogue opens and closes.
- Walk up to a minion → prompt → placeholder action menu.

**Built**
- Miniplex ECS for in-scene entities: `world/ecs/ecsWorld.ts`. Entities register on mount, unregister on destroy.
- One interaction path: `interactable.target` is `npc` | `minion` | `object`. Nearest-in-radius focus (`world/interaction`).
- Input router by mode (`free` / `dialogue` / `minionMenu`). Player movement locks outside `free`.
- Prompt ("E Talk to Pip"), spinning focus marker, NPC/minion turn to face the player.
- Dialogue data in `packages/content` (nodes, `nextNodeId`, choices). Box UI: E/Space/Enter continue, 1–9 choose, Esc close, mouse works too.
- Placeholder NPC (Pip), sign object, placeholder minion (Mochi) with Pet/Feed/Play/Check menu → toast + hop.
- Content integrity tests (dialogue links, NPC/object → dialogue).

**Unfinished / notes**
- Minion actions are view-only placeholders. Real effects come from the sim (M3/M4).
- Mochi lives in client placeholder data, not sim state.
- Dialogue tone used: short, warm, whimsical (provisional).

### M3 — Simulation foundation (`§20` Step 3)

**Build**
- `GameStateT` with schema version, seed, calendar, headmaster, minions, inventory, money.
- Seeded RNG utility.
- Calendar: config-driven, day → week/month/season/year.
- `MinionT` model (full identity per `§4.1`), including gene/appearance params.
- `advanceDay(state, assignments)` pipeline with the 10 ordered phases. Stub phases allowed.
- Needs decay + care actions (feed, pet, play).
- Aging + hidden lifespan budget + care-quality burn rate.
- Personalities and traits as content data that modify needs.
- Daily report data structure.
- Tests: calendar math, determinism, needs, aging, a 1000-day lifespan simulation.

**Done when**
- Pure sim can run N days headless in a test and produce reports.
- Same seed + same inputs → identical output.

**Decide first** (I'll propose provisional numbers)
- Need ranges (proposal: 0–100) and daily decay rates.
- Lifespan range for common species (proposal: ~2–4 in-game years).
- Care-burn formula shape.
- Month names (proposal: placeholder `Spring 1`, `Spring 2`… until named).

### M4 — Campus gameplay (`§20` Step 4)

**Build**
- Campus scene: cozy environment, home building, equipment spots.
- Procedural minion renderer from appearance params.
- Minions wander, idle, and walk to their assigned equipment.
- Minion panel: needs, known stats, known personality hints, relationship, age stage.
- Feed / pet / play from interaction menu.
- Assignment UI + 3–4 equipment pieces with defined effects.
- HUD: date, season, money. End Day button with review step.
- Day report screen.
- IndexedDB save/load + autosave + export/import.

**Done when**
- Full day loop works on campus with one minion and survives a page refresh.

**Decide first**
- Daily action budget: unlimited care actions or limited? (proposal: unlimited care, one assignment per minion per day)
- Equipment list and effects.

### M5 — Starter experience + town (`§20` Step 5)

**Build**
- New-game flow → questionnaire length choice → questions → match → starter reveal.
- Deterministic authored scoring (answers → trait/personality/species weights).
- Exhaustive mode guarantees Rare/Epic.
- Town scene with NPCs fronting facilities.
- Shop: buy food, equipment, remains.
- Basic money balance.
- Scene transitions campus ↔ town.

**Done when**
- Fresh save → questionnaire → starter on campus → walk to town → buy food → return and feed.

**Decide first**
- The 6 MVP species: names, look, rarity, base stats.
- Questionnaire questions (I can draft; owner approves).
- Starting money and prices.

### M6 — Breeding + Beckoning (`§20` Step 6)

**Build**
- Breeding Center NPC: pick two minions, gender-agnostic compatibility, vague hints.
- 1-day breeding as a timed process in `advanceDay`.
- Initial inheritance: blend/pick genes, stat potential, traits, lifespan tendency, small mutation chance.
- Species outcome table with rare combos.
- Beckoning Center NPC: spend remains → seeded outcome.
- Headmaster progression score gating rare beckoning (rare minions can refuse).
- Death flow: minion dies → keep remains option.

**Done when**
- Breed two minions → next day a visibly distinct offspring appears.
- Beckon from remains → new minion appears.
- Tests: inheritance determinism and outcome distributions.

**Decide first**
- Compatibility rules (proposal: all MVP species compatible).
- Breeding cost and cooldown.
- Headmaster progression formula.

### M7 — Tournament (`§20` Step 7)

**Build**
- Arena scene.
- Tournament desk in town: register a minion.
- Simple auto-resolved match from stats + condition, shared by player and AI.
- 3–5 AI opponents from content.
- Rewards: money, sometimes remains. Effects on energy/stress.

**Done when**
- Enter → watch a simple match → result in report → reward applied.

**Decide first**
- Match format (proposal: short auto-battle with readable round log, no player input).

### M8 — MVP polish + deploy

**Build**
- Balance pass using headless sim runs (e.g. 336-day simulations per care profile).
- Cozy pass: colors, sounds (optional), small animations.
- Onboarding hints for first days.
- Ask-for-remains dialogue (`§10.1`) if time allows.
- Bug pass. Deploy to GitHub Pages.

**Done when**
- The full MVP journey above is playable end to end on the live Pages URL.

---

## Provisional values log

Every placeholder number or design call made during development goes here, so nothing silently becomes permanent (`§22`).

| Date | Area | Provisional decision | Where in code |
|---|---|---|---|
| 2026-11-03 | Player movement | Walk 4, run 7.5, jump 6, gravity -20 (units/s) | `apps/client/src/world/player/playerState.ts` |
| 2026-11-03 | Camera | Pitch 0.15–1.25 rad, distance 3.5–14, start 8 | `apps/client/src/world/camera/orbitState.ts` |
| 2026-11-03 | Controls | Space = hop (not in GDD; easy to remove) | `apps/client/src/world/input/bindings.ts` |
| 2026-11-03 | Interaction | Radius: NPC 2.2, minion 1.8, object 1.8 | `apps/client/src/world/npc`, `world/minion`, `world/objects` |
| 2026-11-03 | Placeholder content | Pip (greeter), sign, Mochi + their lines | `packages/content/src`, `apps/client/src/world/minion/placeholderMinions.ts` |
