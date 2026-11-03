import { Shape, Vector2 } from 'three'

// 2D shapes shared by several models.

export const createStarShape = (outerRadius: number, innerRadius: number, points = 5) => {
	const shape = new Shape()
	const total = points * 2

	for (let index = 0; index <= total; index += 1) {
		const angle = (index / total) * Math.PI * 2 + Math.PI / 2
		const radius = index % 2 === 0 ? outerRadius : innerRadius
		const x = Math.cos(angle) * radius
		const y = Math.sin(angle) * radius
		if (index === 0) shape.moveTo(x, y)
		if (index !== 0) shape.lineTo(x, y)
	}

	return shape
}

export const createMoonShape = (radius: number) => {
	const shape = new Shape()
	shape.absarc(0, 0, radius, Math.PI * 0.35, Math.PI * 1.65, false)
	shape.absarc(radius * 0.45, 0, radius * 0.78, Math.PI * 1.55, Math.PI * 0.45, true)
	return shape
}

// Rounded "stadium" outline: two half circles joined by straights along x.
export const createStadiumShape = (straightLength: number, radius: number) => {
	const halfStraight = straightLength / 2
	const shape = new Shape()
	shape.moveTo(-halfStraight, -radius)
	shape.lineTo(halfStraight, -radius)
	shape.absarc(halfStraight, 0, radius, -Math.PI / 2, Math.PI / 2, false)
	shape.lineTo(-halfStraight, radius)
	shape.absarc(-halfStraight, 0, radius, Math.PI / 2, Math.PI * 1.5, false)
	return shape
}

// Point on a stadium path at progress 0–1 (counter-clockwise from the front straight).
export const getStadiumPoint = (straightLength: number, radius: number, progress: number) => {
	const halfStraight = straightLength / 2
	const arcLength = Math.PI * radius
	const perimeter = straightLength * 2 + arcLength * 2
	let distance = (((progress % 1) + 1) % 1) * perimeter
	if (distance < straightLength) return new Vector2(-halfStraight + distance, radius)
	distance -= straightLength
	if (distance < arcLength) {
		const angle = Math.PI / 2 - distance / radius
		return new Vector2(halfStraight + Math.cos(angle) * radius, Math.sin(angle) * radius)
	}
	distance -= arcLength
	if (distance < straightLength) return new Vector2(halfStraight - distance, -radius)
	distance -= straightLength
	const angle = -Math.PI / 2 - distance / radius
	return new Vector2(-halfStraight + Math.cos(angle) * radius, Math.sin(angle) * radius)
}
