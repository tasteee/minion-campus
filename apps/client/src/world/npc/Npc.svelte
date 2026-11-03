<script lang="ts">
	import { getNpc } from '@minion-campus/content'
	import { T, useTask } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'
	import { onMount } from 'svelte'
	import type { Group } from 'three'
	import { registerEntity } from '../ecs/ecsWorld'
	import FocusMarker from '../interaction/FocusMarker.svelte'
	import { interactionState } from '../interaction/interactionState.svelte'
	import { turnToward } from '../interaction/turnToward'
	import { worldPalette } from '../palette'
	import Ink from '../toon/Ink.svelte'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { playerState } from '../player/playerState'

	type PropsT = {
		npcId: string
		position: [number, number, number]
		bodyColor: string
		hatColor: string
	}

	const props: PropsT = $props()
	const npc = $derived(getNpc(props.npcId))
	const entityId = $derived(`npc:${props.npcId}`)
	const origin = $derived({ x: props.position[0], y: props.position[1], z: props.position[2] })
	let turnGroup = $state<Group>()

	onMount(() => {
		if (!npc) return

		return registerEntity({
			id: entityId,
			position: origin,
			interactable: { target: { kind: 'npc', npcId: props.npcId }, verb: 'Talk to', name: npc.name, radius: 2.2 }
		})
	})

	useTask((deltaSeconds) => {
		if (!turnGroup) return
		const isEngaged = interactionState.focusedEntityId === entityId
		if (!isEngaged) return
		const blend = 1 - Math.exp(-6 * deltaSeconds)
		turnGroup.rotation.y = turnToward(turnGroup.rotation.y, origin, playerState.position, blend)
	})
</script>

<T.Group position={props.position}>
	<RigidBody type="fixed">
		<Collider shape="capsule" args={[0.45, 0.4]} />
	</RigidBody>
	<T.Group bind:ref={turnGroup}>
		<T.Mesh position.y={0.85} castShadow>
			<T.CapsuleGeometry args={[0.4, 0.9, 8, 16]} />
			<ToonMaterial color={props.bodyColor} />
			<Ink thickness={0.02} />
		</T.Mesh>
		<T.Mesh position.y={1.9} castShadow>
			<T.ConeGeometry args={[0.38, 0.6, 20]} />
			<ToonMaterial color={props.hatColor} />
			<Ink thickness={0.02} />
		</T.Mesh>
		<T.Mesh position={[0.13, 1.3, 0.36]}>
			<T.SphereGeometry args={[0.06, 12, 12]} />
			<ToonMaterial color={worldPalette.eye} />
		</T.Mesh>
		<T.Mesh position={[-0.13, 1.3, 0.36]}>
			<T.SphereGeometry args={[0.06, 12, 12]} />
			<ToonMaterial color={worldPalette.eye} />
		</T.Mesh>
	</T.Group>
	<FocusMarker {entityId} height={2.6} />
</T.Group>
