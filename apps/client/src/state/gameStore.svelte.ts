import type { GameStateT } from '@minion-campus/sim'
import { saveGame } from '../persistence/saveGame'

// The one place the client holds sim state. Replaced whole on every change.

const AUTOSAVE_DELAY_MS = 400

let currentGame = $state.raw<GameStateT | null>(null)
let autosaveTimeoutId: ReturnType<typeof setTimeout> | undefined

export const getGame = () => currentGame

export const requireGame = () => {
	if (!currentGame) throw new Error('Game not loaded yet')
	return currentGame
}

export const setGame = (nextGame: GameStateT) => {
	currentGame = nextGame
	clearTimeout(autosaveTimeoutId)

	autosaveTimeoutId = setTimeout(() => {
		saveGame(nextGame)
	}, AUTOSAVE_DELAY_MS)
}

export const setGameAndSaveNow = async (nextGame: GameStateT) => {
	currentGame = nextGame
	clearTimeout(autosaveTimeoutId)
	await saveGame(nextGame)
}
