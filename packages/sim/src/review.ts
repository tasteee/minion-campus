import { getEquipment } from '@minion-campus/content'
import { findEquipmentInstance, getAssignment } from './assignments'
import { simConfig } from './config'
import type { ActivityAssignmentT, GameStateT, MinionT } from './types'

export type ReviewWarningT = 'hungry' | 'lonely' | 'tiredTraining' | 'notCaredFor'

export type MinionReviewT = {
	minionId: string
	name: string
	assignmentLabel: string
	warnings: ReviewWarningT[]
}

const basicActivityLabels = {
	idle: 'Free time',
	rest: 'Rest',
	play: 'Play'
}

export const getAssignmentLabel = (state: GameStateT, assignment: ActivityAssignmentT) => {
	if (assignment.activity !== 'equipment') return basicActivityLabels[assignment.activity]
	const instance = findEquipmentInstance(state, assignment.equipmentInstanceId)
	const equipmentEntry = instance ? getEquipment(instance.equipmentId) : undefined
	return equipmentEntry?.name ?? 'Free time'
}

const isTrainingAssignment = (state: GameStateT, assignment: ActivityAssignmentT) => {
	if (assignment.activity !== 'equipment') return false
	const instance = findEquipmentInstance(state, assignment.equipmentInstanceId)
	return getEquipment(instance?.equipmentId ?? '')?.kind === 'training'
}

const getWarnings = (state: GameStateT, minion: MinionT) => {
	const thresholds = simConfig.review
	const assignment = getAssignment(state, minion.id)
	const care = minion.todayCare
	const warnings: ReviewWarningT[] = []
	if (minion.needs.hunger >= thresholds.hungryAt) warnings.push('hungry')
	if (minion.needs.affection < thresholds.lonelyBelow) warnings.push('lonely')
	if (minion.needs.energy < thresholds.tiredBelow && isTrainingAssignment(state, assignment)) warnings.push('tiredTraining')
	if (care.fed + care.petted + care.played === 0) warnings.push('notCaredFor')
	return warnings
}

// What the player should see before ending the day. Warnings never block.
export const getEndDayReview = (state: GameStateT): MinionReviewT[] =>
	state.minions
		.filter((minion) => minion.isAlive)
		.map((minion) => ({
			minionId: minion.id,
			name: minion.name,
			assignmentLabel: getAssignmentLabel(state, getAssignment(state, minion.id)),
			warnings: getWarnings(state, minion)
		}))
