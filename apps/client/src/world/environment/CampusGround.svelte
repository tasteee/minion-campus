<script lang="ts">
	import { T } from '@threlte/core'
	import { RoundedBoxGeometry } from '@threlte/extras'
	import { Collider, RigidBody } from '@threlte/rapier'
	import { campusHalfSize, paths } from '../../scenes/campus/campusLayout'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'

	// Grass, sandy paths, and invisible walls at the campus edge.

	const WALL_HEIGHT = 3
	const groundSize = campusHalfSize * 2 + 16

	const pathStrips = paths.map((path) => {
		const deltaX = path.to.x - path.from.x
		const deltaZ = path.to.z - path.from.z
		return {
			key: `${path.from.x}:${path.from.z}:${path.to.x}:${path.to.z}`,
			x: (path.from.x + path.to.x) / 2,
			z: (path.from.z + path.to.z) / 2,
			length: Math.hypot(deltaX, deltaZ) + path.width,
			width: path.width,
			angle: Math.atan2(deltaX, deltaZ)
		}
	})

	const walls = [
		{ key: 'north', x: 0, z: -campusHalfSize, halfX: campusHalfSize, halfZ: 0.5 },
		{ key: 'south', x: 0, z: campusHalfSize, halfX: campusHalfSize, halfZ: 0.5 },
		{ key: 'west', x: -campusHalfSize, z: 0, halfX: 0.5, halfZ: campusHalfSize },
		{ key: 'east', x: campusHalfSize, z: 0, halfX: 0.5, halfZ: campusHalfSize }
	]
</script>

<T.Group position.y={-0.5}>
	<RigidBody type="fixed">
		<Collider shape="cuboid" args={[groundSize / 2, 0.5, groundSize / 2]} />
	</RigidBody>
	<T.Mesh receiveShadow>
		<T.BoxGeometry args={[groundSize, 1, groundSize]} />
		<ToonMaterial color="#b6e39f" />
	</T.Mesh>
</T.Group>

{#each pathStrips as strip (strip.key)}
	<T.Mesh position={[strip.x, 0.005, strip.z]} rotation.y={strip.angle} receiveShadow>
		<RoundedBoxGeometry args={[strip.width, 0.02, strip.length]} radius={0.009} smoothness={2} />
		<ToonMaterial color={toonPalette.sand} />
	</T.Mesh>
{/each}

{#each walls as wall (wall.key)}
	<T.Group position={[wall.x, WALL_HEIGHT / 2, wall.z]}>
		<RigidBody type="fixed">
			<Collider shape="cuboid" args={[wall.halfX, WALL_HEIGHT / 2, wall.halfZ]} />
		</RigidBody>
	</T.Group>
{/each}
