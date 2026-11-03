import { cloneState } from './cloneState'
import { getStartAbsoluteDay } from './calendar'
import { simConfig } from './config'
import type { CreateMinionOptionsT } from './minions/createMinion'
import { createMinion } from './minions/createMinion'
import { createRng } from './random'
import type { GameStateT } from './types'

export const createNewGame = (seed: number, headmasterName = 'Headmaster'): GameStateT => ({
	schemaVersion: simConfig.schemaVersion,
	rngState: seed >>> 0,
	absoluteDay: getStartAbsoluteDay(),
	nextMinionNumber: 1,
	money: simConfig.newGame.money,
	inventory: { food: simConfig.newGame.food },
	campus: {
		equipment: simConfig.newGame.equipmentIds.map((equipmentId, index) => ({ id: `equipment-${index + 1}`, equipmentId }))
	},
	plannedAssignments: {},
	headmaster: {
		name: headmasterName,
		daysAsHeadmaster: 0,
		minionsEncountered: 0,
		minionsRaised: 0,
		discoveredSpeciesIds: []
	},
	minions: [],
	lastReport: null
})

export type AddMinionOptionsT = Omit<CreateMinionOptionsT, 'id' | 'bornOnDay'>

// Returns a new state with a freshly rolled minion on campus.
export const addNewMinion = (state: GameStateT, options: AddMinionOptionsT) => {
	const nextState = cloneState(state)
	const rng = createRng(nextState.rngState)
	const minionId = `minion-${nextState.nextMinionNumber}`

	const minion = createMinion(rng, {
		...options,
		id: minionId,
		bornOnDay: nextState.absoluteDay
	})

	minion.history.push({ absoluteDay: nextState.absoluteDay, kind: 'arrived', message: `${minion.name} arrived on campus.` })
	nextState.minions.push(minion)
	nextState.nextMinionNumber += 1
	nextState.rngState = rng.getState()
	nextState.headmaster.minionsEncountered += 1
	nextState.headmaster.minionsRaised += 1
	const hasDiscovered = nextState.headmaster.discoveredSpeciesIds.includes(minion.speciesId)
	if (!hasDiscovered) nextState.headmaster.discoveredSpeciesIds.push(minion.speciesId)
	return { nextState, minionId }
}

export const findMinion = (state: GameStateT, minionId: string) =>
	state.minions.find((minion) => minion.id === minionId)
