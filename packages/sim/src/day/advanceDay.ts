import { cloneState } from '../cloneState'
import { getCalendarDate } from '../calendar'
import { createRng } from '../random'
import type { AssignmentsT, GameStateT } from '../types'
import type { DayContextT, DayPhaseT } from './dayContext'
import { activitiesPhase } from './phases/activitiesPhase'
import { agingPhase } from './phases/agingPhase'
import { calendarPhase } from './phases/calendarPhase'
import { energyPhase } from './phases/energyPhase'
import { healthPhase } from './phases/healthPhase'
import { hungerPhase } from './phases/hungerPhase'
import { moodPhase } from './phases/moodPhase'
import { timedProcessesPhase } from './phases/timedProcessesPhase'
import type { DayReportT } from './report'
import { createReportBuilder } from './report'

// Fixed order (GDD §3.4). Phase 9 (report) is assembled below.
// Phase 10 (save) belongs to the client: it autosaves the returned state.
export const dayPhases: DayPhaseT[] = [
	activitiesPhase,
	hungerPhase,
	energyPhase,
	moodPhase,
	agingPhase,
	healthPhase,
	timedProcessesPhase,
	calendarPhase
]

const addSeasonChangeEntry = (context: DayContextT, report: DayReportT) => {
	if (report.newDate.season === report.endedDate.season) return
	const seasonName = report.newDate.season[0]?.toUpperCase() + report.newDate.season.slice(1)
	context.report.add({ kind: 'calendar', tone: 'info', minionId: null, message: `${seasonName} has arrived on campus.` })
}

export const advanceDay = (state: GameStateT, assignments: AssignmentsT = state.plannedAssignments) => {
	const draft = cloneState(state)
	const rng = createRng(draft.rngState)

	const context: DayContextT = {
		state: draft,
		assignments,
		rng,
		report: createReportBuilder(),
		endedDate: getCalendarDate(draft.absoluteDay)
	}

	dayPhases.forEach((phase) => phase(context))

	const report: DayReportT = {
		endedDate: context.endedDate,
		newDate: getCalendarDate(draft.absoluteDay),
		entries: context.report.getEntries()
	}

	addSeasonChangeEntry(context, report)
	draft.rngState = rng.getState()
	draft.lastReport = report
	return { nextState: draft, report }
}
