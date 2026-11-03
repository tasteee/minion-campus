<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import type { Mesh } from 'three'
	import { worldPalette } from '../palette'
	import { interactionState } from './interactionState.svelte'

	type PropsT = { entityId: string; height: number }

	const props: PropsT = $props()
	let marker = $state<Mesh>()
	let elapsedSeconds = 0
	const isVisible = $derived(interactionState.mode === 'free' && interactionState.focusedEntityId === props.entityId)

	useTask((deltaSeconds) => {
		if (!marker || !isVisible) return
		elapsedSeconds += deltaSeconds
		marker.rotation.y = elapsedSeconds * 2
		marker.position.y = props.height + Math.sin(elapsedSeconds * 4) * 0.08
	})
</script>

{#if isVisible}
	<T.Mesh bind:ref={marker} position.y={props.height}>
		<T.OctahedronGeometry args={[0.16]} />
		<T.MeshStandardMaterial color={worldPalette.focusMarker} emissive={worldPalette.focusMarker} emissiveIntensity={0.4} />
	</T.Mesh>
{/if}
