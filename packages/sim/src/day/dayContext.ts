import type { CalendarDateT } from '../calendar'
import type { RngT } from '../random'
import type { AssignmentsT, GameStateT, MinionT } from '../types'
import type { ReportBuilderT } from './report'

// Shared by every phase. Phases mutate the draft state, never the caller's state.
export type DayContextT = {
	state: GameStateT
	assignments: AssignmentsT
	rng: RngT
	report: ReportBuilderT
	endedDate: CalendarDateT
}

export type DayPhaseT = (context: DayContextT) => void

export const getLivingMinions = (context: DayContextT): MinionT[] =>
	context.state.minions.filter((minion) => minion.isAlive)
