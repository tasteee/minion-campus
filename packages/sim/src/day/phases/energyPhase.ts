import { simConfig } from '../../config'
import { getCareModifiers } from '../../minions/modifiers'
import { changeNeed } from '../../needs'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const EXHAUSTED_WARNING_BELOW = 15

// Phase 3: overnight sleep restores energy.
export const energyPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		const wasExhausted = minion.needs.energy < EXHAUSTED_WARNING_BELOW
		const recovery = simConfig.energy.nightlyRecovery * getCareModifiers(minion).energyRecovery
		changeNeed(minion.needs, 'energy', recovery)
		if (!wasExhausted) return

		context.report.add({
			kind: 'needWarning',
			tone: 'warning',
			minionId: minion.id,
			message: `${minion.name} was exhausted by bedtime.`
		})
	})
}
