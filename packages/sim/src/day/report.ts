import type { CalendarDateT } from '../calendar'

export type ReportToneT = 'info' | 'good' | 'warning' | 'sad'

export type ReportEntryKindT =
	| 'training'
	| 'overtraining'
	| 'needWarning'
	| 'bonded'
	| 'lifeStage'
	| 'died'
	| 'calendar'

export type ReportEntryT = {
	kind: ReportEntryKindT
	tone: ReportToneT
	minionId: string | null
	message: string
}

export type DayReportT = {
	endedDate: CalendarDateT
	newDate: CalendarDateT
	entries: ReportEntryT[]
}

export type ReportBuilderT = {
	add: (entry: ReportEntryT) => void
	getEntries: () => ReportEntryT[]
}

export const createReportBuilder = (): ReportBuilderT => {
	const entries: ReportEntryT[] = []

	return {
		add: (entry) => {
			entries.push(entry)
		},
		getEntries: () => entries
	}
}
