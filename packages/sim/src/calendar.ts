import type { CalendarConfigT, CalendarEventT, SeasonIdT } from '@minion-campus/content'
import { calendarConfig } from '@minion-campus/content'

// Days are counted from January 1, year 1 = absolute day 0.

export type CalendarDateT = {
	absoluteDay: number
	year: number
	monthIndex: number
	monthName: string
	dayOfMonth: number
	season: SeasonIdT
	weekday: string
	weekOfMonth: number
}

export const getDaysPerYear = (config: CalendarConfigT = calendarConfig) => config.daysPerMonth * config.months.length

export const getStartAbsoluteDay = (config: CalendarConfigT = calendarConfig) => {
	const yearOffset = (config.startYear - 1) * getDaysPerYear(config)
	const monthOffset = config.startMonthIndex * config.daysPerMonth
	return yearOffset + monthOffset + config.startDayOfMonth - 1
}

export const getCalendarDate = (absoluteDay: number, config: CalendarConfigT = calendarConfig): CalendarDateT => {
	const daysPerYear = getDaysPerYear(config)
	const dayOfYear = absoluteDay % daysPerYear
	const monthIndex = Math.floor(dayOfYear / config.daysPerMonth)
	const month = config.months[monthIndex]
	if (!month) throw new Error(`No month at index ${monthIndex}`)
	const dayOfMonth = (dayOfYear % config.daysPerMonth) + 1
	const weekdayIndex = absoluteDay % config.daysPerWeek

	return {
		absoluteDay,
		year: Math.floor(absoluteDay / daysPerYear) + 1,
		monthIndex,
		monthName: month.name,
		dayOfMonth,
		season: month.season,
		weekday: config.weekdayNames[weekdayIndex] ?? '',
		weekOfMonth: Math.floor((dayOfMonth - 1) / config.daysPerWeek) + 1
	}
}

export const formatCalendarDate = (date: CalendarDateT) =>
	`${date.weekday}, ${date.monthName} ${date.dayOfMonth}, Year ${date.year}`

export const getEventsOnDate = (date: CalendarDateT, events: readonly CalendarEventT[]) =>
	events.filter((event) => event.monthIndex === date.monthIndex && event.dayOfMonth === date.dayOfMonth)
