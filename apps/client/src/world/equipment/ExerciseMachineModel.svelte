<script lang="ts">
	import { T } from '@threlte/core'
	import { RoundedBoxGeometry } from '@threlte/extras'
	import Ink from '../toon/Ink.svelte'
	import Mushroom from '../toon/Mushroom.svelte'
	import { createStarShape } from '../toon/shapes'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'

	// Bench press from the illustration: cream frame, lavender pad and bar, ringed plates.
	// Bar runs along x between the uprights; the bench runs toward +z.

	const UPRIGHT_X = 0.62
	const BAR_HEIGHT = 1.02
	const starShape = createStarShape(0.06, 0.028)
	const plateSides = [-1, 1]
	const studZPositions = [0.35, 0.5, 0.65, 0.8]
</script>

{#snippet plateStack(side: number)}
	<T.Group position={[side * 0.86, BAR_HEIGHT, 0]} rotation.z={Math.PI / 2}>
		<T.Mesh castShadow>
			<T.CylinderGeometry args={[0.27, 0.27, 0.09, 40]} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position.y={side * 0.09} castShadow>
			<T.CylinderGeometry args={[0.24, 0.24, 0.08, 40]} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		{#each [-0.025, 0.02, 0.07, 0.115] as ringOffset (ringOffset)}
			<T.Mesh position.y={side * ringOffset} rotation.x={Math.PI / 2}>
				<T.TorusGeometry args={[ringOffset > 0.05 ? 0.24 : 0.27, 0.008, 8, 48]} />
				<ToonMaterial color={toonPalette.lavenderDeep} />
			</T.Mesh>
		{/each}
		<T.Mesh position.y={side * 0.2}>
			<T.CylinderGeometry args={[0.06, 0.06, 0.12, 24]} />
			<ToonMaterial color={toonPalette.lavender} />
			<Ink />
		</T.Mesh>
	</T.Group>
{/snippet}

{#snippet upright(side: number)}
	<T.Group position.x={side * UPRIGHT_X}>
		<T.Mesh position.y={0.07} castShadow receiveShadow>
			<RoundedBoxGeometry args={[0.34, 0.14, 0.62]} radius={0.06} smoothness={4} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position.y={0.52} castShadow>
			<RoundedBoxGeometry args={[0.17, 0.9, 0.2]} radius={0.06} smoothness={4} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position.y={BAR_HEIGHT - 0.02} rotation.y={Math.PI / 2} rotation.z={Math.PI}>
			<T.TorusGeometry args={[0.07, 0.035, 12, 24, Math.PI]} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink thickness={0.012} />
		</T.Mesh>
		<T.Mesh position={[0, 0.62, 0.101]} rotation.z={0.2}>
			<T.ShapeGeometry args={[starShape]} />
			<ToonMaterial color={toonPalette.lavender} />
		</T.Mesh>
		<T.Mesh position={[0, 0.36, 0.101]} rotation.z={-0.3} scale={0.7}>
			<T.ShapeGeometry args={[starShape]} />
			<ToonMaterial color={toonPalette.lavender} />
		</T.Mesh>
	</T.Group>
{/snippet}

{#snippet dumbbell(position: [number, number, number], rotationY: number, plateColor: string)}
	<T.Group {position} rotation.y={rotationY}>
		<T.Mesh rotation.z={Math.PI / 2} castShadow>
			<T.CylinderGeometry args={[0.03, 0.03, 0.34, 16]} />
			<ToonMaterial color={toonPalette.lavender} />
			<Ink thickness={0.01} />
		</T.Mesh>
		{#each [-0.15, 0.15] as plateX (plateX)}
			<T.Mesh position.x={plateX} rotation.z={Math.PI / 2} castShadow>
				<T.CylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
				<ToonMaterial color={plateColor} />
				<Ink thickness={0.012} />
			</T.Mesh>
		{/each}
	</T.Group>
{/snippet}

<T.Group>
	{@render upright(-1)}
	{@render upright(1)}

	<T.Mesh position.y={BAR_HEIGHT} rotation.z={Math.PI / 2} castShadow>
		<T.CylinderGeometry args={[0.035, 0.035, 2.1, 20]} />
		<ToonMaterial color={toonPalette.lavender} />
		<Ink thickness={0.012} />
	</T.Mesh>
	{#each plateSides as side (side)}
		{@render plateStack(side)}
	{/each}

	<T.Group position.z={0.5}>
		<T.Mesh position={[0, 0.2, -0.35]} castShadow>
			<RoundedBoxGeometry args={[0.16, 0.1, 0.7]} radius={0.04} smoothness={4} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position={[0, 0.25, 0.3]} castShadow>
			<RoundedBoxGeometry args={[0.22, 0.36, 0.22]} radius={0.06} smoothness={4} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position={[0, 0.06, 0.3]} castShadow receiveShadow>
			<RoundedBoxGeometry args={[0.58, 0.12, 0.26]} radius={0.05} smoothness={4} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position={[0, 0.47, 0]} castShadow>
			<RoundedBoxGeometry args={[0.44, 0.13, 1.08]} radius={0.05} smoothness={4} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
		<T.Mesh position={[0, 0.575, 0]} castShadow>
			<RoundedBoxGeometry args={[0.4, 0.09, 1.02]} radius={0.04} smoothness={4} />
			<ToonMaterial color={toonPalette.lavenderLight} />
			<Ink />
		</T.Mesh>
		{#each studZPositions as studZ (studZ)}
			<T.Mesh position={[0.222, 0.47, studZ - 0.45]}>
				<T.SphereGeometry args={[0.022, 12, 12]} />
				<ToonMaterial color={toonPalette.gold} />
			</T.Mesh>
		{/each}
		<T.Mesh position={[-0.05, 0.623, 0.32]} rotation.x={-Math.PI / 2} scale={0.6}>
			<T.ShapeGeometry args={[starShape]} />
			<ToonMaterial color={toonPalette.cream} />
		</T.Mesh>
	</T.Group>

	{@render dumbbell([-0.95, 0.1, 0.75], 0.5, toonPalette.cream)}
	{@render dumbbell([0.95, 0.1, 0.65], -0.4, toonPalette.lavender)}

	<Mushroom position={[-0.32, 0, 0.95]} />
	<Mushroom position={[0.4, 0, -0.32]} scale={0.8} />
	<Mushroom position={[0.82, 0, 0.18]} scale={0.7} />
</T.Group>
