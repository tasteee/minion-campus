import { simConfig } from '../../config'
import { getCareModifiers } from '../../minions/modifiers'
import { changeNeed, getHappinessTarget, roundToHundredths } from '../../needs'
import type { MinionT } from '../../types'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const updateStress = (minion: MinionT) => {
	const settings = simConfig.stress
	const modifiers = getCareModifiers(minion)
	const isHungry = minion.needs.hunger >= settings.hungryThreshold
	const isLonely = minion.needs.affection <= settings.lonelyThreshold
	const hungryStress = isHungry ? settings.hungryStress : 0
	const lonelyStress = isLonely ? settings.lonelyStress : 0
	changeNeed(minion.needs, 'stress', (hungryStress + lonelyStress) * modifiers.stressGain - settings.dailyRelief)
}

const updateHappiness = (minion: MinionT) => {
	const target = getHappinessTarget(minion.needs)
	const drift = (target - minion.needs.happiness) * simConfig.mood.happinessDriftRate
	changeNeed(minion.needs, 'happiness', drift)
}

const wasCaredForToday = (minion: MinionT) => {
	const care = minion.todayCare
	return care.fed + care.petted + care.played > 0
}

const updateTrust = (context: DayContextT, minion: MinionT) => {
	const settings = simConfig.trust
	const wasBonded = minion.trust >= settings.bondedThreshold
	const gain = settings.dailyGainWhenCaredFor * getCareModifiers(minion).trustGain
	const change = wasCaredForToday(minion) ? gain : -settings.dailyLossWhenIgnored
	minion.trust = roundToHundredths(Math.min(settings.max, Math.max(0, minion.trust + change)))
	const isNowBonded = minion.trust >= settings.bondedThreshold
	if (wasBonded || !isNowBonded) return
	const message = `${minion.name} has really started to trust you.`
	minion.history.push({ absoluteDay: context.endedDate.absoluteDay, kind: 'bonded', message })
	context.report.add({ kind: 'bonded', tone: 'good', minionId: minion.id, message })
}

// Phase 4: affection fades, stress settles, happiness drifts, trust grows with care.
export const moodPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		const affectionDecay = simConfig.affection.dailyDecay * getCareModifiers(minion).affectionDecay
		changeNeed(minion.needs, 'affection', -affectionDecay)
		updateStress(minion)
		updateHappiness(minion)
		updateTrust(context, minion)
	})
}
