import { keyBindings } from '../input/bindings'
import { isAnyKeyPressed } from '../input/keyboard'
import { getCameraForward, getCameraRight } from '../camera/orbitState'
import { playerSettings, playerState } from './playerState'

type PlanarVectorT = { x: number; z: number }

const getAxis = (positiveKeys: readonly string[], negativeKeys: readonly string[]) => {
	const positive = isAnyKeyPressed(positiveKeys) ? 1 : 0
	const negative = isAnyKeyPressed(negativeKeys) ? 1 : 0
	return positive - negative
}

// Direction the player wants to move on the ground, relative to the camera.
export const getDesiredDirection = (): PlanarVectorT => {
	const forwardAxis = getAxis(keyBindings.forward, keyBindings.backward)
	const rightAxis = getAxis(keyBindings.right, keyBindings.left)
	const forward = getCameraForward()
	const right = getCameraRight()
	const x = forward.x * forwardAxis + right.x * rightAxis
	const z = forward.z * forwardAxis + right.z * rightAxis
	const length = Math.hypot(x, z)
	if (length === 0) return { x: 0, z: 0 }
	return { x: x / length, z: z / length }
}

export const getMoveSpeed = () => {
	const isRunning = isAnyKeyPressed(keyBindings.run)
	if (isRunning) return playerSettings.runSpeed
	return playerSettings.walkSpeed
}

export const updateVerticalSpeed = (deltaSeconds: number) => {
	const shouldJump = playerState.isGrounded && isAnyKeyPressed(keyBindings.jump)

	if (shouldJump) {
		playerState.verticalSpeed = playerSettings.jumpSpeed
		return
	}

	if (playerState.isGrounded) {
		playerState.verticalSpeed = -1
		return
	}

	playerState.verticalSpeed += playerSettings.gravity * deltaSeconds
}

const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle))

export const updateFacingAngle = (direction: PlanarVectorT, deltaSeconds: number) => {
	const isMoving = direction.x !== 0 || direction.z !== 0
	if (!isMoving) return
	const targetAngle = Math.atan2(direction.x, direction.z)
	const angleDifference = wrapAngle(targetAngle - playerState.facingAngle)
	const blend = 1 - Math.exp(-playerSettings.turnSharpness * deltaSeconds)
	playerState.facingAngle = wrapAngle(playerState.facingAngle + angleDifference * blend)
}
