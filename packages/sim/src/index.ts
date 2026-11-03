// Pure simulation package. No browser, Svelte, Three or ECS imports allowed here.

export { simConfig } from './config'
export type { ActivityIdT } from './config'
export * from './types'
export type { CalendarDateT } from './calendar'
export { getCalendarDate, formatCalendarDate, getDaysPerYear, getStartAbsoluteDay, getEventsOnDate } from './calendar'
export type { RngT } from './random'
export { createRng } from './random'
export { createNewGame, addNewMinion, findMinion } from './gameState'
export type { AddMinionOptionsT } from './gameState'
export { getCareModifiers } from './minions/modifiers'
export { getLifeStage } from './minions/lifeStage'
export type { CareActionIdT, CareOutcomeT, CareFailureReasonT } from './care/careActions'
export { performCareAction, feedMinion, petMinion, playWithMinion } from './care/careActions'
export { advanceDay, dayPhases } from './day/advanceDay'
export type { DayReportT, ReportEntryT, ReportToneT, ReportEntryKindT } from './day/report'

export const SIM_SCHEMA_VERSION = 1
