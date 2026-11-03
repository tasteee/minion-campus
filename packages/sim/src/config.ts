// ALL VALUES PROVISIONAL. Tuning lives here so balancing never touches rule code.
// Needs run 0–100. hunger and stress are "bad when high"; the rest are "good when high".

export const simConfig = {
	schemaVersion: 2,

	newGame: {
		money: 500,
		// Generous until the town shop exists (M5).
		food: 30,
		equipmentIds: ['exerciseMachine', 'chessboard', 'runningTrack', 'napMat']
	},

	needs: {
		min: 0,
		max: 100,
		start: { hunger: 20, energy: 80, happiness: 70, affection: 50, health: 100, stress: 10 }
	},

	hunger: {
		dailyRise: 35,
		feedAmount: 40,
		// Below this the minion is not hungry and refuses food (no food used).
		refuseBelow: 10
	},

	energy: {
		nightlyRecovery: 45
	},

	affection: {
		dailyDecay: 15,
		petAmount: 12,
		playAmount: 8,
		// Each repeat of the same action today is worth this much of the last.
		repeatFalloff: 0.6
	},

	// Care beyond these counts per day has no effect: the minion is content.
	careDailyLimits: {
		pet: 3,
		play: 2
	},

	play: {
		happinessAmount: 8,
		energyCost: 5
	},

	trust: {
		max: 100,
		dailyGainWhenCaredFor: 2,
		dailyLossWhenIgnored: 1,
		bondedThreshold: 50
	},

	mood: {
		// How far happiness moves toward its target each day (0–1).
		happinessDriftRate: 0.3
	},

	stress: {
		dailyRelief: 5,
		hungryThreshold: 70,
		hungryStress: 8,
		lonelyThreshold: 25,
		lonelyStress: 5
	},

	health: {
		starvingThreshold: 80,
		starvingDamage: 6,
		stressedThreshold: 80,
		stressDamage: 3,
		dailyRecovery: 2
	},

	activities: {
		idle: { energy: -5, happiness: 0, stress: -2, affection: 0 },
		rest: { energy: 20, happiness: 0, stress: -10, affection: 0 },
		play: { energy: -15, happiness: 12, stress: -6, affection: 4 }
	},

	training: {
		baseGain: 3,
		overtrainEnergyBelow: 30,
		overtrainGainMultiplier: 0.4,
		overtrainExtraStress: 12,
		overtrainHealthDamage: 3,
		statCap: 999
	},

	genetics: {
		statPotentialMin: 0.7,
		statPotentialMax: 1.3,
		startingStatJitter: 5,
		maxStartingTraits: 2
	},

	lifespan: {
		// Rolling care average: weight of today's care score (0–1).
		careAverageWeight: 0.1,
		// At or above this rolling care average, aging runs at normal speed.
		goodCareThreshold: 0.7,
		// At zero care, aging runs this much faster (1 = double speed).
		maxExtraBurn: 1,
		// Life stage by fraction of lifespan budget used.
		stageThresholds: { young: 0.08, adult: 0.3, elder: 0.75 }
	},

	personality: {
		revealPerInteraction: 0.05,
		hintAt: 0.3,
		fullAt: 0.8
	},

	// Thresholds for the End Day review. They only warn; they never block.
	review: {
		hungryAt: 60,
		lonelyBelow: 30,
		tiredBelow: 30
	}
} as const

export type BasicActivityIdT = keyof typeof simConfig.activities
