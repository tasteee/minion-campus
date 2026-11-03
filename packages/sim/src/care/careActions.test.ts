import { describe, expect, it } from 'vitest'
import { cloneState } from '../cloneState'
import { simConfig } from '../config'
import { advanceDay } from '../day/advanceDay'
import { findMinion } from '../gameState'
import { createGameWithMinion } from '../test/testHelpers'
import { feedMinion, petMinion, playWithMinion } from './careActions'

describe('care actions', () => {
	it('feeding lowers hunger and uses one food', () => {
		const setup = createGameWithMinion()
		const hungryState = cloneState(setup.nextState)
		const hungryMinion = findMinion(hungryState, setup.minionId)
		if (hungryMinion) hungryMinion.needs.hunger = 60
		const result = feedMinion(hungryState, setup.minionId)
		expect(result.outcome.isSuccess).toBe(true)
		expect(findMinion(result.nextState, setup.minionId)?.needs.hunger).toBe(60 - simConfig.hunger.feedAmount)
		expect(result.nextState.inventory.food).toBe(hungryState.inventory.food - 1)
	})

	it('refuses food when not hungry and keeps the food', () => {
		const setup = createGameWithMinion()
		const fullState = cloneState(setup.nextState)
		const fullMinion = findMinion(fullState, setup.minionId)
		if (fullMinion) fullMinion.needs.hunger = 0
		const result = feedMinion(fullState, setup.minionId)
		expect(result.outcome.failureReason).toBe('notHungry')
		expect(result.nextState.inventory.food).toBe(fullState.inventory.food)
	})

	it('cannot feed without food', () => {
		const setup = createGameWithMinion()
		const emptyState = cloneState(setup.nextState)
		emptyState.inventory.food = 0
		expect(feedMinion(emptyState, setup.minionId).outcome.failureReason).toBe('noFood')
	})

	it('repeated petting gives less each time', () => {
		const setup = createGameWithMinion()
		const lonelyState = cloneState(setup.nextState)
		const lonelyMinion = findMinion(lonelyState, setup.minionId)
		if (lonelyMinion) lonelyMinion.needs.affection = 0
		const first = petMinion(lonelyState, setup.minionId)
		const second = petMinion(first.nextState, setup.minionId)
		const firstGain = first.outcome.needChanges.affection ?? 0
		const secondGain = second.outcome.needChanges.affection ?? 0
		expect(firstGain).toBeGreaterThan(0)
		expect(secondGain).toBeLessThan(firstGain)
	})

	it('stops helping after the daily limit', () => {
		const setup = createGameWithMinion()
		let state = setup.nextState

		for (let index = 0; index < simConfig.careDailyLimits.pet; index += 1) {
			state = petMinion(state, setup.minionId).nextState
		}

		const extra = petMinion(state, setup.minionId)
		expect(extra.outcome.isSuccess).toBe(false)
		expect(extra.outcome.failureReason).toBe('dailyLimit')
		expect(extra.nextState).toBe(state)
	})

	it('resets the daily limit on a new day', () => {
		const setup = createGameWithMinion()
		let state = setup.nextState

		for (let index = 0; index < simConfig.careDailyLimits.play; index += 1) {
			state = playWithMinion(state, setup.minionId).nextState
		}

		state = advanceDay(state).nextState
		expect(playWithMinion(state, setup.minionId).outcome.isSuccess).toBe(true)
	})

	it('never mutates the input state', () => {
		const setup = createGameWithMinion()
		const snapshot = JSON.stringify(setup.nextState)
		playWithMinion(setup.nextState, setup.minionId)
		petMinion(setup.nextState, setup.minionId)
		expect(JSON.stringify(setup.nextState)).toBe(snapshot)
	})

	it('slowly reveals personality through interaction', () => {
		const setup = createGameWithMinion()
		const petted = petMinion(setup.nextState, setup.minionId).nextState
		expect(findMinion(petted, setup.minionId)?.personalityKnowledge).toBeGreaterThan(0)
	})
})
