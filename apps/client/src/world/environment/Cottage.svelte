<script lang="ts">
	import { T } from '@threlte/core'
	import { RoundedBoxGeometry } from '@threlte/extras'
	import { Collider, RigidBody } from '@threlte/rapier'
	import { ExtrudeGeometry, Shape } from 'three'
	import Ink from '../toon/Ink.svelte'
	import { createStarShape } from '../toon/shapes'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'

	// The Headmaster's cottage: cream walls, lavender roof, round windows.

	type PropsT = { position: [number, number, number] }

	const props: PropsT = $props()
	const WIDTH = 6
	const DEPTH = 4.4
	const WALL_HEIGHT = 2.6

	const createRoofGeometry = () => {
		const shape = new Shape()
		shape.moveTo(-WIDTH / 2 - 0.45, 0)
		shape.lineTo(0, 2.1)
		shape.lineTo(WIDTH / 2 + 0.45, 0)
		shape.lineTo(-WIDTH / 2 - 0.45, 0)
		const geometry = new ExtrudeGeometry(shape, { depth: DEPTH + 0.7, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 3 })
		geometry.translate(0, 0, -(DEPTH + 0.7) / 2)
		return geometry
	}

	const roofGeometry = createRoofGeometry()
	const starShape = createStarShape(0.22, 0.1)
	const windowXs = [-1.8, 1.8]
</script>

<T.Group position={props.position}>
	<T.Group position.y={WALL_HEIGHT / 2}>
		<RigidBody type="fixed">
			<Collider shape="cuboid" args={[WIDTH / 2, WALL_HEIGHT / 2, DEPTH / 2]} />
		</RigidBody>
	</T.Group>

	<T.Mesh position.y={WALL_HEIGHT / 2} castShadow receiveShadow>
		<RoundedBoxGeometry args={[WIDTH, WALL_HEIGHT, DEPTH]} radius={0.18} smoothness={4} />
		<ToonMaterial color={toonPalette.cream} />
		<Ink thickness={0.03} />
	</T.Mesh>

	<T.Mesh geometry={roofGeometry} position.y={WALL_HEIGHT - 0.05} castShadow>
		<ToonMaterial color={toonPalette.lavenderDeep} />
		<Ink thickness={0.03} />
	</T.Mesh>

	<T.Mesh position={[1.6, WALL_HEIGHT + 1.4, -0.6]} castShadow>
		<RoundedBoxGeometry args={[0.6, 1.4, 0.6]} radius={0.08} smoothness={3} />
		<ToonMaterial color={toonPalette.creamShade} />
		<Ink thickness={0.02} />
	</T.Mesh>

	<T.Mesh position={[0, 0.95, DEPTH / 2 + 0.02]}>
		<RoundedBoxGeometry args={[1.2, 1.9, 0.12]} radius={0.12} smoothness={4} />
		<ToonMaterial color={toonPalette.purple} />
		<Ink thickness={0.02} />
	</T.Mesh>
	<T.Mesh position={[0.38, 0.95, DEPTH / 2 + 0.1]}>
		<T.SphereGeometry args={[0.07, 12, 12]} />
		<ToonMaterial color={toonPalette.gold} />
	</T.Mesh>

	{#each windowXs as windowX (windowX)}
		<T.Mesh position={[windowX, 1.55, DEPTH / 2 + 0.03]} rotation.x={Math.PI / 2}>
			<T.CylinderGeometry args={[0.5, 0.5, 0.1, 40]} />
			<ToonMaterial color={toonPalette.butter} />
			<Ink thickness={0.025} />
		</T.Mesh>
		<T.Mesh position={[windowX, 1.55, DEPTH / 2 + 0.09]}>
			<T.BoxGeometry args={[0.06, 0.95, 0.02]} />
			<ToonMaterial color={toonPalette.ink} />
		</T.Mesh>
		<T.Mesh position={[windowX, 1.55, DEPTH / 2 + 0.09]}>
			<T.BoxGeometry args={[0.95, 0.06, 0.02]} />
			<ToonMaterial color={toonPalette.ink} />
		</T.Mesh>
	{/each}

	<T.Mesh position={[0, WALL_HEIGHT + 1.05, DEPTH / 2 + 0.43]}>
		<T.ShapeGeometry args={[starShape]} />
		<ToonMaterial color={toonPalette.gold} />
	</T.Mesh>
</T.Group>
