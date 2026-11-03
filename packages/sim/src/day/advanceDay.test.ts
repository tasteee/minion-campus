import { describe, expect, it } from 'vitest'
import { cloneState } from '../cloneState'
import { getCalendarDate } from '../calendar'
import { findMinion } from '../gameState'
import { createGameWithMinion, goodCare, runDays } from '../test/testHelpers'
import { advanceDay, dayPhases } from './advanceDay'

describe('advanceDay', () => {
	it('runs the 8 sim phases in a fixed order', () => {
		const names = dayPhases.map((phase) => phase.name)
		expect(names).toEqual([
			'activitiesPhase',
			'hungerPhase',
			'energyPhase',
			'moodPhase',
			'agingPhase',
			'healthPhase',
			'timedProcessesPhase',
			'calendarPhase'
		])
	})

	it('moves the calendar forward one day and reports both dates', () => {
		const setup = createGameWithMinion()
		const result = advanceDay(setup.nextState, {})
		expect(result.nextState.absoluteDay).toBe(setup.nextState.absoluteDay + 1)
		expect(result.report.endedDate.dayOfMonth).toBe(1)
		expect(result.report.newDate.dayOfMonth).toBe(2)
		expect(result.nextState.lastReport).toEqual(result.report)
	})

	it('makes minions hungrier and one day older', () => {
		const setup = createGameWithMinion()
		const before = findMinion(setup.nextState, setup.minionId)
		const after = findMinion(advanceDay(setup.nextState, {}).nextState, setup.minionId)
		expect(after?.needs.hunger).toBeGreaterThan(before?.needs.hunger ?? 0)
		expect(after?.daysLived).toBe(1)
	})

	it('training raises the chosen stat and reports it', () => {
		const setup = createGameWithMinion()
		const before = findMinion(setup.nextState, setup.minionId)?.stats.strength ?? 0
		const result = advanceDay(setup.nextState, { [setup.minionId]: { activity: 'train', stat: 'strength' } })
		const after = findMinion(result.nextState, setup.minionId)?.stats.strength ?? 0
		expect(after).toBeGreaterThan(before)
		expect(result.report.entries.some((entry) => entry.kind === 'training')).toBe(true)
	})

	it('overtraining a tired minion gives less and warns', () => {
		const setup = createGameWithMinion()
		const tiredState = cloneState(setup.nextState)
		const tiredMinion = findMinion(tiredState, setup.minionId)
		if (tiredMinion) tiredMinion.needs.energy = 5
		const train = { [setup.minionId]: { activity: 'train' as const, stat: 'speed' as const } }
		const freshGain = (findMinion(advanceDay(setup.nextState, train).nextState, setup.minionId)?.stats.speed ?? 0) - (findMinion(setup.nextState, setup.minionId)?.stats.speed ?? 0)
		const tiredResult = advanceDay(tiredState, train)
		const tiredGain = (findMinion(tiredResult.nextState, setup.minionId)?.stats.speed ?? 0) - (tiredMinion?.stats.speed ?? 0)
		expect(tiredGain).toBeLessThan(freshGain)
		expect(tiredResult.report.entries.some((entry) => entry.kind === 'overtraining')).toBe(true)
	})

	it('never mutates the input state', () => {
		const setup = createGameWithMinion()
		const snapshot = JSON.stringify(setup.nextState)
		advanceDay(setup.nextState, { [setup.minionId]: { activity: 'play' } })
		expect(JSON.stringify(setup.nextState)).toBe(snapshot)
	})

	it('is deterministic: same seed and inputs give identical results', () => {
		const first = runDays(createGameWithMinion(7).nextState, 60, goodCare)
		const second = runDays(createGameWithMinion(7).nextState, 60, goodCare)
		expect(JSON.stringify(second)).toBe(JSON.stringify(first))
	})

	it('produces JSON-safe state that survives a save round trip', () => {
		const result = runDays(createGameWithMinion(3).nextState, 10, goodCare)
		expect(JSON.parse(JSON.stringify(result.finalState))).toEqual(result.finalState)
	})

	it('announces a new season', () => {
		const setup = createGameWithMinion()
		const lastDayOfMay = cloneState(setup.nextState)
		lastDayOfMay.absoluteDay = 4 * 28 + 27
		expect(getCalendarDate(lastDayOfMay.absoluteDay).monthName).toBe('May')
		const result = advanceDay(lastDayOfMay, {})
		expect(result.report.entries.some((entry) => entry.kind === 'calendar' && entry.message.includes('Summer'))).toBe(true)
	})
})
