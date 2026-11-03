<script lang="ts">
	import { T } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'
	import Ink from '../toon/Ink.svelte'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'

	// Puffy round tree: three overlapping foliage balls on a short trunk.

	type PropsT = { position: [number, number, number]; scale?: number; foliageColor?: string }

	const props: PropsT = $props()
</script>

<T.Group position={props.position} scale={props.scale ?? 1}>
	<T.Group position.y={1}>
		<RigidBody type="fixed">
			<Collider shape="cylinder" args={[1, 0.35]} />
		</RigidBody>
	</T.Group>
	<T.Mesh position.y={0.8} castShadow>
		<T.CylinderGeometry args={[0.22, 0.32, 1.6, 20]} />
		<ToonMaterial color="#c7a17c" />
		<Ink thickness={0.025} />
	</T.Mesh>
	<T.Mesh position.y={2.3} castShadow>
		<T.SphereGeometry args={[1.15, 32, 24]} />
		<ToonMaterial color={props.foliageColor ?? '#a9dc93'} />
		<Ink thickness={0.03} />
	</T.Mesh>
	<T.Mesh position={[0.7, 1.9, 0.3]} castShadow>
		<T.SphereGeometry args={[0.75, 28, 20]} />
		<ToonMaterial color={props.foliageColor ?? '#a9dc93'} />
		<Ink thickness={0.03} />
	</T.Mesh>
	<T.Mesh position={[-0.6, 2, -0.2]} castShadow>
		<T.SphereGeometry args={[0.7, 28, 20]} />
		<ToonMaterial color={props.foliageColor ?? '#a9dc93'} />
		<Ink thickness={0.03} />
	</T.Mesh>
	<T.Mesh position={[0.3, 2.9, 0.75]}>
		<T.SphereGeometry args={[0.09, 12, 10]} />
		<ToonMaterial color={toonPalette.lavenderDeep} />
	</T.Mesh>
</T.Group>
