<script lang="ts">
	import { T } from '@threlte/core'
	import Ink from '../toon/Ink.svelte'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'
	import type { MinionLookT } from './minionLook'

	// Procedural minion built from its look. Faces +z. Origin at the feet.

	type PropsT = { look: MinionLookT }

	const props: PropsT = $props()
	const BODY_RADIUS = 0.45
	const look = $derived(props.look)
	const bodyHeight = $derived(BODY_RADIUS * look.bodyScale[1])
	const bodyWidth = $derived(BODY_RADIUS * look.bodyScale[0])
	const bodyDepth = $derived(BODY_RADIUS * look.bodyScale[2])
	const centerY = $derived(bodyHeight)
	const faceZ = $derived(bodyDepth * 0.9)
	const earBaseY = $derived(centerY + bodyHeight * 0.78)

	const stripeLevels = $derived(
		Array.from({ length: look.stripeCount }, (unused, index) => {
			const level = 0.55 - index * (1 / (look.stripeCount + 1)) * 1.1
			const ring = Math.sqrt(Math.max(0, 1 - level * level))
			return { y: centerY + level * bodyHeight, radius: ring * bodyWidth * 1.01 }
		})
	)
</script>

{#snippet ear(side: number)}
	<T.Group position={[side * bodyWidth * 0.45, earBaseY, -bodyDepth * 0.05]} rotation.z={look.earsAreFloppy ? side * -2.2 : side * -0.28}>
		<T.Mesh position.y={look.earHeight / 2} castShadow>
			<T.ConeGeometry args={[0.1, look.earHeight, 20]} />
			<ToonMaterial color={look.bodyColor} />
			<Ink thickness={0.01} />
		</T.Mesh>
		<T.Mesh position={[0, look.earHeight * 0.42, 0.045]} scale={[0.55, 0.7, 0.3]}>
			<T.ConeGeometry args={[0.1, look.earHeight, 16]} />
			<ToonMaterial color={look.accentColor} />
		</T.Mesh>
	</T.Group>
{/snippet}

{#snippet horn(side: number)}
	<T.Mesh position={[side * bodyWidth * 0.2, earBaseY + 0.02, bodyDepth * 0.25]} rotation={[0.25, 0, side * -0.3]} castShadow>
		<T.ConeGeometry args={[look.hornSize * 0.35, look.hornSize, 16]} />
		<ToonMaterial color={toonPalette.cream} />
		<Ink thickness={0.008} />
	</T.Mesh>
{/snippet}

{#snippet sidePart(side: number)}
	<T.Mesh position={[side * bodyWidth * 0.98, centerY * 0.85, bodyDepth * 0.15]} scale={[0.8, 1, 0.9]} castShadow>
		<T.SphereGeometry args={[look.armSize, 16, 12]} />
		<ToonMaterial color={look.bodyColor} />
		<Ink thickness={0.008} />
	</T.Mesh>
	<T.Mesh position={[side * bodyWidth * 0.42, 0.06, bodyDepth * 0.55]} scale={[1, 0.6, 1.25]} castShadow>
		<T.SphereGeometry args={[0.1, 16, 12]} />
		<ToonMaterial color={look.bodyColor} />
		<Ink thickness={0.008} />
	</T.Mesh>
	<T.Mesh position={[side * 0.13, centerY + bodyHeight * 0.18, faceZ]}>
		<T.SphereGeometry args={[0.055, 16, 12]} />
		<ToonMaterial color={toonPalette.ink} />
	</T.Mesh>
	<T.Mesh position={[side * 0.13 + 0.018, centerY + bodyHeight * 0.18 + 0.022, faceZ + 0.045]}>
		<T.SphereGeometry args={[0.016, 8, 8]} />
		<T.MeshBasicMaterial color="#ffffff" />
	</T.Mesh>
	<T.Mesh position={[side * 0.24, centerY + bodyHeight * 0.02, faceZ * 0.93]} scale={[1, 0.6, 0.3]}>
		<T.SphereGeometry args={[0.05, 12, 8]} />
		<T.MeshBasicMaterial color="#ffb3c6" />
	</T.Mesh>
{/snippet}

<T.Group>
	<T.Mesh position.y={centerY} scale={look.bodyScale} castShadow>
		<T.SphereGeometry args={[BODY_RADIUS, 40, 28]} />
		<ToonMaterial color={look.bodyColor} />
		<Ink thickness={0.014} />
	</T.Mesh>
	<T.Mesh position={[0, centerY * 0.82, bodyDepth * 0.55]} scale={[bodyWidth * 1.3, bodyHeight * 1.3, 0.25]}>
		<T.SphereGeometry args={[0.5, 24, 16]} />
		<ToonMaterial color={look.bellyColor} />
	</T.Mesh>

	{#each look.spots as spot (`${spot.x}:${spot.y}:${spot.z}`)}
		<T.Mesh position={[spot.x * bodyWidth, centerY + spot.y * bodyHeight, spot.z * bodyDepth]}>
			<T.SphereGeometry args={[spot.size, 16, 12]} />
			<ToonMaterial color={look.accentColor} />
		</T.Mesh>
	{/each}

	{#each stripeLevels as stripe (stripe.y)}
		<T.Mesh position.y={stripe.y} rotation.x={Math.PI / 2} scale={[1, look.bodyScale[2] / look.bodyScale[0], 1]}>
			<T.TorusGeometry args={[stripe.radius, 0.035, 10, 40]} />
			<ToonMaterial color={look.accentColor} />
		</T.Mesh>
	{/each}

	{@render ear(-1)}
	{@render ear(1)}
	{#if look.hasHorns}
		{@render horn(-1)}
		{@render horn(1)}
	{/if}
	{@render sidePart(-1)}
	{@render sidePart(1)}

	<T.Mesh position={[0, centerY + bodyHeight * 0.06, faceZ + 0.02]} scale={[1, 0.6, 0.6]}>
		<T.SphereGeometry args={[0.022, 10, 8]} />
		<ToonMaterial color={toonPalette.ink} />
	</T.Mesh>

	<T.Group position={[0, centerY * 0.6, -bodyDepth * 0.95]} rotation.x={-0.9}>
		<T.Mesh position.y={look.tailLength / 2} castShadow>
			<T.CapsuleGeometry args={[0.055, look.tailLength, 6, 12]} />
			<ToonMaterial color={look.bodyColor} />
			<Ink thickness={0.008} />
		</T.Mesh>
		<T.Mesh position.y={look.tailLength + 0.04}>
			<T.SphereGeometry args={[0.075, 14, 10]} />
			<ToonMaterial color={look.accentColor} />
			<Ink thickness={0.008} />
		</T.Mesh>
	</T.Group>
</T.Group>
