<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core'
	import { onMount } from 'svelte'
	import { Vector3, type PerspectiveCamera } from 'three'
	import { playerState } from '../player/playerState'
	import { attachOrbitControls, orbitSettings, orbitState } from './orbitState'

	const threlte = useThrelte()
	const smoothedTarget = new Vector3()
	const desiredTarget = new Vector3()
	let camera = $state<PerspectiveCamera>()
	let hasSnappedToPlayer = false

	onMount(() => attachOrbitControls(threlte.renderer.domElement))

	const updateDesiredTarget = () => {
		const position = playerState.position
		desiredTarget.set(position.x, position.y + orbitSettings.targetHeight, position.z)
	}

	const updateSmoothedTarget = (deltaSeconds: number) => {
		if (!hasSnappedToPlayer) {
			smoothedTarget.copy(desiredTarget)
			hasSnappedToPlayer = true
			return
		}

		const blend = 1 - Math.exp(-orbitSettings.followSharpness * deltaSeconds)
		smoothedTarget.lerp(desiredTarget, blend)
	}

	useTask((deltaSeconds) => {
		if (!camera) return
		updateDesiredTarget()
		updateSmoothedTarget(deltaSeconds)
		const horizontalDistance = Math.cos(orbitState.pitch) * orbitState.distance
		const offsetX = Math.sin(orbitState.yaw) * horizontalDistance
		const offsetY = Math.sin(orbitState.pitch) * orbitState.distance
		const offsetZ = Math.cos(orbitState.yaw) * horizontalDistance
		camera.position.set(smoothedTarget.x + offsetX, smoothedTarget.y + offsetY, smoothedTarget.z + offsetZ)
		camera.lookAt(smoothedTarget)
	})
</script>

<T.PerspectiveCamera makeDefault fov={50} near={0.1} far={300} bind:ref={camera} />
