// Signed distance helpers for sculpting smooth, blended shapes in code.
// Negative = inside. Shapes from Inigo Quilez's distance-function notes.

export type Vec3T = [number, number, number]

export type SdfT = (x: number, y: number, z: number) => number

const length3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z)

export const sphere = (center: Vec3T, radius: number): SdfT => (x, y, z) =>
	length3(x - center[0], y - center[1], z - center[2]) - radius

// Approximate ellipsoid distance (good enough near the surface).
export const ellipsoid = (center: Vec3T, radii: Vec3T): SdfT => (x, y, z) => {
	const px = (x - center[0]) / radii[0]
	const py = (y - center[1]) / radii[1]
	const pz = (z - center[2]) / radii[2]
	const k0 = length3(px, py, pz)
	const k1 = length3(px / radii[0], py / radii[1], pz / radii[2])
	if (k1 === 0) return -Math.min(radii[0], radii[1], radii[2])
	return (k0 * (k0 - 1)) / k1
}

// Capsule whose radius changes from start to end. Great for limbs, spikes and tufts.
export const roundCone = (start: Vec3T, end: Vec3T, startRadius: number, endRadius: number): SdfT => {
	const bx = end[0] - start[0]
	const by = end[1] - start[1]
	const bz = end[2] - start[2]
	const lengthSquared = bx * bx + by * by + bz * bz

	return (x, y, z) => {
		const px = x - start[0]
		const py = y - start[1]
		const pz = z - start[2]
		const along = Math.min(1, Math.max(0, (px * bx + py * by + pz * bz) / lengthSquared))
		const radius = startRadius + (endRadius - startRadius) * along
		return length3(px - bx * along, py - by * along, pz - bz * along) - radius
	}
}

// Polynomial smooth minimum: blends two shapes with a soft fillet of size k.
export const smoothMin = (a: number, b: number, k: number) => {
	const h = Math.max(k - Math.abs(a - b), 0) / k
	return Math.min(a, b) - h * h * k * 0.25
}

export const smoothUnion = (shapes: SdfT[], k: number): SdfT => (x, y, z) =>
	shapes.reduce((distance, shape) => smoothMin(distance, shape(x, y, z), k), Number.POSITIVE_INFINITY)

export const union = (shapes: SdfT[]): SdfT => (x, y, z) =>
	shapes.reduce((distance, shape) => Math.min(distance, shape(x, y, z)), Number.POSITIVE_INFINITY)

// Carve `cutter` out of `base` with a soft edge.
export const smoothSubtract = (base: SdfT, cutter: SdfT, k: number): SdfT => (x, y, z) =>
	-smoothMin(-base(x, y, z), cutter(x, y, z), k)

// 0 outside → 1 inside, fading over `softness` across the surface of `region`.
export const regionWeight = (region: SdfT, softness: number) => (x: number, y: number, z: number) => {
	const distance = region(x, y, z)
	const t = Math.min(1, Math.max(0, 0.5 - distance / softness))
	return t * t * (3 - 2 * t)
}
