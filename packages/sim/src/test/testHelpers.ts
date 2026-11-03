import { addNewMinion, createNewGame } from '../gameState'
import { feedMinion, petMinion, playWithMinion } from '../care/careActions'
import { advanceDay } from '../day/advanceDay'
import type { DayReportT } from '../day/report'
import type { AssignmentsT, GameStateT } from '../types'

export const createGameWithMinion = (seed = 42, speciesId = 'mochling') => {
	const game = createNewGame(seed)
	return addNewMinion(game, { speciesId, origin: 'debug', name: 'Testy' })
}

export type CareRoutineT = (state: GameStateT, dayNumber: number) => GameStateT

export const goodCare: CareRoutineT = (state) => {
	let nextState = state

	nextState.minions.forEach((minion) => {
		if (!minion.isAlive) return
		const fed = feedMinion(nextState, minion.id)
		nextState = fed.nextState
		nextState = petMinion(nextState, minion.id).nextState
		nextState = petMinion(nextState, minion.id).nextState
		nextState = playWithMinion(nextState, minion.id).nextState
	})

	nextState.inventory.food = 10
	return nextState
}

export const neglect: CareRoutineT = (state, dayNumber) => {
	const isFeedingDay = dayNumber % 3 === 0
	if (!isFeedingDay) return state
	let nextState = state

	nextState.minions.forEach((minion) => {
		nextState = feedMinion(nextState, minion.id).nextState
	})

	nextState.inventory.food = 10
	return nextState
}

export const runDays = (state: GameStateT, days: number, care: CareRoutineT, assignments: AssignmentsT = {}) => {
	let current = state
	const reports: DayReportT[] = []

	for (let dayNumber = 0; dayNumber < days; dayNumber += 1) {
		const cared = care(current, dayNumber)
		const result = advanceDay(cared, assignments)
		current = result.nextState
		reports.push(result.report)
	}

	return { finalState: current, reports }
}
