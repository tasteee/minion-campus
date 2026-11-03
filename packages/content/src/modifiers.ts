// Multipliers that personalities and traits apply to sim rules. 1 = no change.
// Combined by multiplying. All values provisional.

export type CareModifiersT = {
	hungerRate: number
	energyDrain: number
	energyRecovery: number
	affectionDecay: number
	petAffection: number
	playJoy: number
	trustGain: number
	stressGain: number
	healthDecay: number
	statGain: number
	lifespan: number
}

export type PartialCareModifiersT = Partial<CareModifiersT>

export const neutralCareModifiers: CareModifiersT = {
	hungerRate: 1,
	energyDrain: 1,
	energyRecovery: 1,
	affectionDecay: 1,
	petAffection: 1,
	playJoy: 1,
	trustGain: 1,
	stressGain: 1,
	healthDecay: 1,
	statGain: 1,
	lifespan: 1
}
