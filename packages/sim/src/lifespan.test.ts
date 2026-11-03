import { describe, expect, it } from 'vitest'
import { addNewMinion, createNewGame } from './gameState'
import type { CareRoutineT } from './test/testHelpers'
import { goodCare, neglect, runDays } from './test/testHelpers'
import type { GameStateT } from './types'

const SIM_DAYS = 1600
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88]

const createGameWithMinions = (seed: number) => {
	let state: GameStateT = createNewGame(seed)
	state = addNewMinion(state, { speciesId: 'mochling', origin: 'debug' }).nextState
	state = addNewMinion(state, { speciesId: 'bramblet', origin: 'debug' }).nextState
	return state
}

const getLifeRatios = (care: CareRoutineT) =>
	SEEDS.flatMap((seed) => {
		const result = runDays(createGameWithMinions(seed), SIM_DAYS, care)
		return result.finalState.minions.map((minion) => minion.daysLived / minion.lifespanBudget)
	})

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

describe('lifespan simulation', () => {
	it('good care lets minions reach close to their full natural lifespan', () => {
		const ratios = getLifeRatios(goodCare)
		expect(average(ratios)).toBeGreaterThan(0.95)
		ratios.forEach((ratio) => expect(ratio).toBeLessThanOrEqual(1))
	})

	it('neglect shortens lives noticeably', () => {
		const goodAverage = average(getLifeRatios(goodCare))
		const neglectAverage = average(getLifeRatios(neglect))
		expect(neglectAverage).toBeLessThan(goodAverage * 0.85)
	})

	it('a long run moves a minion through every life stage and ends in a gentle death', () => {
		const result = runDays(createGameWithMinions(5), SIM_DAYS, goodCare)
		const minion = result.finalState.minions[0]
		const stageEvents = minion?.history.filter((event) => event.kind === 'lifeStage') ?? []
		expect(stageEvents).toHaveLength(3)
		expect(minion?.isAlive).toBe(false)
		expect(result.reports.some((report) => report.entries.some((entry) => entry.kind === 'died'))).toBe(true)
	})

	it('a single bad day does not do lasting damage', () => {
		const steady = runDays(createGameWithMinions(9), 200, goodCare)
		const withBadDay = runDays(createGameWithMinions(9), 200, (state, dayNumber) => (dayNumber === 50 ? state : goodCare(state, dayNumber)))
		const steadyUsed = steady.finalState.minions[0]?.lifespanUsed ?? 0
		const badDayUsed = withBadDay.finalState.minions[0]?.lifespanUsed ?? 0
		expect(badDayUsed - steadyUsed).toBeLessThan(1)
	})
})
