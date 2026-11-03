import type { StatBlockT } from '@minion-campus/content'
import type { DayReportT } from './day/report'

// Plain serializable game state. The sim is the only source of truth.

export type NeedsT = {
	hunger: number
	energy: number
	happiness: number
	affection: number
	health: number
	stress: number
}

export type PatternIdT = 'none' | 'spots' | 'stripes' | 'patches'

// Gene-driven appearance parameters (0–1 unless noted). The client turns these into a model.
export type AppearanceT = {
	size: number
	chunkiness: number
	muscularity: number
	earLength: number
	hornSize: number
	tailLength: number
	primaryHue: number
	secondaryHue: number
	saturation: number
	lightness: number
	pattern: PatternIdT
	patternDensity: number
}

export type LifeStageT = 'baby' | 'young' | 'adult' | 'elder'

export type LifeEventKindT = 'arrived' | 'bonded' | 'lifeStage' | 'died'

export type LifeEventT = {
	absoluteDay: number
	kind: LifeEventKindT
	message: string
}

export type DailyCareCountsT = {
	fed: number
	petted: number
	played: number
}

export type MinionOriginT = 'starter' | 'beckoned' | 'bred' | 'debug'

export type MinionT = {
	id: string
	name: string
	speciesId: string
	genderId: string
	origin: MinionOriginT
	parentIds: string[]
	appearance: AppearanceT
	stats: StatBlockT
	statPotential: StatBlockT
	personalityId: string
	// 0–1. How well the Headmaster understands this minion's personality.
	personalityKnowledge: number
	traitIds: string[]
	needs: NeedsT
	trust: number
	bornOnDay: number
	daysLived: number
	// Hidden. Never shown to the player.
	lifespanBudget: number
	lifespanUsed: number
	careAverage: number
	lifeStage: LifeStageT
	isAlive: boolean
	diedOnDay: number | null
	todayCare: DailyCareCountsT
	history: LifeEventT[]
}

export type HeadmasterT = {
	name: string
	daysAsHeadmaster: number
	minionsEncountered: number
	minionsRaised: number
	discoveredSpeciesIds: string[]
}

export type InventoryT = {
	food: number
}

export type EquipmentInstanceT = {
	id: string
	equipmentId: string
}

export type CampusT = {
	equipment: EquipmentInstanceT[]
}

export type GameStateT = {
	schemaVersion: number
	rngState: number
	absoluteDay: number
	nextMinionNumber: number
	money: number
	inventory: InventoryT
	campus: CampusT
	// Kept across days so routines carry over. One per minion.
	plannedAssignments: AssignmentsT
	headmaster: HeadmasterT
	minions: MinionT[]
	lastReport: DayReportT | null
}

export type ActivityAssignmentT =
	| { activity: 'idle' }
	| { activity: 'rest' }
	| { activity: 'play' }
	| { activity: 'equipment'; equipmentInstanceId: string }

// Minion id → assignment for the day being ended. Missing = idle.
export type AssignmentsT = Record<string, ActivityAssignmentT>
