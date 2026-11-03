<script lang="ts">
	import { T } from '@threlte/core'
	import { ExtrudeGeometry, Shape } from 'three'
	import Ink from '../toon/Ink.svelte'
	import { createMoonShape, createStadiumShape, createStarShape, getStadiumPoint } from '../toon/shapes'
	import ToonMaterial from '../toon/ToonMaterial.svelte'
	import { toonPalette } from '../toon/toonPalette'
	import { trackLanes, trackStraight } from './runningTrackLayout'

	// Oval track from the illustration: purple border, lavender and butter lanes,
	// dashed inner line, checkered start box and two pennant flags.

	const LAYER_DEPTH = 0.03
	const LAYER_STEP = 0.012
	const DASH_COUNT = 44
	const CHECKER_COLUMNS = 16

	const createLayerGeometry = (radius: number) =>
		new ExtrudeGeometry(createStadiumShape(trackStraight, radius), {
			depth: LAYER_DEPTH,
			bevelEnabled: true,
			bevelThickness: 0.006,
			bevelSize: 0.006,
			bevelSegments: 2,
			curveSegments: 48
		})

	const layers = trackLanes.map((lane, index) => ({
		geometry: createLayerGeometry(lane.radius),
		color: toonPalette[lane.color],
		height: LAYER_DEPTH + index * LAYER_STEP
	}))

	const topHeight = LAYER_DEPTH + trackLanes.length * LAYER_STEP

	const dashes = Array.from({ length: DASH_COUNT }, (unused, index) => {
		const point = getStadiumPoint(trackStraight, 1.9, index / DASH_COUNT)
		const next = getStadiumPoint(trackStraight, 1.9, (index + 0.01) / DASH_COUNT)
		return { x: point.x, z: point.y, angle: Math.atan2(next.x - point.x, next.y - point.y) }
	})

	const checkerSize = 2 / CHECKER_COLUMNS
	const checkers = Array.from({ length: CHECKER_COLUMNS * 2 }, (unused, index) => {
		const column = index % CHECKER_COLUMNS
		const row = Math.floor(index / CHECKER_COLUMNS)
		const isButter = (column + row) % 2 === 0
		return { x: -1 + checkerSize * (column + 0.5), z: 2.33 + (row - 0.5) * checkerSize, isButter }
	})

	const createPennantShape = () => {
		const shape = new Shape()
		shape.moveTo(0, 0)
		shape.lineTo(0.42, 0.02)
		shape.lineTo(0.34, 0.12)
		shape.lineTo(0.42, 0.22)
		shape.lineTo(0, 0.24)
		shape.lineTo(0, 0)
		return shape
	}

	const pennantGeometry = new ExtrudeGeometry(createPennantShape(), { depth: 0.015, bevelEnabled: false })
	const starShape = createStarShape(0.07, 0.03)
	const moonShape = createMoonShape(0.06)

	const borderStars = [0.06, 0.19, 0.31, 0.44, 0.56, 0.69, 0.81, 0.94].map((progress, index) => {
		const point = getStadiumPoint(trackStraight, 3.1, progress)
		return { x: point.x, z: point.y, isStar: index % 2 === 0 }
	})

	const flags = [
		{ x: -1.6, color: toonPalette.lavender, isStar: true },
		{ x: 1.6, color: toonPalette.butter, isStar: false }
	]
</script>

<T.Group>
	{#each layers as layer (layer.height)}
		<T.Mesh geometry={layer.geometry} position.y={layer.height} rotation.x={Math.PI / 2} receiveShadow>
			<ToonMaterial color={layer.color} />
			<Ink thickness={0.02} />
		</T.Mesh>
	{/each}

	{#each dashes as dash (dash.x * 1000 + dash.z)}
		<T.Mesh position={[dash.x, topHeight - LAYER_STEP + 0.004, dash.z]} rotation.y={dash.angle}>
			<T.BoxGeometry args={[0.05, 0.006, 0.16]} />
			<ToonMaterial color={toonPalette.butter} />
		</T.Mesh>
	{/each}

	{#each checkers as checker (checker.x * 1000 + checker.z)}
		<T.Mesh position={[checker.x, LAYER_DEPTH + 3 * LAYER_STEP + 0.003, checker.z]}>
			<T.BoxGeometry args={[checkerSize, 0.006, checkerSize]} />
			<ToonMaterial color={checker.isButter ? toonPalette.butter : toonPalette.lavender} />
		</T.Mesh>
	{/each}

	{#each [-1, 1] as lineX (lineX)}
		<T.Mesh position={[lineX, topHeight, 2.25]}>
			<T.BoxGeometry args={[0.03, 0.01, 1.9]} />
			<ToonMaterial color={toonPalette.ink} />
		</T.Mesh>
	{/each}

	{#each borderStars as decoration (decoration.x * 1000 + decoration.z)}
		<T.Mesh position={[decoration.x, LAYER_DEPTH + 0.004, decoration.z]} rotation.x={-Math.PI / 2}>
			<T.ShapeGeometry args={[decoration.isStar ? starShape : moonShape]} />
			<ToonMaterial color={decoration.isStar ? toonPalette.butter : toonPalette.lavenderPale} />
		</T.Mesh>
	{/each}

	{#each flags as flag (flag.x)}
		<T.Group position={[flag.x, 0, -3.2]}>
			<T.Mesh position.y={0.4} castShadow>
				<T.CylinderGeometry args={[0.018, 0.018, 0.8, 12]} />
				<ToonMaterial color={toonPalette.ink} />
			</T.Mesh>
			<T.Mesh position.y={0.81}>
				<T.SphereGeometry args={[0.035, 12, 12]} />
				<ToonMaterial color={toonPalette.cream} />
				<Ink thickness={0.008} />
			</T.Mesh>
			<T.Mesh geometry={pennantGeometry} position={[0.018, 0.54, -0.008]} castShadow>
				<ToonMaterial color={flag.color} />
				<Ink thickness={0.01} />
			</T.Mesh>
			<T.Mesh position={[0.17, 0.66, 0.012]}>
				<T.ShapeGeometry args={[flag.isStar ? starShape : moonShape]} />
				<ToonMaterial color={flag.isStar ? toonPalette.lavenderPale : toonPalette.lavenderDeep} />
			</T.Mesh>
		</T.Group>
	{/each}
</T.Group>
