<script lang="ts">
	import { T } from '@threlte/core'
	import Ink from './Ink.svelte'
	import ToonMaterial from './ToonMaterial.svelte'
	import { toonPalette } from './toonPalette'

	// Tiny decorative mushroom, as drawn around the equipment.
	type PropsT = { position: [number, number, number]; scale?: number }

	const props: PropsT = $props()
</script>

<T.Group position={props.position} scale={props.scale ?? 1}>
	<T.Mesh position.y={0.035} castShadow>
		<T.CylinderGeometry args={[0.022, 0.028, 0.07, 16]} />
		<ToonMaterial color={toonPalette.cream} />
		<Ink thickness={0.008} />
	</T.Mesh>
	<T.Mesh position.y={0.07} scale={[1, 0.7, 1]} castShadow>
		<T.SphereGeometry args={[0.055, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
		<ToonMaterial color={toonPalette.lavender} />
		<Ink thickness={0.008} />
	</T.Mesh>
</T.Group>
