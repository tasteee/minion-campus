import { simConfig } from '../../config'
import { getCareModifiers } from '../../minions/modifiers'
import { changeNeed } from '../../needs'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const SICK_WARNING_BELOW = 40

// Phase 6: starvation and stress hurt health; otherwise it slowly recovers.
export const healthPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		const settings = simConfig.health
		const healthDecay = getCareModifiers(minion).healthDecay
		const isStarving = minion.needs.hunger >= settings.starvingThreshold
		const isStressed = minion.needs.stress >= settings.stressedThreshold
		const starvingDamage = isStarving ? settings.starvingDamage : 0
		const stressDamage = isStressed ? settings.stressDamage : 0
		const damage = (starvingDamage + stressDamage) * healthDecay
		const change = damage > 0 ? -damage : settings.dailyRecovery
		changeNeed(minion.needs, 'health', change)
		if (minion.needs.health >= SICK_WARNING_BELOW) return

		context.report.add({
			kind: 'needWarning',
			tone: 'warning',
			minionId: minion.id,
			message: `${minion.name} is looking unwell.`
		})
	})
}
