import { BufferAttribute, BufferGeometry, Color } from 'three'
import type { SdfT, Vec3T } from './sdf'

// Naive Surface Nets: turns a distance field into a smooth indexed mesh.
// Normals come from the field gradient, colors from a color function.

export type ColorFieldT = (x: number, y: number, z: number) => Color

export type SculptOptionsT = {
	sdf: SdfT
	color: ColorFieldT
	min: Vec3T
	max: Vec3T
	cellSize: number
}

const EDGE_PAIRS = [
	[0, 1], [2, 3], [4, 5], [6, 7],
	[0, 2], [1, 3], [4, 6], [5, 7],
	[0, 4], [1, 5], [2, 6], [3, 7]
]

const getGradient = (sdf: SdfT, x: number, y: number, z: number): Vec3T => {
	const step = 0.0015
	const gx = sdf(x + step, y, z) - sdf(x - step, y, z)
	const gy = sdf(x, y + step, z) - sdf(x, y - step, z)
	const gz = sdf(x, y, z + step) - sdf(x, y, z - step)
	const size = Math.hypot(gx, gy, gz) || 1
	return [gx / size, gy / size, gz / size]
}

const sampleGrid = (options: SculptOptionsT, counts: Vec3T) => {
	const values = new Float32Array(counts[0] * counts[1] * counts[2])
	let index = 0

	for (let k = 0; k < counts[2]; k += 1) {
		for (let j = 0; j < counts[1]; j += 1) {
			for (let i = 0; i < counts[0]; i += 1) {
				const x = options.min[0] + i * options.cellSize
				const y = options.min[1] + j * options.cellSize
				const z = options.min[2] + k * options.cellSize
				values[index] = options.sdf(x, y, z)
				index += 1
			}
		}
	}

	return values
}

// Flip any triangle whose face normal disagrees with the field gradient (outward).
const orientTriangles = (indices: number[], positions: number[], normals: Float32Array) => {
	for (let triangle = 0; triangle < indices.length; triangle += 3) {
		const a = indices[triangle] ?? 0
		const b = indices[triangle + 1] ?? 0
		const c = indices[triangle + 2] ?? 0
		const abX = (positions[b * 3] ?? 0) - (positions[a * 3] ?? 0)
		const abY = (positions[b * 3 + 1] ?? 0) - (positions[a * 3 + 1] ?? 0)
		const abZ = (positions[b * 3 + 2] ?? 0) - (positions[a * 3 + 2] ?? 0)
		const acX = (positions[c * 3] ?? 0) - (positions[a * 3] ?? 0)
		const acY = (positions[c * 3 + 1] ?? 0) - (positions[a * 3 + 1] ?? 0)
		const acZ = (positions[c * 3 + 2] ?? 0) - (positions[a * 3 + 2] ?? 0)
		const faceX = abY * acZ - abZ * acY
		const faceY = abZ * acX - abX * acZ
		const faceZ = abX * acY - abY * acX
		const normalX = (normals[a * 3] ?? 0) + (normals[b * 3] ?? 0) + (normals[c * 3] ?? 0)
		const normalY = (normals[a * 3 + 1] ?? 0) + (normals[b * 3 + 1] ?? 0) + (normals[c * 3 + 1] ?? 0)
		const normalZ = (normals[a * 3 + 2] ?? 0) + (normals[b * 3 + 2] ?? 0) + (normals[c * 3 + 2] ?? 0)
		const isInward = faceX * normalX + faceY * normalY + faceZ * normalZ < 0
		if (!isInward) continue
		indices[triangle + 1] = c
		indices[triangle + 2] = b
	}
}

export const sculptGeometry = (options: SculptOptionsT) => {
	const size = options.cellSize
	const counts: Vec3T = [
		Math.ceil((options.max[0] - options.min[0]) / size) + 1,
		Math.ceil((options.max[1] - options.min[1]) / size) + 1,
		Math.ceil((options.max[2] - options.min[2]) / size) + 1
	]
	const values = sampleGrid(options, counts)
	const sampleIndex = (i: number, j: number, k: number) => i + counts[0] * (j + counts[1] * k)
	const cellVertex = new Int32Array(counts[0] * counts[1] * counts[2]).fill(-1)
	const positions: number[] = []
	const indices: number[] = []
	const corner = new Float32Array(8)

	// One vertex per cell that the surface passes through, at the mean edge crossing.
	for (let k = 0; k < counts[2] - 1; k += 1) {
		for (let j = 0; j < counts[1] - 1; j += 1) {
			for (let i = 0; i < counts[0] - 1; i += 1) {
				let mask = 0

				for (let c = 0; c < 8; c += 1) {
					corner[c] = values[sampleIndex(i + (c & 1), j + ((c >> 1) & 1), k + ((c >> 2) & 1))] ?? 0
					if (corner[c]! < 0) mask |= 1 << c
				}

				if (mask === 0 || mask === 255) continue
				let sumX = 0
				let sumY = 0
				let sumZ = 0
				let crossings = 0

				for (const pair of EDGE_PAIRS) {
					const a = pair[0] ?? 0
					const b = pair[1] ?? 0
					const valueA = corner[a] ?? 0
					const valueB = corner[b] ?? 0
					if (valueA < 0 === valueB < 0) continue
					const t = valueA / (valueA - valueB)
					sumX += (a & 1) + ((b & 1) - (a & 1)) * t
					sumY += ((a >> 1) & 1) + (((b >> 1) & 1) - ((a >> 1) & 1)) * t
					sumZ += ((a >> 2) & 1) + (((b >> 2) & 1) - ((a >> 2) & 1)) * t
					crossings += 1
				}

				cellVertex[sampleIndex(i, j, k)] = positions.length / 3

				positions.push(
					options.min[0] + (i + sumX / crossings) * size,
					options.min[1] + (j + sumY / crossings) * size,
					options.min[2] + (k + sumZ / crossings) * size
				)
			}
		}
	}

	// Winding is fixed afterwards against the field gradient, so order here does not matter.
	const addQuad = (a: number, b: number, c: number, d: number) => {
		if (a < 0 || b < 0 || c < 0 || d < 0) return
		indices.push(a, b, c, a, c, d)
	}

	const vertexAt = (i: number, j: number, k: number) => cellVertex[sampleIndex(i, j, k)] ?? -1

	// One quad per grid edge the surface crosses, joining the four cells around it.
	for (let k = 1; k < counts[2] - 1; k += 1) {
		for (let j = 1; j < counts[1] - 1; j += 1) {
			for (let i = 1; i < counts[0] - 1; i += 1) {
				const here = (values[sampleIndex(i, j, k)] ?? 0) < 0
				const hasXCross = here !== (values[sampleIndex(i + 1, j, k)] ?? 0) < 0
				const hasYCross = here !== (values[sampleIndex(i, j + 1, k)] ?? 0) < 0
				const hasZCross = here !== (values[sampleIndex(i, j, k + 1)] ?? 0) < 0
				if (hasXCross) addQuad(vertexAt(i, j - 1, k - 1), vertexAt(i, j, k - 1), vertexAt(i, j, k), vertexAt(i, j - 1, k))
				if (hasYCross) addQuad(vertexAt(i - 1, j, k - 1), vertexAt(i - 1, j, k), vertexAt(i, j, k), vertexAt(i, j, k - 1))
				if (hasZCross) addQuad(vertexAt(i - 1, j - 1, k), vertexAt(i, j - 1, k), vertexAt(i, j, k), vertexAt(i - 1, j, k))
			}
		}
	}

	const vertexCount = positions.length / 3
	const normals = new Float32Array(vertexCount * 3)
	const colors = new Float32Array(vertexCount * 3)

	for (let vertex = 0; vertex < vertexCount; vertex += 1) {
		const x = positions[vertex * 3] ?? 0
		const y = positions[vertex * 3 + 1] ?? 0
		const z = positions[vertex * 3 + 2] ?? 0
		const gradient = getGradient(options.sdf, x, y, z)
		const color = options.color(x, y, z)
		normals.set(gradient, vertex * 3)
		colors.set([color.r, color.g, color.b], vertex * 3)
	}

	orientTriangles(indices, positions, normals)
	const geometry = new BufferGeometry()
	geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
	geometry.setAttribute('normal', new BufferAttribute(normals, 3))
	geometry.setAttribute('color', new BufferAttribute(colors, 3))
	geometry.setIndex(indices)
	geometry.computeBoundingSphere()
	return geometry
}
