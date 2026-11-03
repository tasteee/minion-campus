<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'
	import { onMount } from 'svelte'
	import type { Group } from 'three'
	import { registerEntity } from '../ecs/ecsWorld'
	import FocusMarker from '../interaction/FocusMarker.svelte'
	import { interactionState } from '../interaction/interactionState.svelte'
	import { turnToward } from '../interaction/turnToward'
	import { worldPalette } from '../palette'
	import { playerState } from '../player/playerState'
	import { tickMinionHop } from './minionReactions'
	import type { PlaceholderMinionT } from './placeholderMinions'

	type PropsT = { minion: PlaceholderMinionT }

	const props: PropsT = $props()
	const minion = $derived(props.minion)
	const entityId = $derived(`minion:${minion.id}`)
	const origin = $derived({ x: minion.position[0], y: minion.position[1], z: minion.position[2] })
	let bodyGroup = $state<Group>()
	let elapsedSeconds = Math.random() * 10

	onMount(() =>
		registerEntity({
			id: entityId,
			position: origin,
			interactable: { target: { kind: 'minion', minionId: minion.id }, verb: 'Visit', name: minion.name, radius: 1.8 }
		})
	)

	useTask((deltaSeconds) => {
		if (!bodyGroup) return
		elapsedSeconds += deltaSeconds
		const idleBob = Math.sin(elapsedSeconds * 3) * 0.03
		bodyGroup.position.y = idleBob + tickMinionHop(minion.id, deltaSeconds)
		const isEngaged = interactionState.focusedEntityId === entityId
		if (!isEngaged) return
		const blend = 1 - Math.exp(-8 * deltaSeconds)
		bodyGroup.rotation.y = turnToward(bodyGroup.rotation.y, origin, playerState.position, blend)
	})
</script>

<T.Group position={minion.position}>
	<RigidBody type="fixed">
		<Collider shape="ball" args={[0.45]} />
	</RigidBody>
	<T.Group bind:ref={bodyGroup}>
		<T.Mesh position.y={0.42} scale={[1, 0.85, 1]} castShadow>
			<T.SphereGeometry args={[0.5, 24, 24]} />
			<T.MeshStandardMaterial color={minion.bodyColor} roughness={0.7} />
		</T.Mesh>
		<T.Mesh position={[0.22, 0.88, 0]} rotation.z={-0.35} castShadow>
			<T.ConeGeometry args={[0.12, 0.32, 16]} />
			<T.MeshStandardMaterial color={minion.earColor} roughness={0.7} />
		</T.Mesh>
		<T.Mesh position={[-0.22, 0.88, 0]} rotation.z={0.35} castShadow>
			<T.ConeGeometry args={[0.12, 0.32, 16]} />
			<T.MeshStandardMaterial color={minion.earColor} roughness={0.7} />
		</T.Mesh>
		<T.Mesh position={[0.15, 0.52, 0.42]}>
			<T.SphereGeometry args={[0.06, 12, 12]} />
			<T.MeshStandardMaterial color={worldPalette.eye} />
		</T.Mesh>
		<T.Mesh position={[-0.15, 0.52, 0.42]}>
			<T.SphereGeometry args={[0.06, 12, 12]} />
			<T.MeshStandardMaterial color={worldPalette.eye} />
		</T.Mesh>
	</T.Group>
	<FocusMarker {entityId} height={1.5} />
</T.Group>
