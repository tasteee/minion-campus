import type { Vector3LikeT } from '../ecs/ecsWorld'

const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle))

// Smoothly turns a yaw angle so the origin faces the target.
export const turnToward = (currentAngle: number, origin: Vector3LikeT, target: Vector3LikeT, blend: number) => {
	const targetAngle = Math.atan2(target.x - origin.x, target.z - origin.z)
	const difference = wrapAngle(targetAngle - currentAngle)
	return wrapAngle(currentAngle + difference * blend)
}
