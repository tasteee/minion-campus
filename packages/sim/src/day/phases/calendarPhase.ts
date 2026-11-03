import type { DayContextT } from '../dayContext'

// Phase 8: move to the next day and clear per-day counters.
export const calendarPhase = (context: DayContextT) => {
	context.state.absoluteDay += 1
	context.state.headmaster.daysAsHeadmaster += 1

	context.state.minions.forEach((minion) => {
		minion.todayCare = { fed: 0, petted: 0, played: 0 }
	})
}
