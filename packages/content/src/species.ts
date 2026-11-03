import type { RarityT } from './rarity'

// PLACEHOLDER species so the sim can run. Real MVP species are designed in M5.

export type StatIdT = 'strength' | 'intelligence' | 'speed' | 'defense' | 'endurance' | 'accuracy'

export const statIds: StatIdT[] = ['strength', 'intelligence', 'speed', 'defense', 'endurance', 'accuracy']

export type StatBlockT = Record<StatIdT, number>

export type SpeciesT = {
	id: string
	name: string
	rarity: RarityT
	isPlaceholder: boolean
	// Natural lifespan range in days under ideal care. 336 days = 1 year.
	lifespanDays: { min: number; max: number }
	baseStats: StatBlockT
	hueRange: { min: number; max: number }
}

export const species: Record<string, SpeciesT> = {
	mochling: {
		id: 'mochling',
		name: 'Mochling',
		rarity: 'common',
		isPlaceholder: true,
		lifespanDays: { min: 672, max: 1344 },
		baseStats: { strength: 20, intelligence: 25, speed: 20, defense: 30, endurance: 30, accuracy: 20 },
		hueRange: { min: 300, max: 360 }
	},
	bramblet: {
		id: 'bramblet',
		name: 'Bramblet',
		rarity: 'common',
		isPlaceholder: true,
		lifespanDays: { min: 672, max: 1344 },
		baseStats: { strength: 30, intelligence: 15, speed: 30, defense: 20, endurance: 25, accuracy: 25 },
		hueRange: { min: 80, max: 150 }
	}
}

export const getSpecies = (speciesId: string) => species[speciesId]
