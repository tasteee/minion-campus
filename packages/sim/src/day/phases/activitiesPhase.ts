import type { StatIdT } from '@minion-campus/content'
import { simConfig } from '../../config'
import { getCareModifiers } from '../../minions/modifiers'
import { changeNeed } from '../../needs'
import type { ActivityAssignmentT, MinionT } from '../../types'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const roundStat = (value: number) => Math.round(value * 100) / 100

const applyActivityNeeds = (minion: MinionT, assignment: ActivityAssignmentT) => {
	const effects = simConfig.activities[assignment.activity]
	const modifiers = getCareModifiers(minion)
	const energyChange = effects.energy < 0 ? effects.energy * modifiers.energyDrain : effects.energy
	const happinessChange = assignment.activity === 'play' ? effects.happiness * modifiers.playJoy : effects.happiness
	const stressChange = effects.stress > 0 ? effects.stress * modifiers.stressGain : effects.stress
	changeNeed(minion.needs, 'energy', energyChange)
	changeNeed(minion.needs, 'happiness', happinessChange)
	changeNeed(minion.needs, 'stress', stressChange)
	changeNeed(minion.needs, 'affection', effects.affection)
}

const trainStat = (context: DayContextT, minion: MinionT, stat: StatIdT) => {
	const training = simConfig.training
	const modifiers = getCareModifiers(minion)
	const isOvertrained = minion.needs.energy < training.overtrainEnergyBelow
	const overtrainFactor = isOvertrained ? training.overtrainGainMultiplier : 1
	const gain = training.baseGain * minion.statPotential[stat] * modifiers.statGain * overtrainFactor
	minion.stats[stat] = roundStat(Math.min(training.statCap, minion.stats[stat] + gain))

	context.report.add({
		kind: 'training',
		tone: 'good',
		minionId: minion.id,
		message: `${minion.name} trained ${stat} (+${gain.toFixed(1)}).`
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

// Phase 1: assigned activities and training. Training checks energy before it is spent.
export const activitiesPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		const assignment = context.assignments[minion.id] ?? { activity: 'idle' }
		if (assignment.activity === 'train') trainStat(context, minion, assignment.stat)
		applyActivityNeeds(minion, assignment)
	})
}
