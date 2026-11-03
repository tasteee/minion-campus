# Minion Campus

A cozy, whimsical, third-person creature-raising game. You are a Headmaster. Raise, care for, train, breed and beckon unique minions on your campus.

- Game vision: [`docs/game-design.md`](docs/game-design.md)
- Roadmap to MVP: [`docs/roadmap.md`](docs/roadmap.md)
- Agent/contributor guide: [`CLAUDE.md`](CLAUDE.md)

## Develop

Needs Node 22+ and pnpm 10.

```bash
pnpm install
pnpm dev        # play at http://localhost:5173
pnpm test       # simulation tests
pnpm check      # typecheck all packages
pnpm build      # production build → apps/client/dist
```

Controls: **WASD** move · **Shift** run · **Space** hop · **Drag** (left or right) look · **Tab** toggle mouse look · **Wheel** zoom.
