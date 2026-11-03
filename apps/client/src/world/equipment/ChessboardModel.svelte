<script lang="ts">
	import { T } from '@threlte/core'
	import { RoundedBoxGeometry } from '@threlte/extras'
	import Ink from '../toon/Ink.svelte'
	import { createMoonShape, createStarShape } from '../toon/shapes'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'
	import { boardTileSize, createChessPieceMeshes, createTileMeshes } from './chessPieces'

	// Cute chess set from the illustration on a low table, with a cushion on each side.

	const TABLE_HEIGHT = 0.42
	const BOARD_SIZE = boardTileSize * 8
	const FRAME_SIZE = BOARD_SIZE + 0.26
	// Frame top sits at TABLE_HEIGHT + 0.1; tiles rest on it.
	const BOARD_TOP = TABLE_HEIGHT + 0.112

	const pieceMeshes = createChessPieceMeshes()
	const tileMeshes = createTileMeshes()
	const starShape = createStarShape(0.03, 0.013)
	const moonShape = createMoonShape(0.028)
	const frameEdge = FRAME_SIZE / 2 - 0.065

	// Studs, moons and stars around the frame, alternating like the drawing.
	const frameDecorations = [-0.55, -0.4, -0.2, 0, 0.2, 0.4, 0.55].flatMap((offset, index) => [
		{ x: offset, z: frameEdge, kind: index % 3 },
		{ x: offset, z: -frameEdge, kind: (index + 1) % 3 },
		{ x: frameEdge, z: offset, kind: (index + 2) % 3 },
		{ x: -frameEdge, z: offset, kind: index % 3 }
	])

	const legPositions = [{ x: -0.62, z: -0.62 }, { x: 0.62, z: -0.62 }, { x: -0.62, z: 0.62 }, { x: 0.62, z: 0.62 }]
</script>

<T.Group>
	{#each legPositions as leg (`${leg.x}:${leg.z}`)}
		<T.Mesh position={[leg.x, TABLE_HEIGHT / 2, leg.z]} castShadow>
			<T.CylinderGeometry args={[0.06, 0.075, TABLE_HEIGHT, 20]} />
			<ToonMaterial color={toonPalette.cream} />
			<Ink />
		</T.Mesh>
	{/each}
	<T.Mesh position.y={TABLE_HEIGHT} castShadow receiveShadow>
		<RoundedBoxGeometry args={[1.62, 0.08, 1.62]} radius={0.035} smoothness={4} />
		<ToonMaterial color={toonPalette.cream} />
		<Ink />
	</T.Mesh>

	<T.Mesh position.y={TABLE_HEIGHT + 0.065} castShadow receiveShadow>
		<RoundedBoxGeometry args={[FRAME_SIZE, 0.07, FRAME_SIZE]} radius={0.04} smoothness={4} />
		<ToonMaterial color={toonPalette.lavenderLight} />
		<Ink />
	</T.Mesh>

	{#each frameDecorations as decoration (`${decoration.x}:${decoration.z}`)}
		{#if decoration.kind === 0}
			<T.Mesh position={[decoration.x, BOARD_TOP + 0.01, decoration.z]}>
				<T.SphereGeometry args={[0.022, 14, 10]} />
				<ToonMaterial color={decoration.x > 0 ? toonPalette.lavenderDeep : toonPalette.gold} />
				<Ink thickness={0.005} />
			</T.Mesh>
		{/if}
		{#if decoration.kind !== 0}
			<T.Mesh position={[decoration.x, BOARD_TOP + 0.002, decoration.z]} rotation.x={-Math.PI / 2}>
				<T.ShapeGeometry args={[decoration.kind === 1 ? starShape : moonShape]} />
				<ToonMaterial color={decoration.kind === 1 ? toonPalette.purple : toonPalette.gold} />
			</T.Mesh>
		{/if}
	{/each}

	<T.Group position.y={BOARD_TOP}>
		{#each tileMeshes as tiles (tiles.uuid)}
			<T is={tiles} />
		{/each}
		<T.Group position.y={0.01}>
			{#each pieceMeshes as pieces (pieces.uuid)}
				<T is={pieces}>
					<Ink thickness={0.006} />
				</T>
			{/each}
		</T.Group>
	</T.Group>

	{#each [-1, 1] as side (side)}
		<T.Mesh position={[0, 0.12, side * 1.2]} scale={[1, 0.45, 1]} castShadow receiveShadow>
			<T.SphereGeometry args={[0.32, 32, 20]} />
			<ToonMaterial color={toonPalette.lavender} />
			<Ink />
		</T.Mesh>
	{/each}
</T.Group>
