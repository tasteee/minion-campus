import type { ActivityAssignmentT, GameStateT } from '@minion-campus/sim'
import { findEquipmentInstance, getEquipmentUsers } from '@minion-campus/sim'
import type { EquipmentSlotT } from '../../scenes/campus/campusLayout'
import { equipmentSlots, getRunnerPosition, getUseSpotWorld, housePosition, wanderArea } from '../../scenes/campus/campusLayout'
import { getRunningLapLength } from '../equipment/runningTrackLayout'

// View-only behavior. Picks where a minion should be and how it should move.
// Never changes sim state.

export type PoseT = 'walk' | 'idle' | 'lift' | 'think' | 'run' | 'sleep' | 'hop'

export type BehaviorStateT = {
	x: number
	y: number
	z: number
	facing: number
	targetX: number
	targetZ: number
	pauseSeconds: number
	runProgress: number
	pose: PoseT
}

export type WorkSpotT = {
	x: number
	y: number
	z: number
	facing: number
	pose: PoseT
	slot: EquipmentSlotT | null
	runnerIndex: number
}

const WALK_SPEED = 1.3
const HOP_SPEED = 2
const RUN_SPEED = 2.6
const ARRIVE_DISTANCE = 0.12

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

export const pickWanderTarget = (state: BehaviorStateT) => {
	state.targetX = randomBetween(wanderArea.minX, wanderArea.maxX)
	state.targetZ = randomBetween(wanderArea.minZ, wanderArea.maxZ)
}

export const createBehaviorState = (): BehaviorStateT => {
	const state: BehaviorStateT = { x: 0, y: 0, z: 0, facing: 0, targetX: 0, targetZ: 0, pauseSeconds: 0, runProgress: Math.random(), pose: 'idle' }
	pickWanderTarget(state)
	state.x = randomBetween(-4, 4)
	state.z = randomBetween(-2, 6)
	return state
}

const getEquipmentSpot = (game: GameStateT, minionId: string, equipmentInstanceId: string): WorkSpotT | null => {
	const instance = findEquipmentInstance(game, equipmentInstanceId)
	const slot = instance ? equipmentSlots[instance.equipmentId] : undefined
	if (!slot) return null
	const userIndex = Math.max(0, getEquipmentUsers(game, equipmentInstanceId).indexOf(minionId))
	const spot = slot.useSpots[userIndex % slot.useSpots.length]
	if (!spot) return null
	const world = getUseSpotWorld(slot, spot)
	return { x: world.x, y: world.y, z: world.z, facing: world.facing, pose: slot.pose, slot, runnerIndex: userIndex }
}

// Resting minions nap on the lawn in front of the house.
const getRestSpot = (game: GameStateT, minionId: string): WorkSpotT => {
	const restingIds = game.minions.filter((minion) => game.plannedAssignments[minion.id]?.activity === 'rest').map((minion) => minion.id)
	const index = Math.max(0, restingIds.indexOf(minionId))
	return { x: housePosition.x + 3 + index * 1.2, y: 0, z: housePosition.z + 5, facing: 0.3, pose: 'sleep', slot: null, runnerIndex: 0 }
}

export const getWorkSpot = (game: GameStateT, minionId: string, assignment: ActivityAssignmentT) => {
	if (assignment.activity === 'equipment') return getEquipmentSpot(game, minionId, assignment.equipmentInstanceId)
	if (assignment.activity === 'rest') return getRestSpot(game, minionId)
	return null
}

const turnToward = (current: number, target: number, blend: number) => {
	const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current))
	return current + difference * blend
}

// Moves toward a point. Returns true on arrival.
const stepToward = (state: BehaviorStateT, targetX: number, targetZ: number, speed: number, deltaSeconds: number) => {
	const deltaX = targetX - state.x
	const deltaZ = targetZ - state.z
	const distance = Math.hypot(deltaX, deltaZ)
	if (distance <= ARRIVE_DISTANCE) return true
	const step = Math.min(distance, speed * deltaSeconds)
	state.x += (deltaX / distance) * step
	state.z += (deltaZ / distance) * step
	state.facing = turnToward(state.facing, Math.atan2(deltaX, deltaZ), 1 - Math.exp(-10 * deltaSeconds))
	return false
}

const runLaps = (state: BehaviorStateT, spot: WorkSpotT, deltaSeconds: number) => {
	if (!spot.slot) return
	state.runProgress += (RUN_SPEED / getRunningLapLength()) * deltaSeconds
	const progress = state.runProgress + spot.runnerIndex * 0.5
	const position = getRunnerPosition(spot.slot, progress)
	const ahead = getRunnerPosition(spot.slot, progress + 0.005)
	state.x = position.x
	state.z = position.z
	state.y = spot.y
	state.facing = Math.atan2(ahead.x - position.x, ahead.z - position.z)
	state.pose = 'run'
}

// Track runners join the lane at their current lap point instead of a fixed spot.
const getArrivalPoint = (state: BehaviorStateT, spot: WorkSpotT) => {
	if (spot.pose !== 'run' || !spot.slot) return { x: spot.x, z: spot.z }
	return getRunnerPosition(spot.slot, state.runProgress + spot.runnerIndex * 0.5)
}

export const updateTowardWork = (state: BehaviorStateT, spot: WorkSpotT, deltaSeconds: number) => {
	const arrival = getArrivalPoint(state, spot)
	const hasArrived = state.pose === spot.pose || stepToward(state, arrival.x, arrival.z, WALK_SPEED * 1.3, deltaSeconds)
	if (!hasArrived) {
		state.y = 0
		state.pose = 'walk'
		return
	}

	if (spot.pose === 'run') return runLaps(state, spot, deltaSeconds)
	state.x = spot.x
	state.y = spot.y
	state.z = spot.z
	state.facing = turnToward(state.facing, spot.facing, 1 - Math.exp(-8 * deltaSeconds))
	state.pose = spot.pose
}

export const updateWander = (state: BehaviorStateT, isPlaying: boolean, deltaSeconds: number) => {
	state.y = 0
	if (state.pauseSeconds > 0) {
		state.pauseSeconds -= deltaSeconds
		state.pose = isPlaying ? 'hop' : 'idle'
		return
	}

	const speed = isPlaying ? HOP_SPEED : WALK_SPEED
	const hasArrived = stepToward(state, state.targetX, state.targetZ, speed, deltaSeconds)
	state.pose = isPlaying ? 'hop' : 'walk'
	if (!hasArrived) return
	pickWanderTarget(state)
	state.pauseSeconds = isPlaying ? randomBetween(0.5, 1.5) : randomBetween(2, 6)
}

export const faceToward = (state: BehaviorStateT, targetX: number, targetZ: number, deltaSeconds: number) => {
	const angle = Math.atan2(targetX - state.x, targetZ - state.z)
	state.facing = turnToward(state.facing, angle, 1 - Math.exp(-8 * deltaSeconds))
}

// Leaving work (assignment changed): stand up where you are and walk on.
export const leaveWork = (state: BehaviorStateT) => {
	state.y = 0
	state.pose = 'idle'
	pickWanderTarget(state)
}
