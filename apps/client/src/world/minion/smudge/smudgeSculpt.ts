import { Color } from 'three'
import type { SdfT, Vec3T } from '../../sculpt/sdf'
import { ellipsoid, regionWeight, roundCone, smoothSubtract, smoothUnion, sphere, union } from '../../sculpt/sdf'
import { sculptGeometry } from '../../sculpt/surfaceNets'
import { smudgePalette } from './smudgePalette'

// Smudge sculpted as smooth distance-field parts. Each part lives in its joint's
// local space so the rig can move it; overlaps at the joints hide the seams.

const color = (hex: string) => new Color(hex)
const furColor = color(smudgePalette.fur)
const furShadeColor = color(smudgePalette.furShade)
const whiteColor = color(smudgePalette.white)
const pinkColor = color(smudgePalette.earInner)
const padColor = color(smudgePalette.pad)
const mohawkColor = color(smudgePalette.mohawk)
const streakColor = color(smudgePalette.mohawkStreak)

const mix = (from: Color, to: Color, amount: number) => from.clone().lerp(to, Math.min(1, Math.max(0, amount)))

const smoothstep = (edge0: number, edge1: number, value: number) => {
	const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
	return t * t * (3 - 2 * t)
}

const mirrorX = (point: Vec3T, side: number): Vec3T => [point[0] * side, point[1], point[2]]

// Squash a shape along x (e.g. flat mohawk spikes).
const squashX = (shape: SdfT, factor: number): SdfT => (x, y, z) => shape(x / factor, y, z) * factor

// Fur with a soft, darker back so the form reads under flat toon light.
const furAt = (z: number, y: number) => mix(furColor, furShadeColor, smoothstep(0.05, -0.25, z) * 0.6 + smoothstep(0.1, -0.2, y) * 0.2)

// ---------- Head ----------

const cheekTufts = [-1, 1].flatMap((side) => [
	roundCone(mirrorX([0.24, -0.06, 0.07], side), mirrorX([0.38, -0.02, 0.05], side), 0.05, 0.006),
	roundCone(mirrorX([0.25, -0.1, 0.07], side), mirrorX([0.4, -0.13, 0.04], side), 0.05, 0.006),
	roundCone(mirrorX([0.23, -0.14, 0.07], side), mirrorX([0.34, -0.21, 0.04], side), 0.045, 0.005)
])

const chinTufts = [-0.05, 0.05].map((tuftX) => roundCone([tuftX, -0.19, 0.11], [tuftX * 1.3, -0.26, 0.09], 0.035, 0.005))

const headSdf = union([
	smoothUnion([
		ellipsoid([0, 0.01, 0], [0.3, 0.275, 0.27]),
		ellipsoid([0.16, -0.085, 0.1], [0.15, 0.125, 0.15]),
		ellipsoid([-0.16, -0.085, 0.1], [0.15, 0.125, 0.15]),
		ellipsoid([0, -0.1, 0.15], [0.13, 0.09, 0.12]),
		ellipsoid([0, -0.15, 0.04], [0.17, 0.08, 0.14])
	], 0.07),
	smoothUnion([...cheekTufts, ...chinTufts], 0.02)
])

const headWhite = regionWeight(
	union([
		ellipsoid([0, -0.13, 0.13], [0.25, 0.12, 0.2]),
		ellipsoid([0.31, -0.1, 0.06], [0.12, 0.1, 0.12]),
		ellipsoid([-0.31, -0.1, 0.06], [0.12, 0.1, 0.12])
	]),
	0.035
)

const headColor = (x: number, y: number, z: number) => mix(furAt(z, y + 0.15), whiteColor, headWhite(x, y, z))

// ---------- Mohawk (shares the head's space) ----------

const mohawkSpikes = [
	{ angle: 0.78, height: 0.14 },
	{ angle: 0.52, height: 0.24 },
	{ angle: 0.26, height: 0.33 },
	{ angle: 0, height: 0.38 },
	{ angle: -0.28, height: 0.34 },
	{ angle: -0.56, height: 0.26 },
	{ angle: -0.84, height: 0.18 },
	{ angle: -1.1, height: 0.1 }
]

const createSpike = (angle: number, height: number) => {
	const base: Vec3T = [0, Math.cos(angle) * 0.25, Math.sin(angle) * 0.25]
	const lean = angle * 0.45 - 0.35
	const curl = lean - 0.35
	const mid: Vec3T = [0, base[1] + Math.cos(lean) * height * 0.55, base[2] + Math.sin(lean) * height * 0.55]
	const tip: Vec3T = [0, mid[1] + Math.cos(curl) * height * 0.45, mid[2] + Math.sin(curl) * height * 0.45]
	return smoothUnion([roundCone(base, mid, 0.085, 0.045), roundCone(mid, tip, 0.045, 0.004)], 0.025)
}

const sideTufts = [
	roundCone([0.22, 0.12, -0.08], [0.34, 0.2, -0.14], 0.04, 0.004),
	roundCone([0.24, 0.05, -0.1], [0.36, 0.08, -0.17], 0.035, 0.004),
	roundCone([0.2, 0.17, -0.03], [0.3, 0.27, -0.06], 0.035, 0.004)
]

// Two offset rows of spikes give the crest volume from the front.
const crestRow = (offsetX: number, heightScale: number) =>
	mohawkSpikes.map((spike) => {
		const spikeShape = createSpike(spike.angle + offsetX * 2, spike.height * heightScale)
		return (x: number, y: number, z: number) => spikeShape(x - offsetX, y, z)
	})

const mohawkSdf = union([
	union([
		squashX(smoothUnion([ellipsoid([0, 0.2, -0.02], [0.08, 0.1, 0.22]), ...crestRow(0, 1)], 0.03), 0.62),
		squashX(smoothUnion(crestRow(0.05, 0.72), 0.012), 0.5),
		squashX(smoothUnion(crestRow(-0.05, 0.68), 0.012), 0.5)
	]),
	squashX(roundCone([0, 0.25, 0.17], [0, 0.14, 0.265], 0.05, 0.006), 0.6),
	smoothUnion(sideTufts, 0.02)
])

const mohawkColorAt = (x: number, y: number, z: number) => {
	const streak = 0.5 + 0.5 * Math.sin(x * 140 + z * 18 + y * 6)
	return mix(mohawkColor, streakColor, smoothstep(0.6, 0.95, streak) * 0.85)
}

// ---------- Torso (origin at the hips) ----------

const chestTufts = [-0.1, -0.05, 0, 0.05, 0.1].map((tuftX) =>
	roundCone([tuftX, 0.21, 0.17 - Math.abs(tuftX) * 0.3], [tuftX * 1.2, 0.11 - Math.abs(tuftX) * 0.25, 0.215 - Math.abs(tuftX) * 0.35], 0.042, 0.005)
)

const neckTufts = [-1, 1].map((side) => roundCone(mirrorX([0.13, 0.3, 0.1], side), mirrorX([0.2, 0.22, 0.13], side), 0.04, 0.005))

const torsoSdf = union([
	smoothUnion([
		ellipsoid([0, 0.15, 0], [0.235, 0.25, 0.215]),
		ellipsoid([0, 0.06, 0.01], [0.22, 0.15, 0.2]),
		ellipsoid([0, 0.32, 0.01], [0.15, 0.1, 0.14])
	], 0.07),
	smoothUnion([...chestTufts, ...neckTufts], 0.022)
])

const torsoWhite = regionWeight(
	union([ellipsoid([0, 0.17, 0.15], [0.15, 0.2, 0.12]), ellipsoid([0, 0.05, 0.13], [0.13, 0.1, 0.1])]),
	0.035
)

const torsoColor = (x: number, y: number, z: number) => mix(furAt(z, y), whiteColor, torsoWhite(x, y, z))

// ---------- Ear (origin at the ear base, +z faces forward) ----------

const earSdf = smoothSubtract(
	smoothUnion([roundCone([0, 0, 0], [0, 0.12, 0], 0.06, 0.075), ellipsoid([0, 0.22, 0], [0.088, 0.21, 0.046])], 0.05),
	ellipsoid([0, 0.235, 0.042], [0.056, 0.17, 0.03]),
	0.02
)

const earInner = regionWeight(ellipsoid([0, 0.23, 0.03], [0.062, 0.18, 0.05]), 0.015)

const earColor = (x: number, y: number, z: number) => {
	const pinkAmount = earInner(x, y, z) * smoothstep(-0.005, 0.015, z)
	return mix(furAt(z, 0.2), pinkColor, pinkAmount)
}

// ---------- Arm (origin at the shoulder) ----------

const armSdf = smoothUnion([roundCone([0, 0, 0], [0, -0.1, 0.02], 0.058, 0.05), ellipsoid([0, -0.14, 0.03], [0.062, 0.058, 0.07])], 0.035)

const armColor = (x: number, y: number, z: number) => mix(furAt(z, 0.2), whiteColor, smoothstep(-0.085, -0.115, y))

// ---------- Leg (origin at the hip) ----------

const legSdf = smoothUnion([
	ellipsoid([0, -0.03, 0], [0.12, 0.13, 0.14]),
	roundCone([0, -0.09, 0], [0, -0.2, 0.01], 0.08, 0.066),
	ellipsoid([0, -0.245, 0.06], [0.088, 0.052, 0.142])
], 0.045)

const padRegion = union([
	ellipsoid([0, -0.297, 0.03], [0.045, 0.02, 0.052]),
	ellipsoid([0, -0.297, 0.118], [0.019, 0.02, 0.019]),
	ellipsoid([0.04, -0.297, 0.105], [0.018, 0.02, 0.018]),
	ellipsoid([-0.04, -0.297, 0.105], [0.018, 0.02, 0.018])
])

const padWeight = regionWeight(padRegion, 0.006)

const legColor = (x: number, y: number, z: number) => {
	const footColor = mix(furAt(z, y + 0.2), whiteColor, smoothstep(-0.17, -0.21, y))
	const isSole = smoothstep(-0.275, -0.29, y)
	return mix(footColor, padColor, padWeight(x, y, z) * isSole)
}

// ---------- Tail (origin at the tail root) ----------

const tailDirections: Vec3T[] = [
	[0, 1, 0], [0.8, 0.5, -0.2], [-0.8, 0.5, -0.2], [0.6, -0.4, -0.5], [-0.6, -0.4, -0.5],
	[0, 0.3, -1], [0.5, 0.8, -0.5], [-0.5, 0.8, -0.5], [0, -0.7, -0.4]
]

const tailSdf = smoothUnion([
	sphere([0, 0.01, -0.03], 0.09),
	...tailDirections.map((direction) => {
		const size = Math.hypot(direction[0], direction[1], direction[2])
		return roundCone([0, 0.01, -0.03], [direction[0] / size * 0.115, 0.01 + direction[1] / size * 0.115, -0.03 + direction[2] / size * 0.115], 0.055, 0.012)
	})
], 0.035)

const tailColor = (x: number, y: number, z: number) => mix(furColor, whiteColor, smoothstep(0.02, -0.06, z))

// ---------- Build (once, lazily) ----------

const buildGeometries = () => ({
	head: sculptGeometry({ sdf: headSdf, color: headColor, min: [-0.44, -0.32, -0.31], max: [0.44, 0.32, 0.33], cellSize: 0.011 }),
	mohawk: sculptGeometry({ sdf: mohawkSdf, color: mohawkColorAt, min: [-0.4, 0.05, -0.46], max: [0.4, 0.72, 0.34], cellSize: 0.0105 }),
	torso: sculptGeometry({ sdf: torsoSdf, color: torsoColor, min: [-0.3, -0.13, -0.26], max: [0.3, 0.46, 0.3], cellSize: 0.011 }),
	ear: sculptGeometry({ sdf: earSdf, color: earColor, min: [-0.11, -0.08, -0.07], max: [0.11, 0.45, 0.07], cellSize: 0.0075 }),
	arm: sculptGeometry({ sdf: armSdf, color: armColor, min: [-0.09, -0.22, -0.08], max: [0.09, 0.08, 0.12], cellSize: 0.0075 }),
	leg: sculptGeometry({ sdf: legSdf, color: legColor, min: [-0.14, -0.31, -0.16], max: [0.14, 0.12, 0.22], cellSize: 0.0062 }),
	tail: sculptGeometry({ sdf: tailSdf, color: tailColor, min: [-0.18, -0.17, -0.22], max: [0.18, 0.17, 0.12], cellSize: 0.008 })
})

export type SmudgeGeometriesT = ReturnType<typeof buildGeometries>

let cachedGeometries: SmudgeGeometriesT | null = null

export const getSmudgeGeometries = () => {
	// Built once on first use (~0.5–1 s). Could be baked at build time later.
	cachedGeometries = cachedGeometries ?? buildGeometries()
	return cachedGeometries
}
