<script lang="ts">
	import { T } from '@threlte/core'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'

	type PropsT = { position: [number, number, number] }

	const props: PropsT = $props()
	const petalColors = [toonPalette.lavender, toonPalette.butter, '#ffc2d4', toonPalette.lavenderDeep]

	const flowers = Array.from({ length: 7 }, (unused, index) => {
		const angle = index * 2.4
		const distance = 0.25 + (index % 3) * 0.28
		return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance, color: petalColors[index % petalColors.length] ?? toonPalette.lavender }
	})
</script>

<T.Group position={props.position}>
	{#each flowers as flower (`${flower.x}:${flower.z}`)}
		<T.Mesh position={[flower.x, 0.12, flower.z]}>
			<T.CylinderGeometry args={[0.015, 0.015, 0.24, 6]} />
			<ToonMaterial color="#7fbf6a" />
		</T.Mesh>
		<T.Mesh position={[flower.x, 0.26, flower.z]} scale={[1, 0.6, 1]}>
			<T.SphereGeometry args={[0.08, 14, 10]} />
			<ToonMaterial color={flower.color} />
		</T.Mesh>
		<T.Mesh position={[flower.x, 0.3, flower.z]}>
			<T.SphereGeometry args={[0.03, 8, 8]} />
			<ToonMaterial color={toonPalette.gold} />
		</T.Mesh>
	{/each}
</T.Group>
