import { simConfig } from '../config'
import type { LifeStageT, MinionT } from '../types'

export const getLifeStage = (minion: Pick<MinionT, 'lifespanUsed' | 'lifespanBudget'>): LifeStageT => {
	const thresholds = simConfig.lifespan.stageThresholds
	const fractionUsed = minion.lifespanUsed / minion.lifespanBudget
	if (fractionUsed >= thresholds.elder) return 'elder'
	if (fractionUsed >= thresholds.adult) return 'adult'
	if (fractionUsed >= thresholds.young) return 'young'
	return 'baby'
}

// Poor rolling care makes the lifespan budget burn faster. Good care burns at 1×.
export const getLifespanBurnRate = (careAverage: number) => {
	const settings = simConfig.lifespan
	const shortfall = Math.max(0, settings.goodCareThreshold - careAverage) / settings.goodCareThreshold
	return 1 + shortfall * settings.maxExtraBurn
}
