import { CanvasTexture, SRGBColorSpace } from 'three'

// Painted face for Smudge, projected onto the head along +z.
// Canvas covers faceDecal.size (head units) centered at faceDecal.center.

export const faceDecal = {
	center: [0, -0.03] as [number, number],
	size: [0.43, 0.269] as [number, number]
}

const WIDTH = 1024
const HEIGHT = 640
const EYE_Y = 270
const EYE_OFFSET_X = 208
const NOSE_Y = 404
const MOUTH_Y = 444
const INK = '#2a1f30'

type PaintT = CanvasRenderingContext2D

const createCanvas = () => {
	const canvas = document.createElement('canvas')
	canvas.width = WIDTH
	canvas.height = HEIGHT
	const context = canvas.getContext('2d')
	if (!context) throw new Error('2D canvas not available')
	return { canvas, context }
}

const paintEyeshadow = (paint: PaintT, eyeX: number, side: number) => {
	const centerX = eyeX + side * 24
	const centerY = EYE_Y - 62
	const glow = paint.createRadialGradient(centerX, centerY, 10, centerX, centerY, 150)
	glow.addColorStop(0, 'rgba(112, 88, 150, 1)')
	glow.addColorStop(0.55, 'rgba(140, 116, 176, 0.75)')
	glow.addColorStop(1, 'rgba(170, 150, 200, 0)')
	paint.save()
	paint.translate(centerX, centerY)
	paint.rotate(side * 0.18)
	paint.scale(1.15, 0.58)
	paint.translate(-centerX, -centerY)
	paint.fillStyle = glow
	paint.beginPath()
	paint.arc(centerX, centerY, 150, 0, Math.PI * 2)
	paint.fill()
	paint.restore()

	// A few dry-brush strokes so it reads as smudged makeup, not a flat blob.
	paint.strokeStyle = 'rgba(96, 74, 128, 0.35)'
	paint.lineCap = 'round'

	for (let stroke = 0; stroke < 7; stroke += 1) {
		const offset = (stroke - 3) * 16
		paint.lineWidth = 6 + (stroke % 3) * 3
		paint.beginPath()
		paint.moveTo(centerX + offset - side * 60, centerY - 18 + (stroke % 2) * 10)
		paint.lineTo(centerX + offset + side * 50, centerY - 34 + (stroke % 3) * 8)
		paint.stroke()
	}
}

// Almond eye, a little lidded on top for Smudge's smug look.
const traceEyeShape = (paint: PaintT, eyeX: number, side: number) => {
	const inner = eyeX - side * 78
	const outer = eyeX + side * 82
	paint.beginPath()
	paint.moveTo(inner, EYE_Y - 30)
	paint.bezierCurveTo(eyeX - side * 40, EYE_Y - 70, eyeX + side * 50, EYE_Y - 76, outer, EYE_Y - 44)
	paint.bezierCurveTo(eyeX + side * 104, EYE_Y + 40, eyeX + side * 40, EYE_Y + 112, eyeX, EYE_Y + 110)
	paint.bezierCurveTo(eyeX - side * 60, EYE_Y + 108, inner - side * 16, EYE_Y + 40, inner, EYE_Y - 30)
	paint.closePath()
}

const paintOpenEye = (paint: PaintT, eyeX: number, side: number) => {
	traceEyeShape(paint, eyeX, side)
	const iris = paint.createLinearGradient(0, EYE_Y - 70, 0, EYE_Y + 110)
	iris.addColorStop(0, '#1d1322')
	iris.addColorStop(0.45, '#3c2a44')
	iris.addColorStop(0.72, '#8a6247')
	iris.addColorStop(1, '#d6a66a')
	paint.fillStyle = iris
	paint.fill()

	paint.save()
	traceEyeShape(paint, eyeX, side)
	paint.clip()
	paint.fillStyle = 'rgba(12, 6, 16, 0.85)'
	paint.beginPath()
	paint.ellipse(eyeX + side * 6, EYE_Y + 14, 34, 52, 0, 0, Math.PI * 2)
	paint.fill()
	paint.restore()

	paint.fillStyle = '#ffffff'
	paint.beginPath()
	paint.ellipse(eyeX - side * 26, EYE_Y - 18, 26, 30, -0.3, 0, Math.PI * 2)
	paint.fill()
	paint.beginPath()
	paint.arc(eyeX + side * 30, EYE_Y + 62, 11, 0, Math.PI * 2)
	paint.fill()
	paint.beginPath()
	paint.arc(eyeX + side * 2, EYE_Y + 80, 5, 0, Math.PI * 2)
	paint.fill()

	paintLashLine(paint, eyeX, side)

	paint.strokeStyle = 'rgba(42, 31, 48, 0.7)'
	paint.lineWidth = 5
	paint.beginPath()
	paint.moveTo(eyeX + side * 20, EYE_Y + 116)
	paint.quadraticCurveTo(eyeX + side * 70, EYE_Y + 96, eyeX + side * 92, EYE_Y + 50)
	paint.stroke()
}

// Thick upper lash line that kicks out into a flick at the outer corner.
const paintLashLine = (paint: PaintT, eyeX: number, side: number) => {
	paint.strokeStyle = INK
	paint.lineCap = 'round'
	paint.lineJoin = 'round'
	paint.lineWidth = 15
	paint.beginPath()
	paint.moveTo(eyeX - side * 84, EYE_Y - 24)
	paint.bezierCurveTo(eyeX - side * 40, EYE_Y - 72, eyeX + side * 50, EYE_Y - 80, eyeX + side * 90, EYE_Y - 46)
	paint.quadraticCurveTo(eyeX + side * 112, EYE_Y - 62, eyeX + side * 130, EYE_Y - 96)
	paint.stroke()
	paint.lineWidth = 9
	paint.beginPath()
	paint.moveTo(eyeX + side * 96, EYE_Y - 30)
	paint.quadraticCurveTo(eyeX + side * 118, EYE_Y - 36, eyeX + side * 132, EYE_Y - 56)
	paint.stroke()
}

const paintClosedEye = (paint: PaintT, eyeX: number, side: number) => {
	paint.strokeStyle = INK
	paint.lineCap = 'round'
	paint.lineWidth = 15
	paint.beginPath()
	paint.moveTo(eyeX - side * 80, EYE_Y + 10)
	paint.quadraticCurveTo(eyeX, EYE_Y + 62, eyeX + side * 86, EYE_Y + 4)
	paint.quadraticCurveTo(eyeX + side * 108, EYE_Y - 10, eyeX + side * 124, EYE_Y - 40)
	paint.stroke()
}

const paintBlush = (paint: PaintT, side: number) => {
	const centerX = WIDTH / 2 + side * 300
	const centerY = NOSE_Y - 4
	const blush = paint.createRadialGradient(centerX, centerY, 4, centerX, centerY, 80)
	blush.addColorStop(0, 'rgba(255, 150, 175, 0.6)')
	blush.addColorStop(1, 'rgba(255, 170, 190, 0)')
	paint.fillStyle = blush
	paint.beginPath()
	paint.ellipse(centerX, centerY, 90, 56, 0, 0, Math.PI * 2)
	paint.fill()
}

const paintNoseAndMouth = (paint: PaintT) => {
	const centerX = WIDTH / 2
	paint.fillStyle = '#f59bb2'
	paint.strokeStyle = 'rgba(42, 31, 48, 0.55)'
	paint.lineWidth = 4
	paint.beginPath()
	paint.moveTo(centerX - 22, NOSE_Y - 12)
	paint.quadraticCurveTo(centerX, NOSE_Y - 20, centerX + 22, NOSE_Y - 12)
	paint.quadraticCurveTo(centerX + 8, NOSE_Y + 14, centerX, NOSE_Y + 16)
	paint.quadraticCurveTo(centerX - 8, NOSE_Y + 14, centerX - 22, NOSE_Y - 12)
	paint.fill()
	paint.stroke()

	paint.strokeStyle = INK
	paint.lineWidth = 8
	paint.lineCap = 'round'
	paint.beginPath()
	paint.moveTo(centerX, NOSE_Y + 16)
	paint.lineTo(centerX, MOUTH_Y - 6)
	paint.moveTo(centerX - 46, MOUTH_Y - 10)
	paint.quadraticCurveTo(centerX - 26, MOUTH_Y + 26, centerX, MOUTH_Y - 6)
	paint.quadraticCurveTo(centerX + 26, MOUTH_Y + 26, centerX + 46, MOUTH_Y - 10)
	paint.stroke()
}

const createFaceTexture = (isEyesOpen: boolean) => {
	const painting = createCanvas()
	const paint = painting.context
	const sides = [-1, 1]

	sides.forEach((side) => {
		const eyeX = WIDTH / 2 + side * EYE_OFFSET_X
		paintEyeshadow(paint, eyeX, side)
		if (isEyesOpen) paintOpenEye(paint, eyeX, side)
		if (!isEyesOpen) paintClosedEye(paint, eyeX, side)
		paintBlush(paint, side)
	})

	paintNoseAndMouth(paint)
	const texture = new CanvasTexture(painting.canvas)
	texture.colorSpace = SRGBColorSpace
	texture.anisotropy = 8
	return texture
}

let cachedTextures: { open: CanvasTexture; closed: CanvasTexture } | null = null

export const getFaceTextures = () => {
	cachedTextures = cachedTextures ?? { open: createFaceTexture(true), closed: createFaceTexture(false) }
	return cachedTextures
}
