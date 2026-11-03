import { simConfig } from '../../config'
import { getCareModifiers } from '../../minions/modifiers'
import { changeNeed } from '../../needs'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const HUNGRY_WARNING_AT = 80

// Phase 2: hunger rises overnight. Feeding happens during the day via care actions.
export const hungerPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		const rise = simConfig.hunger.dailyRise * getCareModifiers(minion).hungerRate
		changeNeed(minion.needs, 'hunger', rise)
		if (minion.needs.hunger < HUNGRY_WARNING_AT) return

		context.report.add({
			kind: 'needWarning',
			tone: 'warning',
			minionId: minion.id,
			message: `${minion.name} woke up very hungry.`
		})
	})
}
