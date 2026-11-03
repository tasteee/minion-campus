import type { StatIdT } from './species'

// Campus equipment. All effect values and prices are provisional.

export type ActivityEffectsT = {
	energy: number
	happiness: number
	stress: number
	affection: number
}

export type EquipmentKindT = 'training' | 'rest'

export type EquipmentT = {
	id: string
	name: string
	description: string
	kind: EquipmentKindT
	trainedStat: StatIdT | null
	// How many minions can use it on the same day.
	capacity: number
	gainMultiplier: number
	effects: ActivityEffectsT
	price: number
}

export const equipment: Record<string, EquipmentT> = {
	exerciseMachine: {
		id: 'exerciseMachine',
		name: 'Exercise Machine',
		description: 'A sturdy bench and barbell. Builds strength, but it is hard work.',
		kind: 'training',
		trainedStat: 'strength',
		capacity: 1,
		gainMultiplier: 1,
		effects: { energy: -30, happiness: -2, stress: 8, affection: 0 },
		price: 300
	},
	chessboard: {
		id: 'chessboard',
		name: 'Chessboard',
		description: 'A thinking game. Builds intelligence. Two minions can play together.',
		kind: 'training',
		trainedStat: 'intelligence',
		capacity: 2,
		gainMultiplier: 0.9,
		effects: { energy: -15, happiness: 2, stress: 4, affection: 0 },
		price: 200
	},
	runningTrack: {
		id: 'runningTrack',
		name: 'Running Track',
		description: 'Laps and laps. Builds speed and lifts the spirits.',
		kind: 'training',
		trainedStat: 'speed',
		capacity: 2,
		gainMultiplier: 1,
		effects: { energy: -30, happiness: 3, stress: 3, affection: 0 },
		price: 400
	},
	napMat: {
		id: 'napMat',
		name: 'Nap Mat',
		description: 'A plush little bed. A day here restores far more energy than resting on the grass.',
		kind: 'rest',
		trainedStat: null,
		capacity: 1,
		gainMultiplier: 0,
		effects: { energy: 32, happiness: 3, stress: -14, affection: 0 },
		price: 150
	}
}

export const getEquipment = (equipmentId: string) => equipment[equipmentId]
