import { getRunningPoint } from '../../world/equipment/runningTrackLayout'

// View layout of the campus. Positions are presentation only; the sim never sees them.

export type Vector2LikeT = { x: number; z: number }

export type UseSpotT = {
	// Local to the equipment.
	x: number
	y: number
	z: number
	facing: number
}

export type EquipmentSlotT = {
	equipmentId: string
	position: Vector2LikeT
	rotationY: number
	interactRadius: number
	collider: { halfX: number; halfY: number; halfZ: number } | null
	useSpots: UseSpotT[]
	pose: 'lift' | 'think' | 'run' | 'sleep'
}

export const campusHalfSize = 22

export const playerSpawn = { x: 0, y: 1.5, z: 9 }

export const housePosition: Vector2LikeT = { x: 0, z: -13 }

export const equipmentSlots: Record<string, EquipmentSlotT> = {
	exerciseMachine: {
		equipmentId: 'exerciseMachine',
		position: { x: 8, z: 0 },
		rotationY: -Math.PI / 2,
		interactRadius: 2.2,
		collider: { halfX: 1.05, halfY: 0.55, halfZ: 0.7 },
		useSpots: [{ x: 0, y: 0.62, z: 0.55, facing: Math.PI }],
		pose: 'lift'
	},
	chessboard: {
		equipmentId: 'chessboard',
		position: { x: 8.5, z: 7 },
		rotationY: 0,
		interactRadius: 2.2,
		collider: { halfX: 0.85, halfY: 0.3, halfZ: 0.85 },
		useSpots: [
			{ x: 0, y: 0.22, z: 1.2, facing: Math.PI },
			{ x: 0, y: 0.22, z: -1.2, facing: 0 }
		],
		pose: 'think'
	},
	runningTrack: {
		equipmentId: 'runningTrack',
		position: { x: -10, z: 3 },
		rotationY: 0,
		interactRadius: 3.6,
		collider: null,
		useSpots: [
			{ x: 0, y: 0.08, z: 0, facing: 0 },
			{ x: 0, y: 0.08, z: 0, facing: 0 }
		],
		pose: 'run'
	},
	napMat: {
		equipmentId: 'napMat',
		position: { x: -4.5, z: -8.5 },
		rotationY: 0.4,
		interactRadius: 1.8,
		collider: { halfX: 0.65, halfY: 0.25, halfZ: 0.65 },
		useSpots: [{ x: 0, y: 0.2, z: 0, facing: 0.6 }],
		pose: 'sleep'
	}
}

// World position of a use spot (applies the slot's rotation).
export const getUseSpotWorld = (slot: EquipmentSlotT, spot: UseSpotT) => {
	const cos = Math.cos(slot.rotationY)
	const sin = Math.sin(slot.rotationY)

	return {
		x: slot.position.x + spot.x * cos + spot.z * sin,
		y: spot.y,
		z: slot.position.z - spot.x * sin + spot.z * cos,
		facing: spot.facing + slot.rotationY
	}
}

// Runners share the yellow lane, spread out along it.
export const getRunnerPosition = (slot: EquipmentSlotT, progress: number) => {
	const point = getRunningPoint(progress)
	return { x: slot.position.x + point.x, z: slot.position.z + point.y }
}

export const trees: Vector2LikeT[] = [
	{ x: -19, z: -18 }, { x: -12, z: -19 }, { x: 9, z: -19 }, { x: 17, z: -17 }, { x: 19, z: -8 },
	{ x: 19.5, z: 3 }, { x: 18, z: 14 }, { x: 11, z: 19 }, { x: -3, z: 19.5 }, { x: -12, z: 18 },
	{ x: -19, z: 12 }, { x: -19.5, z: -4 }, { x: 14, z: -11 }, { x: -16, z: -11 }
]

export const flowerPatches: Vector2LikeT[] = [
	{ x: 4, z: -9 }, { x: -7, z: -4 }, { x: 3, z: 4 }, { x: 13, z: 12 }, { x: -3, z: 14 },
	{ x: 15, z: -4 }, { x: -15, z: 12 }, { x: 6, z: -15 }
]

// Sandy paths drawn as rounded strips: from, to, width.
export const paths = [
	{ from: { x: 0, z: 12 }, to: { x: 0, z: -10 }, width: 1.8 },
	{ from: { x: 0, z: 2 }, to: { x: 7, z: 2 }, width: 1.4 },
	{ from: { x: 0, z: 6 }, to: { x: 7, z: 7 }, width: 1.4 },
	{ from: { x: 0, z: 4 }, to: { x: -4.5, z: 4 }, width: 1.4 },
	{ from: { x: 0, z: -7 }, to: { x: -3.5, z: -8 }, width: 1.2 }
]

// Where wandering minions may roam (keeps them off the house and the far edges).
export const wanderArea = { minX: -16, maxX: 16, minZ: -9, maxZ: 15 }

export const pipPosition: [number, number, number] = [2.5, 0, 10.5]

export const signPosition: [number, number, number] = [-2, 0, 11.5]
