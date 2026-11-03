// Seeded RNG (mulberry32). The 32-bit state lives in GameStateT so runs are reproducible.

export type RngT = {
	next: () => number
	getState: () => number
}

export const createRng = (seedState: number): RngT => {
	let state = seedState >>> 0

	const next = () => {
		state = (state + 0x6d2b79f5) >>> 0
		let mixed = state
		mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
		mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
		return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
	}

	return { next, getState: () => state }
}

export const randomBetween = (rng: RngT, min: number, max: number) => min + rng.next() * (max - min)

export const randomInt = (rng: RngT, min: number, maxInclusive: number) =>
	Math.floor(randomBetween(rng, min, maxInclusive + 1))

export const randomChance = (rng: RngT, probability: number) => rng.next() < probability

export const randomPick = <ItemT>(rng: RngT, items: readonly ItemT[]): ItemT => {
	const item = items[Math.floor(rng.next() * items.length)]
	if (item === undefined) throw new Error('randomPick called with an empty list')
	return item
}
