import type { AppearanceT, LifeStageT } from '@minion-campus/sim'
import { Color } from 'three'

// Turns sim appearance genes into concrete model parameters. Pure and stable per minion.

export type SpotT = { x: number; y: number; z: number; size: number }

export type MinionLookT = {
	scale: number
	bodyScale: [number, number, number]
	bodyColor: string
	accentColor: string
	bellyColor: string
	earHeight: number
	earsAreFloppy: boolean
	hasHorns: boolean
	hornSize: number
	tailLength: number
	armSize: number
	pattern: AppearanceT['pattern']
	spots: SpotT[]
	stripeCount: number
}

const lifeStageScale: Record<LifeStageT, number> = {
	baby: 0.7,
	young: 0.86,
	adult: 1,
	elder: 0.96
}

// Overall minion size relative to the Headmaster.
const BASE_SCALE = 1.35

const toHex = (hue: number, saturation: number, lightness: number) =>
	`#${new Color().setHSL(hue / 360, saturation, lightness).getHexString()}`

// Small seeded generator so pattern placement is the same every visit.
const createPatternRandom = (seedText: string) => {
	let state = [...seedText].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0

	return () => {
		state = (state + 0x6d2b79f5) >>> 0
		let mixed = Math.imul(state ^ (state >>> 15), state | 1)
		mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
		return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
	}
}

// Points on the upper/back half of a unit sphere, away from the face (+z).
const createSpots = (seedText: string, count: number, minSize: number, maxSize: number) => {
	const random = createPatternRandom(seedText)

	return Array.from({ length: count }, () => {
		const angle = Math.PI * 0.35 + random() * Math.PI * 1.3
		const height = -0.2 + random() * 0.85
		const ring = Math.sqrt(1 - height * height)
		return { x: Math.sin(angle) * ring, y: height, z: Math.cos(angle) * ring, size: minSize + random() * (maxSize - minSize) }
	})
}

const getSpots = (minionId: string, appearance: AppearanceT) => {
	if (appearance.pattern === 'spots') return createSpots(minionId, 4 + Math.round(appearance.patternDensity * 7), 0.06, 0.11)
	if (appearance.pattern === 'patches') return createSpots(minionId, 2 + Math.round(appearance.patternDensity * 2), 0.16, 0.24)
	return []
}

export const getMinionLook = (minionId: string, appearance: AppearanceT, lifeStage: LifeStageT): MinionLookT => {
	const width = 0.92 + appearance.chunkiness * 0.32 + appearance.muscularity * 0.08
	const height = 0.82 + (1 - appearance.chunkiness) * 0.26

	return {
		scale: BASE_SCALE * (0.82 + appearance.size * 0.42) * lifeStageScale[lifeStage],
		bodyScale: [width, height, width * 0.94],
		bodyColor: toHex(appearance.primaryHue, appearance.saturation, appearance.lightness),
		accentColor: toHex(appearance.secondaryHue, appearance.saturation * 0.9, Math.max(0.45, appearance.lightness - 0.12)),
		bellyColor: toHex(appearance.primaryHue, appearance.saturation * 0.45, Math.min(0.94, appearance.lightness + 0.1)),
		earHeight: 0.14 + appearance.earLength * 0.32,
		earsAreFloppy: appearance.earLength > 0.72,
		hasHorns: appearance.hornSize > 0.55,
		hornSize: 0.08 + (appearance.hornSize - 0.55) * 0.3,
		tailLength: 0.08 + appearance.tailLength * 0.36,
		armSize: 0.08 + appearance.muscularity * 0.06,
		pattern: appearance.pattern,
		spots: getSpots(minionId, appearance),
		stripeCount: appearance.pattern === 'stripes' ? 2 + Math.round(appearance.patternDensity * 2) : 0
	}
}
