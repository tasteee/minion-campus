import type { SpeciesT, StatBlockT } from '@minion-campus/content'
import { genderIds, getSpecies, minionNamePool, personalityIds, statIds, traitIds, traits } from '@minion-campus/content'
import { simConfig } from '../config'
import { clampNeed } from '../needs'
import type { RngT } from '../random'
import { randomBetween, randomChance, randomInt, randomPick } from '../random'
import type { AppearanceT, MinionOriginT, MinionT, PatternIdT } from '../types'
import { getLifeStage } from './lifeStage'
import { getTraitModifiers } from './modifiers'

export type CreateMinionOptionsT = {
	id: string
	speciesId: string
	origin: MinionOriginT
	bornOnDay: number
	name?: string
	genderId?: string
	personalityId?: string
	traitIds?: string[]
	parentIds?: string[]
}

const patternIds: PatternIdT[] = ['none', 'spots', 'stripes', 'patches']

const rollAppearance = (rng: RngT, speciesEntry: SpeciesT, isUnusualColor: boolean): AppearanceT => {
	const hueRange = speciesEntry.hueRange
	const baseHue = randomBetween(rng, hueRange.min, hueRange.max)
	const primaryHue = isUnusualColor ? randomBetween(rng, 0, 360) : baseHue

	return {
		size: rng.next(),
		chunkiness: rng.next(),
		muscularity: rng.next(),
		earLength: rng.next(),
		hornSize: rng.next(),
		tailLength: rng.next(),
		primaryHue: primaryHue % 360,
		secondaryHue: (primaryHue + randomBetween(rng, 20, 160)) % 360,
		saturation: randomBetween(rng, 0.35, 0.8),
		lightness: randomBetween(rng, 0.55, 0.85),
		pattern: randomPick(rng, patternIds),
		patternDensity: rng.next()
	}
}

const rollStatPotential = (rng: RngT): StatBlockT => {
	const genetics = simConfig.genetics
	const entries = statIds.map((statId) => [statId, randomBetween(rng, genetics.statPotentialMin, genetics.statPotentialMax)])
	return Object.fromEntries(entries) as StatBlockT
}

const rollStartingStats = (rng: RngT, speciesEntry: SpeciesT, hasStrengthTrait: boolean): StatBlockT => {
	const jitter = simConfig.genetics.startingStatJitter

	const entries = statIds.map((statId) => {
		const strengthBonus = hasStrengthTrait && statId === 'strength' ? 10 : 0
		const value = speciesEntry.baseStats[statId] + randomInt(rng, -jitter, jitter) + strengthBonus
		return [statId, Math.max(1, value)]
	})

	return Object.fromEntries(entries) as StatBlockT
}

const rollTraitIds = (rng: RngT) => {
	const rolled = traitIds.filter((traitId) => randomChance(rng, traits[traitId]?.rollChance ?? 0))
	return rolled.slice(0, simConfig.genetics.maxStartingTraits)
}

const rollLifespanBudget = (rng: RngT, speciesEntry: SpeciesT, chosenTraitIds: string[]) => {
	const naturalDays = randomInt(rng, speciesEntry.lifespanDays.min, speciesEntry.lifespanDays.max)
	return Math.round(naturalDays * getTraitModifiers(chosenTraitIds).lifespan)
}

export const createMinion = (rng: RngT, options: CreateMinionOptionsT): MinionT => {
	const speciesEntry = getSpecies(options.speciesId)
	if (!speciesEntry) throw new Error(`Unknown species: ${options.speciesId}`)
	const chosenTraitIds = options.traitIds ?? rollTraitIds(rng)
	const isUnusualColor = chosenTraitIds.includes('unusualColoration')
	const hasStrengthTrait = chosenTraitIds.includes('naturallyStrong')
	const startNeeds = simConfig.needs.start
	const lifespanBudget = rollLifespanBudget(rng, speciesEntry, chosenTraitIds)

	const minion: MinionT = {
		id: options.id,
		name: options.name ?? randomPick(rng, minionNamePool),
		speciesId: speciesEntry.id,
		genderId: options.genderId ?? randomPick(rng, genderIds),
		origin: options.origin,
		parentIds: options.parentIds ?? [],
		appearance: rollAppearance(rng, speciesEntry, isUnusualColor),
		stats: rollStartingStats(rng, speciesEntry, hasStrengthTrait),
		statPotential: rollStatPotential(rng),
		personalityId: options.personalityId ?? randomPick(rng, personalityIds),
		personalityKnowledge: 0,
		traitIds: chosenTraitIds,
		needs: {
			hunger: clampNeed(startNeeds.hunger),
			energy: clampNeed(startNeeds.energy),
			happiness: clampNeed(startNeeds.happiness),
			affection: clampNeed(startNeeds.affection),
			health: clampNeed(startNeeds.health),
			stress: clampNeed(startNeeds.stress)
		},
		trust: 0,
		bornOnDay: options.bornOnDay,
		daysLived: 0,
		lifespanBudget,
		lifespanUsed: 0,
		careAverage: 1,
		lifeStage: 'baby',
		isAlive: true,
		diedOnDay: null,
		todayCare: { fed: 0, petted: 0, played: 0 },
		history: []
	}

	minion.lifeStage = getLifeStage(minion)
	return minion
}
