import { describe, expect, it } from 'vitest'
import { assignActivity, getAssignment, getEquipmentUsers } from './assignments'
import { advanceDay } from './day/advanceDay'
import { addNewMinion, findMinion } from './gameState'
import { getEndDayReview } from './review'
import { createGameWithMinion } from './test/testHelpers'

const createGameWithMinions = (count: number) => {
	let state = createGameWithMinion().nextState

	for (let index = 1; index < count; index += 1) {
		state = addNewMinion(state, { speciesId: 'bramblet', origin: 'debug' }).nextState
	}

	return state
}

describe('assignments', () => {
	it('starts every new campus with the four MVP equipment pieces', () => {
		const state = createGameWithMinion().nextState
		expect(state.campus.equipment.map((instance) => instance.equipmentId)).toEqual(['exerciseMachine', 'chessboard', 'runningTrack', 'napMat'])
	})

	it('allows one assignment per minion and replaces the old one', () => {
		const setup = createGameWithMinion()
		const first = assignActivity(setup.nextState, setup.minionId, { activity: 'play' }).nextState
		const second = assignActivity(first, setup.minionId, { activity: 'rest' }).nextState
		expect(getAssignment(second, setup.minionId)).toEqual({ activity: 'rest' })
	})

	it('respects equipment capacity', () => {
		const state = createGameWithMinions(3)
		const ids = state.minions.map((minion) => minion.id)
		const machine = { activity: 'equipment' as const, equipmentInstanceId: 'equipment-1' }
		const first = assignActivity(state, ids[0] ?? '', machine)
		const second = assignActivity(first.nextState, ids[1] ?? '', machine)
		expect(first.issue).toBeNull()
		expect(second.issue).toBe('equipmentFull')
		const chess = { activity: 'equipment' as const, equipmentInstanceId: 'equipment-2' }
		const chessOne = assignActivity(state, ids[0] ?? '', chess).nextState
		const chessTwo = assignActivity(chessOne, ids[1] ?? '', chess)
		expect(chessTwo.issue).toBeNull()
		expect(getEquipmentUsers(chessTwo.nextState, 'equipment-2')).toHaveLength(2)
	})

	it('lets a minion re-assign to equipment it already holds', () => {
		const setup = createGameWithMinion()
		const machine = { activity: 'equipment' as const, equipmentInstanceId: 'equipment-1' }
		const once = assignActivity(setup.nextState, setup.minionId, machine).nextState
		expect(assignActivity(once, setup.minionId, machine).issue).toBeNull()
	})

	it('rejects unknown equipment and unknown minions', () => {
		const setup = createGameWithMinion()
		expect(assignActivity(setup.nextState, setup.minionId, { activity: 'equipment', equipmentInstanceId: 'nope' }).issue).toBe('equipmentNotFound')
		expect(assignActivity(setup.nextState, 'ghost', { activity: 'rest' }).issue).toBe('minionNotFound')
	})

	it('drops the assignment of a minion that passes away', () => {
		const setup = createGameWithMinion()
		const assigned = assignActivity(setup.nextState, setup.minionId, { activity: 'play' }).nextState
		const almostGone = findMinion(assigned, setup.minionId)
		if (almostGone) almostGone.lifespanUsed = almostGone.lifespanBudget - 0.5
		const result = advanceDay(assigned)
		expect(findMinion(result.nextState, setup.minionId)?.isAlive).toBe(false)
		expect(result.nextState.plannedAssignments[setup.minionId]).toBeUndefined()
	})
})

describe('end day review', () => {
	it('lists each living minion with its plan and gentle warnings', () => {
		const setup = createGameWithMinion()
		const assigned = assignActivity(setup.nextState, setup.minionId, { activity: 'equipment', equipmentInstanceId: 'equipment-1' }).nextState
		const tired = findMinion(assigned, setup.minionId)
		if (tired) tired.needs.energy = 10
		const review = getEndDayReview(assigned)
		expect(review).toHaveLength(1)
		expect(review[0]?.assignmentLabel).toBe('Exercise Machine')
		expect(review[0]?.warnings).toContain('tiredTraining')
		expect(review[0]?.warnings).toContain('notCaredFor')
	})
})
