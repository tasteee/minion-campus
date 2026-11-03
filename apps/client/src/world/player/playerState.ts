// Shared per-frame player data. Camera and future systems read it.
// Not persistent game state: the sim owns that.

export const playerSettings = {
	walkSpeed: 4,
	runSpeed: 7.5,
	jumpSpeed: 6,
	gravity: -20,
	turnSharpness: 12,
	capsuleHalfHeight: 0.45,
	capsuleRadius: 0.4,
	spawnPosition: { x: 0, y: 1.5, z: 9 }
} as const

export const playerState = {
	position: { x: 0, y: 0, z: 0 },
	facingAngle: Math.PI,
	verticalSpeed: 0,
	isGrounded: false
}
