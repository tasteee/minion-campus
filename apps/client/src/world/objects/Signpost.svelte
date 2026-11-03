<script lang="ts">
	import { getWorldObject } from '@minion-campus/content'
	import { T } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'
	import { onMount } from 'svelte'
	import { registerEntity } from '../ecs/ecsWorld'
	import FocusMarker from '../interaction/FocusMarker.svelte'
	import { worldPalette } from '../palette'

	type PropsT = {
		objectId: string
		position: [number, number, number]
	}

	const props: PropsT = $props()
	const worldObject = $derived(getWorldObject(props.objectId))
	const entityId = $derived(`object:${props.objectId}`)

	onMount(() => {
		if (!worldObject) return
		const position = { x: props.position[0], y: props.position[1], z: props.position[2] }

		return registerEntity({
			id: entityId,
			position,
			interactable: { target: { kind: 'object', objectId: props.objectId }, verb: worldObject.verb, name: worldObject.name, radius: 1.8 }
		})
	})
</script>

<T.Group position={props.position}>
	<T.Group position.y={0.6}>
		<RigidBody type="fixed">
			<Collider shape="cuboid" args={[0.1, 0.6, 0.1]} />
		</RigidBody>
	</T.Group>
	<T.Mesh position.y={0.6} castShadow>
		<T.BoxGeometry args={[0.15, 1.2, 0.15]} />
		<T.MeshStandardMaterial color={worldPalette.wood} roughness={1} />
	</T.Mesh>
	<T.Mesh position.y={1.15} castShadow>
		<T.BoxGeometry args={[1, 0.5, 0.1]} />
		<T.MeshStandardMaterial color={worldPalette.woodLight} roughness={1} />
	</T.Mesh>
	<FocusMarker {entityId} height={1.8} />
</T.Group>
