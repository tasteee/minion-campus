import { simConfig } from '../../config'
import { getLifeStage, getLifespanBurnRate } from '../../minions/lifeStage'
import { getCareScore } from '../../needs'
import type { MinionT } from '../../types'
import type { DayContextT } from '../dayContext'
import { getLivingMinions } from '../dayContext'

const lifeStageMessages = {
	baby: '',
	young: 'is growing up fast.',
	adult: 'is all grown up now.',
	elder: 'is getting on in years and moves a little slower.'
}

const updateCareAverage = (minion: MinionT) => {
	const weight = simConfig.lifespan.careAverageWeight
	const todayScore = getCareScore(minion.needs)
	minion.careAverage = minion.careAverage * (1 - weight) + todayScore * weight
}

const updateLifeStage = (context: DayContextT, minion: MinionT) => {
	const nextStage = getLifeStage(minion)
	if (nextStage === minion.lifeStage) return
	minion.lifeStage = nextStage
	const message = `${minion.name} ${lifeStageMessages[nextStage]}`
	minion.history.push({ absoluteDay: context.endedDate.absoluteDay, kind: 'lifeStage', message })
	context.report.add({ kind: 'lifeStage', tone: 'info', minionId: minion.id, message })
}

const passAway = (context: DayContextT, minion: MinionT) => {
	minion.isAlive = false
	minion.diedOnDay = context.endedDate.absoluteDay
	delete context.state.plannedAssignments[minion.id]
	const message = `${minion.name} passed away peacefully in their sleep.`
	minion.history.push({ absoluteDay: context.endedDate.absoluteDay, kind: 'died', message })
	context.report.add({ kind: 'died', tone: 'sad', minionId: minion.id, message })
}

// Phase 5: one day older. Poor rolling care burns the hidden lifespan budget faster.
export const agingPhase = (context: DayContextT) => {
	getLivingMinions(context).forEach((minion) => {
		minion.daysLived += 1
		updateCareAverage(minion)
		minion.lifespanUsed += getLifespanBurnRate(minion.careAverage)
		if (minion.lifespanUsed >= minion.lifespanBudget) return passAway(context, minion)
		updateLifeStage(context, minion)
	})
}
