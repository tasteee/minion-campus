<script lang="ts">
	import { T } from '@threlte/core'
	import { RoundedBoxGeometry } from '@threlte/extras'
	import { LatheGeometry, Vector2 } from 'three'
	import Ink from '../toon/Ink.svelte'
	import Mushroom from '../toon/Mushroom.svelte'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'

	// Donut pet bed from the illustration: cream bolster, tufted lavender cushion,
	// folded blanket, lavender/gold studs, spiked collar with a crystal charm.

	// Bolster is a lathed profile: inner wall, puffy rounded lip, outer wall.
	const RIM_RADIUS = 0.5
	const RIM_TUBE = 0.15
	const RIM_TOP = 0.36

	const createBolsterGeometry = () => {
		const lipPoints = Array.from({ length: 17 }, (unused, index) => {
			const angle = Math.PI - (index / 16) * Math.PI
			return new Vector2(RIM_RADIUS + Math.cos(angle) * RIM_TUBE, RIM_TOP + Math.sin(angle) * RIM_TUBE * 0.8)
		})
		const profile = [
			new Vector2(RIM_RADIUS - RIM_TUBE + 0.02, 0.08),
			...lipPoints,
			new Vector2(RIM_RADIUS + RIM_TUBE + 0.02, 0.2),
			new Vector2(RIM_RADIUS + RIM_TUBE - 0.01, 0.06),
			new Vector2(RIM_RADIUS + RIM_TUBE - 0.06, 0.02)
		]
		// Reversed so normals face out (needed for shading and the ink outline).
		return new LatheGeometry(profile.reverse(), 96)
	}

	const bolsterGeometry = createBolsterGeometry()
	const STUD_COUNT = 14
	const studs = Array.from({ length: STUD_COUNT }, (unused, index) => (index / STUD_COUNT) * Math.PI * 2)
	const tufts = [{ x: 0, z: 0 }, { x: 0.2, z: 0.12 }, { x: -0.2, z: 0.12 }, { x: 0.18, z: -0.16 }, { x: -0.18, z: -0.16 }, { x: 0, z: 0.26 }, { x: 0, z: -0.28 }]
	// Spiked collar hugging the front of the bolster.
	const COLLAR_ANGLE = -0.45
	const COLLAR_ARC = 0.55
	const COLLAR_RADIUS = RIM_RADIUS + RIM_TUBE + 0.025
	const collarSpikes = [-0.2, -0.1, 0, 0.1, 0.2].map((offset) => ({ angle: COLLAR_ANGLE + offset }))
</script>

{#snippet pawPrint(angle: number)}
	<T.Group position={[Math.sin(angle) * (RIM_RADIUS + RIM_TUBE + 0.025), 0.2, Math.cos(angle) * (RIM_RADIUS + RIM_TUBE + 0.025)]} rotation.y={angle}>
		<T.Mesh scale={[1, 1, 0.3]}>
			<T.SphereGeometry args={[0.045, 16, 12]} />
			<ToonMaterial color={toonPalette.lavender} />
		</T.Mesh>
		{#each [-0.045, 0, 0.045] as toeX (toeX)}
			<T.Mesh position={[toeX, 0.055 - Math.abs(toeX) * 0.4, 0]} scale={[1, 1, 0.3]}>
				<T.SphereGeometry args={[0.018, 12, 8]} />
				<ToonMaterial color={toonPalette.lavender} />
			</T.Mesh>
		{/each}
	</T.Group>
{/snippet}

<T.Group>
	<T.Mesh position.y={0.035} receiveShadow castShadow>
		<T.CylinderGeometry args={[0.72, 0.74, 0.07, 64]} />
		<ToonMaterial color={toonPalette.lavenderPale} />
		<Ink />
	</T.Mesh>

	<T.Mesh geometry={bolsterGeometry} castShadow>
		<ToonMaterial color={toonPalette.cream} />
		<Ink thickness={0.02} />
	</T.Mesh>

	<T.Mesh position.y={0.14} scale={[1, 0.38, 1]} receiveShadow>
		<T.SphereGeometry args={[0.4, 48, 24]} />
		<ToonMaterial color={toonPalette.lavender} />
		<Ink thickness={0.012} />
	</T.Mesh>
	{#each tufts as tuft (`${tuft.x}:${tuft.z}`)}
		<T.Mesh position={[tuft.x, 0.29 - (tuft.x * tuft.x + tuft.z * tuft.z) * 0.5, tuft.z]} scale={[1, 0.35, 1]}>
			<T.SphereGeometry args={[0.018, 10, 8]} />
			<ToonMaterial color={toonPalette.lavenderDeep} />
		</T.Mesh>
	{/each}

	<T.Group position={[0.2, 0.33, -0.22]} rotation={[0.12, -0.6, 0.18]}>
		<T.Mesh castShadow>
			<RoundedBoxGeometry args={[0.38, 0.055, 0.28]} radius={0.024} smoothness={4} />
			<ToonMaterial color={toonPalette.lavenderLight} />
			<Ink thickness={0.012} />
		</T.Mesh>
		<T.Mesh position={[0.02, 0.05, -0.04]} castShadow>
			<RoundedBoxGeometry args={[0.36, 0.05, 0.18]} radius={0.022} smoothness={4} />
			<ToonMaterial color={toonPalette.lavenderLight} />
			<Ink thickness={0.012} />
		</T.Mesh>
	</T.Group>

	{#each studs as angle, studIndex (angle)}
		<T.Mesh position={[Math.sin(angle) * RIM_RADIUS, RIM_TOP + RIM_TUBE * 0.8, Math.cos(angle) * RIM_RADIUS]}>
			<T.SphereGeometry args={[0.032, 16, 12]} />
			<ToonMaterial color={studIndex % 2 === 0 ? toonPalette.lavender : toonPalette.gold} />
			<Ink thickness={0.006} />
		</T.Mesh>
	{/each}

	<T.Group position.y={0.24} rotation.y={COLLAR_ANGLE + COLLAR_ARC / 2 - Math.PI / 2}>
		<T.Mesh rotation.x={Math.PI / 2}>
			<T.TorusGeometry args={[COLLAR_RADIUS, 0.022, 10, 32, COLLAR_ARC]} />
			<ToonMaterial color={toonPalette.collar} />
		</T.Mesh>
	</T.Group>
	{#each collarSpikes as spike (spike.angle)}
		<T.Group position.y={0.24} rotation.y={spike.angle}>
			<T.Mesh position.z={COLLAR_RADIUS + 0.03} rotation.x={Math.PI / 2}>
				<T.ConeGeometry args={[0.014, 0.045, 10]} />
				<ToonMaterial color={toonPalette.spike} />
			</T.Mesh>
		</T.Group>
	{/each}
	<T.Mesh position={[Math.sin(COLLAR_ANGLE) * (COLLAR_RADIUS + 0.02), 0.16, Math.cos(COLLAR_ANGLE) * (COLLAR_RADIUS + 0.02)]} scale={[0.6, 1.4, 0.6]}>
		<T.OctahedronGeometry args={[0.045]} />
		<ToonMaterial color={toonPalette.crystal} />
		<Ink thickness={0.006} />
	</T.Mesh>

	{@render pawPrint(-1.1)}
	{@render pawPrint(1.25)}

	<Mushroom position={[-0.5, 0.07, 0.5]} />
	<Mushroom position={[-0.4, 0.07, 0.6]} scale={0.6} />
	<Mushroom position={[0.32, 0.07, 0.63]} scale={0.85} />
</T.Group>
