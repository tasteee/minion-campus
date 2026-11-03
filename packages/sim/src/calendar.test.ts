import { describe, expect, it } from 'vitest'
import { formatCalendarDate, getCalendarDate, getDaysPerYear, getStartAbsoluteDay } from './calendar'

describe('calendar', () => {
	it('has a 336-day year', () => {
		expect(getDaysPerYear()).toBe(336)
	})

	it('starts on March 1, year 1, in spring', () => {
		const date = getCalendarDate(getStartAbsoluteDay())
		expect(date.monthName).toBe('March')
		expect(date.dayOfMonth).toBe(1)
		expect(date.year).toBe(1)
		expect(date.season).toBe('spring')
	})

	it('rolls months, seasons and years', () => {
		const lastDayOfFebruary = getCalendarDate(2 * 28 - 1)
		expect(lastDayOfFebruary.monthName).toBe('February')
		expect(lastDayOfFebruary.dayOfMonth).toBe(28)
		expect(lastDayOfFebruary.season).toBe('winter')
		const lastDayOfYear = getCalendarDate(335)
		expect(lastDayOfYear.monthName).toBe('December')
		expect(lastDayOfYear.year).toBe(1)
		const newYear = getCalendarDate(336)
		expect(newYear.monthName).toBe('January')
		expect(newYear.dayOfMonth).toBe(1)
		expect(newYear.year).toBe(2)
	})

	it('cycles weekdays and weeks of the month', () => {
		expect(getCalendarDate(0).weekday).toBe('Monday')
		expect(getCalendarDate(6).weekday).toBe('Sunday')
		expect(getCalendarDate(7).weekday).toBe('Monday')
		expect(getCalendarDate(0).weekOfMonth).toBe(1)
		expect(getCalendarDate(27).weekOfMonth).toBe(4)
	})

	it('formats a readable date', () => {
		expect(formatCalendarDate(getCalendarDate(getStartAbsoluteDay()))).toBe('Monday, March 1, Year 1')
	})
})
