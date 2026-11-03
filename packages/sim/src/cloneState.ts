import type { GameStateT } from './types'

// State is plain JSON, so a JSON round trip is a full, platform-free deep copy.
export const cloneState = (state: GameStateT): GameStateT => JSON.parse(JSON.stringify(state)) as GameStateT
