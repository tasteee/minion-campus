// Calendar content. Decided: Jan–Dec, 28 days each, northern seasons.

export type SeasonIdT = 'spring' | 'summer' | 'autumn' | 'winter'

export type MonthT = {
	name: string
	season: SeasonIdT
}

export type CalendarConfigT = {
	daysPerWeek: number
	daysPerMonth: number
	months: MonthT[]
	weekdayNames: string[]
	startMonthIndex: number
	startDayOfMonth: number
	startYear: number
}

export const calendarConfig: CalendarConfigT = {
	daysPerWeek: 7,
	daysPerMonth: 28,
	months: [
		{ name: 'January', season: 'winter' },
		{ name: 'February', season: 'winter' },
		{ name: 'March', season: 'spring' },
		{ name: 'April', season: 'spring' },
		{ name: 'May', season: 'spring' },
		{ name: 'June', season: 'summer' },
		{ name: 'July', season: 'summer' },
		{ name: 'August', season: 'summer' },
		{ name: 'September', season: 'autumn' },
		{ name: 'October', season: 'autumn' },
		{ name: 'November', season: 'autumn' },
		{ name: 'December', season: 'winter' }
	],
	weekdayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
	// Provisional: new games start March 1, year 1 (first day of Spring).
	startMonthIndex: 2,
	startDayOfMonth: 1,
	startYear: 1
}

export type CalendarEventT = {
	id: string
	name: string
	monthIndex: number
	dayOfMonth: number
}

// Scheduled events (festivals etc.) go here. None yet: festivals are future work.
export const calendarEvents: CalendarEventT[] = []
