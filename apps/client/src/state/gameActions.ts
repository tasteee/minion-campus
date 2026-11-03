import { species } from '@minion-campus/content'
import type { ActivityAssignmentT, CareActionIdT } from '@minion-campus/sim'
import { addNewMinion, advanceDay, assignActivity, createNewGame, performCareAction } from '@minion-campus/sim'
import { backupUnreadableSave, loadGame, parseSaveFile } from '../persistence/saveGame'
import { requireGame, setGame, setGameAndSaveNow } from './gameStore.svelte'

// UI-facing actions. Each one calls the sim and stores the result. No rules here.

const createSeed = () => crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now()

// Placeholder starter until the questionnaire (M5): a random placeholder species.
const pickStarterSpeciesId = (seed: number) => {
	const speciesIds = Object.keys(species)
	return speciesIds[seed % speciesIds.length] ?? 'mochling'
}

export const startNewGame = async () => {
	const seed = createSeed()
	const freshGame = createNewGame(seed)
	const withStarter = addNewMinion(freshGame, { speciesId: pickStarterSpeciesId(seed), origin: 'starter' })
	await setGameAndSaveNow(withStarter.nextState)
}

export type BootResultT = 'loaded' | 'newGame' | 'replacedIncompatible'

export const bootGame = async (): Promise<BootResultT> => {
	const result = await loadGame()
	if (result.status === 'loaded') {
		setGame(result.state)
		return 'loaded'
	}

	const hasUnreadableSave = result.status === 'incompatible' || result.status === 'invalid'
	if (hasUnreadableSave) await backupUnreadableSave()
	await startNewGame()
	return hasUnreadableSave ? 'replacedIncompatible' : 'newGame'
}

export const careForMinion = (minionId: string, action: CareActionIdT) => {
	const result = performCareAction(requireGame(), minionId, action)
	setGame(result.nextState)
	return result.outcome
}

export const assignMinion = (minionId: string, assignment: ActivityAssignmentT) => {
	const result = assignActivity(requireGame(), minionId, assignment)
	setGame(result.nextState)
	return result.issue
}

// Phase 10 of the day: the client saves right after the sim advances.
export const endDay = async () => {
	const result = advanceDay(requireGame())
	await setGameAndSaveNow(result.nextState)
	return result.report
}

export const importSave = async (file: File) => {
	const result = await parseSaveFile(file)
	if (result.status !== 'loaded') return result.status
	await setGameAndSaveNow(result.state)
	return 'loaded'
}
