import type { PoseT } from '../minionBehavior'

// Joint targets for the Smudge rig. Pure: pose + time + blend state in, angles out.
// Angles in radians. Leg rotation.x: 0 = straight down, -π/2 = straight forward.

export const smudgeDimensions = {
	hipStandY: 0.29,
	hipSitY: 0.12,
	hipSpread: 0.11,
	bodyCenterY: 0.17,
	headY: 0.6,
	shoulderY: 0.31,
	shoulderX: 0.19
} as const

export type RigStateT = {
	// 0 = standing, 1 = sitting. Eased toward the target each frame.
	sitAmount: number
	walkPhase: number
	blinkSeconds: number
	earTwitchSeconds: number
}

export type RigPoseT = {
	hipY: number
	hipLean: number
	headTilt: number
	headTurn: number
	leftLeg: number
	rightLeg: number
	legSplay: number
	leftArm: number
	rightArm: number
	armSpread: number
	leftEar: number
	rightEar: number
	eyeOpen: number
	tailWag: number
	breathe: number
}

const SIT_SPEED = 3.2
const sittingPoses: PoseT[] = ['idle', 'think', 'sleep']
const movingPoses: PoseT[] = ['walk', 'run', 'hop']

export const createRigState = (): RigStateT => ({
	sitAmount: 1,
	walkPhase: 0,
	blinkSeconds: 2 + Math.random() * 3,
	earTwitchSeconds: 3 + Math.random() * 4
})

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

// Overshoots then settles: this is the "plop" when sitting down.
const easeOutBack = (value: number) => {
	const overshoot = 1.9
	const shifted = value - 1
	return 1 + (overshoot + 1) * shifted ** 3 + overshoot * shifted ** 2
}

const getStandingLean = (pose: PoseT, isMoving: boolean) => {
	if (pose === 'run') return 0.22
	if (isMoving) return 0.08
	return 0
}

const getStepRate = (pose: PoseT) => {
	if (pose === 'run') return 15
	if (pose === 'hop') return 11
	return 9
}

const advanceTimers = (state: RigStateT, pose: PoseT, deltaSeconds: number) => {
	const isSitting = sittingPoses.includes(pose)
	const sitTarget = isSitting ? 1 : 0
	const sitStep = SIT_SPEED * deltaSeconds
	state.sitAmount = Math.min(1, Math.max(0, state.sitAmount + Math.sign(sitTarget - state.sitAmount) * sitStep))
	if (movingPoses.includes(pose)) state.walkPhase += getStepRate(pose) * deltaSeconds
	state.blinkSeconds -= deltaSeconds
	state.earTwitchSeconds -= deltaSeconds
	if (state.blinkSeconds < -0.14) state.blinkSeconds = 2.5 + Math.random() * 3.5
	if (state.earTwitchSeconds < -0.3) state.earTwitchSeconds = 3 + Math.random() * 5
}

const getEyeOpen = (state: RigStateT, pose: PoseT) => {
	if (pose === 'sleep') return 0.08
	const isBlinking = state.blinkSeconds < 0
	return isBlinking ? 0.1 : 1
}

const getEarTwitch = (state: RigStateT) => {
	const isTwitching = state.earTwitchSeconds < 0
	return isTwitching ? Math.sin(state.earTwitchSeconds * 40) * 0.25 : 0
}

export const computeRigPose = (state: RigStateT, pose: PoseT, time: number, deltaSeconds: number): RigPoseT => {
	advanceTimers(state, pose, deltaSeconds)
	const sit = easeOutBack(state.sitAmount)
	const isMoving = movingPoses.includes(pose)
	const isLifting = pose === 'lift'
	const isAsleep = pose === 'sleep'
	const stride = pose === 'run' ? 0.85 : 0.6
	const swing = isMoving ? Math.sin(state.walkPhase) * stride : 0
	const stepBob = isMoving ? Math.abs(Math.cos(state.walkPhase)) * (pose === 'run' ? 0.05 : 0.03) : 0
	const hopLift = pose === 'hop' ? Math.abs(Math.sin(state.walkPhase * 0.5)) * 0.22 : 0
	const liftCycle = isLifting ? (Math.sin(time * 3.5) + 1) / 2 : 0
	const twitch = getEarTwitch(state)
	const earSway = isMoving ? Math.sin(state.walkPhase * 2) * 0.08 : Math.sin(time * 1.6) * 0.03

	return {
		hipY: lerp(smudgeDimensions.hipStandY + stepBob + hopLift, smudgeDimensions.hipSitY, sit),
		hipLean: lerp(getStandingLean(pose, isMoving), -0.14, sit),
		headTilt: lerp(isMoving ? -0.05 : 0, isAsleep ? 0.38 : 0.08, sit) + Math.sin(time * 1.1) * 0.03 * state.sitAmount,
		headTurn: pose === 'think' ? Math.sin(time * 0.7) * 0.25 : 0,
		leftLeg: lerp(swing, -1.42, sit),
		rightLeg: lerp(-swing, -1.42, sit),
		legSplay: lerp(0.04, 0.28, sit),
		leftArm: lerp(isLifting ? -2.6 - liftCycle * 0.4 : -swing * 0.9, -0.55, sit),
		rightArm: lerp(isLifting ? -2.6 - liftCycle * 0.4 : swing * 0.9, -0.55, sit),
		armSpread: lerp(isLifting ? 0.15 : 0.12, 0.05, sit),
		leftEar: 0.22 + earSway + twitch,
		rightEar: -0.22 - earSway,
		eyeOpen: getEyeOpen(state, pose),
		tailWag: Math.sin(time * (isMoving ? 10 : 2.5)) * (isMoving ? 0.25 : 0.1),
		breathe: Math.sin(time * (isAsleep ? 1.3 : 2.4)) * (isAsleep ? 0.03 : 0.015)
	}
}
