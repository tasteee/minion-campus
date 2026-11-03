import { simConfig } from './config'
import type { NeedsT } from './types'

export const roundToHundredths = (value: number) => Math.round(value * 100) / 100

export const clampNeed = (value: number) =>
	roundToHundredths(Math.min(simConfig.needs.max, Math.max(simConfig.needs.min, value)))

export const changeNeed = (needs: NeedsT, need: keyof NeedsT, amount: number) => {
	needs[need] = clampNeed(needs[need] + amount)
}

// 0–1 snapshot of how well-off a minion is today. Feeds the rolling care average.
export const getCareScore = (needs: NeedsT) => {
	const parts = [100 - needs.hunger, needs.energy, needs.happiness, needs.affection, needs.health, 100 - needs.stress]
	const total = parts.reduce((sum, part) => sum + part, 0)
	return total / (parts.length * 100)
}

// Where happiness drifts toward when nothing else happens.
export const getHappinessTarget = (needs: NeedsT) => {
	const parts = [100 - needs.hunger, needs.energy, needs.affection, needs.health, 100 - needs.stress]
	return parts.reduce((sum, part) => sum + part, 0) / parts.length
}
