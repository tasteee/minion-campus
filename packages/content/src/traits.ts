import type { PartialCareModifiersT } from './modifiers'

// Starter trait set. Inheritance rules come in M6. Values are provisional.

export type TraitT = {
	id: string
	name: string
	modifiers: PartialCareModifiersT
	// Chance (0–1) a newly made minion rolls this trait.
	rollChance: number
}

export const traits: Record<string, TraitT> = {
	naturallyStrong: { id: 'naturallyStrong', name: 'Naturally strong', modifiers: {}, rollChance: 0.08 },
	quickLearner: { id: 'quickLearner', name: 'Quick learner', modifiers: { statGain: 1.25 }, rollChance: 0.08 },
	highEndurance: { id: 'highEndurance', name: 'High endurance', modifiers: { energyDrain: 0.8 }, rollChance: 0.08 },
	lightSleeper: { id: 'lightSleeper', name: 'Light sleeper', modifiers: { energyRecovery: 0.85 }, rollChance: 0.08 },
	diseaseProne: { id: 'diseaseProne', name: 'Disease-prone', modifiers: { healthDecay: 1.4, lifespan: 0.9 }, rollChance: 0.05 },
	longLived: { id: 'longLived', name: 'Long-lived', modifiers: { lifespan: 1.2 }, rollChance: 0.05 },
	bigAppetite: { id: 'bigAppetite', name: 'Big appetite', modifiers: { hungerRate: 1.3 }, rollChance: 0.08 },
	unusualColoration: { id: 'unusualColoration', name: 'Unusual coloration', modifiers: {}, rollChance: 0.04 },
	naturallyAnxious: { id: 'naturallyAnxious', name: 'Naturally anxious', modifiers: { stressGain: 1.3 }, rollChance: 0.06 }
}

export const traitIds = Object.keys(traits)

export const getTrait = (traitId: string) => traits[traitId]
