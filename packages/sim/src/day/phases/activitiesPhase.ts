import type { ActivityEffectsT, EquipmentT, StatIdT } from '@minion-campus/content'
import { getEquipment } from '@minion-campus/content'
import { findEquipmentInstance } from '../../assignments'
import { simConfig } from '../../config'
import { getCareModifiers } from '../../minions/modifiers'
import { changeNeed, roundToHundredths } from '../../needs'
import type { ActivityAssignmentT, MinionT } from '../../types'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const applyActivityNeeds = (minion: MinionT, effects: ActivityEffectsT, isPlay: boolean) => {
	const modifiers = getCareModifiers(minion)
	const energyChange = effects.energy < 0 ? effects.energy * modifiers.energyDrain : effects.energy
	const happinessChange = isPlay ? effects.happiness * modifiers.playJoy : effects.happiness
	const stressChange = effects.stress > 0 ? effects.stress * modifiers.stressGain : effects.stress
	changeNeed(minion.needs, 'energy', energyChange)
	changeNeed(minion.needs, 'happiness', happinessChange)
	changeNeed(minion.needs, 'stress', stressChange)
	changeNeed(minion.needs, 'affection', effects.affection)
}

const trainStat = (context: DayContextT, minion: MinionT, stat: StatIdT, equipmentEntry: EquipmentT) => {
	const training = simConfig.training
	const modifiers = getCareModifiers(minion)
	const isOvertrained = minion.needs.energy < training.overtrainEnergyBelow
	const overtrainFactor = isOvertrained ? training.overtrainGainMultiplier : 1
	const gain = training.baseGain * equipmentEntry.gainMultiplier * minion.statPotential[stat] * modifiers.statGain * overtrainFactor
	minion.stats[stat] = roundToHundredths(Math.min(training.statCap, minion.stats[stat] + gain))

	context.report.add({
		kind: 'training',
		tone: 'good',
		minionId: minion.id,
		message: `${minion.name} used the ${equipmentEntry.name} (+${gain.toFixed(1)} ${stat}).`
	})

	if (!isOvertrained) return
	changeNeed(minion.needs, 'stress', training.overtrainExtraStress * modifiers.stressGain)
	changeNeed(minion.needs, 'health', -training.overtrainHealthDamage * modifiers.healthDecay)

	context.report.add({
		kind: 'overtraining',
		tone: 'warning',
		minionId: minion.id,
		message: `${minion.name} was too tired to train well and feels worn out.`
	})
}

const getAssignedEquipment = (context: DayContextT, assignment: ActivityAssignmentT) => {
	if (assignment.activity !== 'equipment') return null
	const instance = findEquipmentInstance(context.state, assignment.equipmentInstanceId)
	if (!instance) return null
	return getEquipment(instance.equipmentId) ?? null
}

const runEquipment = (context: DayContextT, minion: MinionT, equipmentEntry: EquipmentT) => {
	if (equipmentEntry.trainedStat) trainStat(context, minion, equipmentEntry.trainedStat, equipmentEntry)
	applyActivityNeeds(minion, equipmentEntry.effects, false)
}

// Phase 1: assigned activities and training. Training checks energy before it is spent.
// Missing or invalid assignments fall back to idle.
export const activitiesPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		const assignment = context.assignments[minion.id] ?? { activity: 'idle' }
		const equipmentEntry = getAssignedEquipment(context, assignment)
		if (equipmentEntry) return runEquipment(context, minion, equipmentEntry)
		const basicActivity = assignment.activity === 'equipment' ? 'idle' : assignment.activity
		applyActivityNeeds(minion, simConfig.activities[basicActivity], basicActivity === 'play')
	})
}
