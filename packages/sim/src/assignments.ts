import { getEquipment } from '@minion-campus/content'
import { cloneState } from './cloneState'
import { findMinion } from './gameState'
import type { ActivityAssignmentT, GameStateT } from './types'

export type AssignmentIssueT = 'minionNotFound' | 'minionNotAlive' | 'equipmentNotFound' | 'equipmentFull'

export const findEquipmentInstance = (state: GameStateT, equipmentInstanceId: string) =>
	state.campus.equipment.find((instance) => instance.id === equipmentInstanceId)

// Minion ids assigned to this equipment instance.
export const getEquipmentUsers = (state: GameStateT, equipmentInstanceId: string) =>
	Object.entries(state.plannedAssignments)
		.filter((entry) => entry[1].activity === 'equipment' && entry[1].equipmentInstanceId === equipmentInstanceId)
		.map((entry) => entry[0])

const getEquipmentIssue = (state: GameStateT, minionId: string, equipmentInstanceId: string): AssignmentIssueT | null => {
	const instance = findEquipmentInstance(state, equipmentInstanceId)
	const equipmentEntry = instance ? getEquipment(instance.equipmentId) : undefined
	if (!equipmentEntry) return 'equipmentNotFound'
	const otherUsers = getEquipmentUsers(state, equipmentInstanceId).filter((userId) => userId !== minionId)
	if (otherUsers.length >= equipmentEntry.capacity) return 'equipmentFull'
	return null
}

export const getAssignmentIssue = (state: GameStateT, minionId: string, assignment: ActivityAssignmentT) => {
	const minion = findMinion(state, minionId)
	if (!minion) return 'minionNotFound'
	if (!minion.isAlive) return 'minionNotAlive'
	if (assignment.activity !== 'equipment') return null
	return getEquipmentIssue(state, minionId, assignment.equipmentInstanceId)
}

// One assignment per minion. Replaces any earlier one.
export const assignActivity = (state: GameStateT, minionId: string, assignment: ActivityAssignmentT) => {
	const issue = getAssignmentIssue(state, minionId, assignment)
	if (issue) return { nextState: state, issue }
	const nextState = cloneState(state)
	nextState.plannedAssignments[minionId] = assignment
	return { nextState, issue: null }
}

export const getAssignment = (state: GameStateT, minionId: string): ActivityAssignmentT =>
	state.plannedAssignments[minionId] ?? { activity: 'idle' }
