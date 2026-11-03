import type { BufferGeometry } from 'three'
import { BoxGeometry, ConeGeometry, CylinderGeometry, Euler, InstancedMesh, LatheGeometry, Matrix4, MeshToonMaterial, Quaternion, SphereGeometry, Vector2, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { toonGradient } from '../toon/toonGradient'
import { toonPalette } from '../toon/toonPalette'

// Chibi chess pieces from the illustration, merged per type and drawn instanced.
// Units: one board tile is 0.16. Pieces face +z.

export type PieceTypeT = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export const boardTileSize = 0.16

const lathe = (points: number[][]) => new LatheGeometry(points.map((point) => new Vector2(point[0], point[1])), 32)

const place = (geometry: BufferGeometry, position: number[], rotation: number[] = [0, 0, 0], scale: number[] = [1, 1, 1]) => {
	const matrix = new Matrix4().compose(
		new Vector3(position[0], position[1], position[2]),
		new Quaternion().setFromEuler(new Euler(rotation[0], rotation[1], rotation[2])),
		new Vector3(scale[0], scale[1], scale[2])
	)
	return geometry.applyMatrix4(matrix)
}

// mergeGeometries needs matching attributes: drop uvs and make everything non-indexed.
const merge = (parts: BufferGeometry[]) => {
	const cleaned = parts.map((part) => {
		const flat = part.index ? part.toNonIndexed() : part
		flat.deleteAttribute('uv')
		return flat
	})
	const merged = mergeGeometries(cleaned)
	if (!merged) throw new Error('Could not merge chess piece geometry')
	return merged
}

const basePoints = [[0, 0], [0.066, 0], [0.068, 0.02], [0.052, 0.034]]

const createPawn = () => merge([
	lathe([...basePoints, [0.046, 0.06], [0.036, 0.092], [0, 0.092]]),
	place(new SphereGeometry(0.04, 24, 16), [0, 0.118, 0])
])

const createRook = () => {
	const merlons = [0, 1, 2, 3].map((index) => {
		const angle = (index / 4) * Math.PI * 2 + Math.PI / 4
		return place(new BoxGeometry(0.03, 0.03, 0.03), [Math.cos(angle) * 0.042, 0.2, Math.sin(angle) * 0.042], [0, -angle, 0])
	})
	return merge([lathe([...basePoints, [0.046, 0.13], [0.06, 0.15], [0.06, 0.185], [0, 0.185]]), ...merlons])
}

const createBishop = () => merge([
	lathe([...basePoints, [0.032, 0.08], [0.046, 0.12], [0.042, 0.16], [0.022, 0.195], [0, 0.205]]),
	place(new SphereGeometry(0.016, 12, 12), [0, 0.215, 0])
])

const createKnight = () => {
	const mane = [0, 1, 2, 3].map((index) => place(new ConeGeometry(0.018, 0.05, 10), [0, 0.13 + index * 0.025, -0.045 + index * 0.012], [-0.9, 0, 0]))
	return merge([
		lathe([...basePoints, [0, 0.034]]),
		place(new SphereGeometry(0.055, 24, 16), [0, 0.085, 0], [0, 0, 0], [1, 1.05, 1.2]),
		place(new SphereGeometry(0.045, 24, 16), [0, 0.165, 0.02]),
		place(new SphereGeometry(0.032, 20, 14), [0, 0.15, 0.065], [0, 0, 0], [0.9, 0.8, 1.1]),
		place(new ConeGeometry(0.014, 0.045, 10), [0.022, 0.215, 0.01]),
		place(new ConeGeometry(0.014, 0.045, 10), [-0.022, 0.215, 0.01]),
		...mane
	])
}

const createBunnyParts = (earSpread: number) => [
	lathe([...basePoints, [0, 0.034]]),
	place(new SphereGeometry(0.062, 24, 16), [0, 0.085, 0], [0, 0, 0], [1, 0.9, 1]),
	place(new SphereGeometry(0.05, 24, 16), [0, 0.16, 0.005]),
	place(new CylinderGeometry(0.014, 0.018, 0.08, 12), [earSpread, 0.235, 0], [0, 0, -earSpread * 4]),
	place(new CylinderGeometry(0.014, 0.018, 0.08, 12), [-earSpread, 0.235, 0], [0, 0, earSpread * 4]),
	place(new SphereGeometry(0.045, 16, 12), [0.062, 0.1, -0.02], [0, 0, 0], [0.35, 0.8, 0.9]),
	place(new SphereGeometry(0.045, 16, 12), [-0.062, 0.1, -0.02], [0, 0, 0], [0.35, 0.8, 0.9])
]

const createQueen = () => merge(createBunnyParts(0.024))

const createKing = () => {
	const crownPoints = [0, 1, 2, 3, 4].map((index) => {
		const angle = (index / 5) * Math.PI * 2
		return place(new ConeGeometry(0.009, 0.02, 8), [Math.cos(angle) * 0.022, 0.235, Math.sin(angle) * 0.022])
	})
	return merge([
		...createBunnyParts(0.034),
		place(new CylinderGeometry(0.026, 0.024, 0.025, 20), [0, 0.215, 0]),
		...crownPoints
	])
}

const pieceGeometryFactories: Record<PieceTypeT, () => BufferGeometry> = {
	pawn: createPawn,
	rook: createRook,
	knight: createKnight,
	bishop: createBishop,
	queen: createQueen,
	king: createKing
}

const backRow: PieceTypeT[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

type PlacementT = { type: PieceTypeT; column: number; row: number }

// Rows 0–1 are gold (front, +z), rows 6–7 violet.
const startingPlacements: PlacementT[] = [
	...backRow.map((type, column) => ({ type, column, row: 0 })),
	...backRow.map((unused, column) => ({ type: 'pawn' as const, column, row: 1 })),
	...backRow.map((unused, column) => ({ type: 'pawn' as const, column, row: 6 })),
	...backRow.map((type, column) => ({ type, column, row: 7 }))
]

const getTileCenter = (column: number, row: number) => ({
	x: (column - 3.5) * boardTileSize,
	z: (3.5 - row) * boardTileSize
})

const createInstancedSet = (type: PieceTypeT, isGold: boolean) => {
	const placements = startingPlacements.filter((placement) => placement.type === type && placement.row < 4 === isGold)
	const color = isGold ? toonPalette.pieceGold : toonPalette.pieceViolet
	const material = new MeshToonMaterial({ color, gradientMap: toonGradient })
	const mesh = new InstancedMesh(pieceGeometryFactories[type](), material, placements.length)
	const facing = new Quaternion().setFromEuler(new Euler(0, isGold ? Math.PI : 0, 0))

	placements.forEach((placement, index) => {
		const center = getTileCenter(placement.column, placement.row)
		mesh.setMatrixAt(index, new Matrix4().compose(new Vector3(center.x, 0, center.z), facing, new Vector3(1, 1, 1)))
	})

	mesh.castShadow = true
	mesh.instanceMatrix.needsUpdate = true
	return mesh
}

const pieceTypes = Object.keys(pieceGeometryFactories) as PieceTypeT[]

export const createChessPieceMeshes = () =>
	pieceTypes.flatMap((type) => [createInstancedSet(type, true), createInstancedSet(type, false)])

export const createTileMeshes = () => {
	const tileGeometry = new BoxGeometry(boardTileSize, 0.02, boardTileSize)
	const butterTiles = new InstancedMesh(tileGeometry, new MeshToonMaterial({ color: toonPalette.butter, gradientMap: toonGradient }), 32)
	const periwinkleTiles = new InstancedMesh(tileGeometry, new MeshToonMaterial({ color: toonPalette.periwinkle, gradientMap: toonGradient }), 32)
	let butterIndex = 0
	let periwinkleIndex = 0

	for (let row = 0; row < 8; row += 1) {
		for (let column = 0; column < 8; column += 1) {
			const center = getTileCenter(column, row)
			const matrix = new Matrix4().makeTranslation(center.x, 0, center.z)
			const isButter = (row + column) % 2 === 1
			if (isButter) butterTiles.setMatrixAt(butterIndex, matrix)
			if (isButter) butterIndex += 1
			if (!isButter) periwinkleTiles.setMatrixAt(periwinkleIndex, matrix)
			if (!isButter) periwinkleIndex += 1
		}
	}

	butterTiles.receiveShadow = true
	periwinkleTiles.receiveShadow = true
	return [butterTiles, periwinkleTiles]
}
