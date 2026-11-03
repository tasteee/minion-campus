<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import { usePhysicsTask, useRapier } from '@threlte/rapier'
	import { onDestroy } from 'svelte'
	import type { Group } from 'three'
	import { worldPalette } from '../palette'
	import { playerSettings, playerState } from './playerState'
	import { getDesiredDirection, getMoveSpeed, updateFacingAngle, updateVerticalSpeed } from './playerMovement'

	const FALL_RESET_HEIGHT = -20
	const MAX_SLOPE_RADIANS = Math.PI / 4

	const rapierContext = useRapier()
	const world = rapierContext.world
	const rapier = rapierContext.rapier
	const spawn = playerSettings.spawnPosition

	const bodyDescription = rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(spawn.x, spawn.y, spawn.z)
	const body = world.createRigidBody(bodyDescription)

	const colliderDescription = rapier.ColliderDesc.capsule(
		playerSettings.capsuleHalfHeight,
		playerSettings.capsuleRadius
	)

	const collider = world.createCollider(colliderDescription, body)
	const controller = world.createCharacterController(0.02)
	controller.enableSnapToGround(0.3)
	controller.enableAutostep(0.35, 0.2, true)
	controller.setMaxSlopeClimbAngle(MAX_SLOPE_RADIANS)
	controller.setApplyImpulsesToDynamicBodies(true)

	let visualGroup = $state<Group>()

	const resetToSpawn = () => {
		body.setTranslation(spawn, true)
		playerState.verticalSpeed = 0
	}

	usePhysicsTask((deltaSeconds) => {
		const direction = getDesiredDirection()
		const speed = getMoveSpeed()
		updateVerticalSpeed(deltaSeconds)
		updateFacingAngle(direction, deltaSeconds)

		const desiredMovement = {
			x: direction.x * speed * deltaSeconds,
			y: playerState.verticalSpeed * deltaSeconds,
			z: direction.z * speed * deltaSeconds
		}

		controller.computeColliderMovement(collider, desiredMovement)
		const movement = controller.computedMovement()
		const current = body.translation()

		const nextPosition = {
			x: current.x + movement.x,
			y: current.y + movement.y,
			z: current.z + movement.z
		}

		body.setNextKinematicTranslation(nextPosition)
		playerState.isGrounded = controller.computedGrounded()
		playerState.position.x = nextPosition.x
		playerState.position.y = nextPosition.y
		playerState.position.z = nextPosition.z
		if (nextPosition.y < FALL_RESET_HEIGHT) resetToSpawn()
	})

	useTask(() => {
		if (!visualGroup) return
		const translation = body.translation()
		visualGroup.position.set(translation.x, translation.y, translation.z)
		visualGroup.rotation.y = playerState.facingAngle
	})

	onDestroy(() => {
		world.removeCharacterController(controller)
		world.removeRigidBody(body)
	})
</script>

<T.Group bind:ref={visualGroup}>
	<T.Mesh castShadow>
		<T.CapsuleGeometry args={[playerSettings.capsuleRadius, playerSettings.capsuleHalfHeight * 2, 8, 16]} />
		<T.MeshStandardMaterial color={worldPalette.player} roughness={0.8} />
	</T.Mesh>
	<T.Mesh position={[0, 0.35, playerSettings.capsuleRadius - 0.05]} castShadow>
		<T.SphereGeometry args={[0.1, 16, 16]} />
		<T.MeshStandardMaterial color={worldPalette.playerNose} />
	</T.Mesh>
</T.Group>
