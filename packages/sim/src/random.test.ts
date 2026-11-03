import { describe, expect, it } from 'vitest'
import { createRng, randomInt } from './random'

const takeSequence = (seed: number, count: number) => {
	const rng = createRng(seed)
	return Array.from({ length: count }, () => rng.next())
}

describe('seeded rng', () => {
	it('repeats the same sequence for the same seed', () => {
		expect(takeSequence(123, 20)).toEqual(takeSequence(123, 20))
	})

	it('gives different sequences for different seeds', () => {
		expect(takeSequence(1, 5)).not.toEqual(takeSequence(2, 5))
	})

	it('resumes exactly from a saved state', () => {
		const rng = createRng(99)
		rng.next()
		rng.next()
		const resumed = createRng(rng.getState())
		expect(resumed.next()).toBe(rng.next())
	})

	it('stays in [0, 1) and randomInt stays in range', () => {
		const rng = createRng(7)

		for (let index = 0; index < 2000; index += 1) {
			const value = rng.next()
			expect(value).toBeGreaterThanOrEqual(0)
			expect(value).toBeLessThan(1)
			const integer = randomInt(rng, 3, 6)
			expect(integer).toBeGreaterThanOrEqual(3)
			expect(integer).toBeLessThanOrEqual(6)
		}
	})
})
