import { interactionState } from '../interaction/interactionState.svelte'
import { cameraModeState } from './cameraMode.svelte'

// Third-person orbit camera. Left/right drag or mouse look orbits, wheel zooms.
// Per-frame data: plain mutable object, not reactive.

export const orbitSettings = {
	minPitch: 0.15,
	maxPitch: 1.25,
	minDistance: 3.5,
	maxDistance: 14,
	dragRotateSpeed: 0.005,
	mouseLookRotateSpeed: 0.0025,
	zoomSpeed: 0.006,
	followSharpness: 10,
	targetHeight: 1.1
} as const

export const orbitState = {
	yaw: 0,
	pitch: 0.45,
	distance: 8,
	isPointerHeld: false,
	isDragging: false,
	pressX: 0,
	pressY: 0,
	lastPointerX: 0,
	lastPointerY: 0
}

const LEFT_MOUSE_BUTTON = 0
const RIGHT_MOUSE_BUTTON = 2

// A left press that moves less than this stays a click (future click-to-interact).
const DRAG_THRESHOLD_PIXELS = 5

let controlledElement: HTMLElement | null = null

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const rotateBy = (deltaX: number, deltaY: number, speed: number) => {
	orbitState.yaw -= deltaX * speed
	const nextPitch = orbitState.pitch + deltaY * speed
	orbitState.pitch = clamp(nextPitch, orbitSettings.minPitch, orbitSettings.maxPitch)
}

const isFreeToLook = () => interactionState.mode === 'free'

// Pointer lock can be refused (no user gesture yet). Clicking the canvas retries.
export const requestMouseLook = async () => {
	if (!controlledElement || cameraModeState.isPointerLocked || !isFreeToLook()) return
	await Promise.resolve(controlledElement.requestPointerLock()).catch(() => undefined)
}

export const releaseMouseLook = () => {
	if (!cameraModeState.isPointerLocked) return
	document.exitPointerLock()
}

const toggleCameraMode = () => {
	if (cameraModeState.mode === 'drag') {
		cameraModeState.mode = 'mouseLook'
		requestMouseLook()
		return
	}

	cameraModeState.mode = 'drag'
	releaseMouseLook()
}

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.code !== 'Tab') return
	event.preventDefault()
	if (event.repeat) return
	toggleCameraMode()
}

// Unlocked while free (e.g. browser Esc) → back to drag. Unlocked for UI → keep mouse look.
const handlePointerLockChange = () => {
	const isLocked = document.pointerLockElement === controlledElement
	cameraModeState.isPointerLocked = isLocked
	if (isLocked || !isFreeToLook()) return
	cameraModeState.mode = 'drag'
}

const isDragButton = (button: number) => button === LEFT_MOUSE_BUTTON || button === RIGHT_MOUSE_BUTTON

const handlePointerDown = (event: PointerEvent) => {
	const isMouseLookWaiting = cameraModeState.mode === 'mouseLook' && !cameraModeState.isPointerLocked
	if (isMouseLookWaiting && event.button === LEFT_MOUSE_BUTTON) return requestMouseLook()
	if (cameraModeState.mode !== 'drag' || !isDragButton(event.button)) return
	const target = event.currentTarget as HTMLElement
	target.setPointerCapture(event.pointerId)
	orbitState.isPointerHeld = true
	orbitState.isDragging = event.button === RIGHT_MOUSE_BUTTON
	orbitState.pressX = event.clientX
	orbitState.pressY = event.clientY
	orbitState.lastPointerX = event.clientX
	orbitState.lastPointerY = event.clientY
}

const hasPassedDragThreshold = (event: PointerEvent) => {
	const distance = Math.hypot(event.clientX - orbitState.pressX, event.clientY - orbitState.pressY)
	return distance >= DRAG_THRESHOLD_PIXELS
}

const handlePointerMove = (event: PointerEvent) => {
	if (!orbitState.isPointerHeld) return
	if (!orbitState.isDragging && hasPassedDragThreshold(event)) orbitState.isDragging = true
	if (!orbitState.isDragging) return
	const deltaX = event.clientX - orbitState.lastPointerX
	const deltaY = event.clientY - orbitState.lastPointerY
	orbitState.lastPointerX = event.clientX
	orbitState.lastPointerY = event.clientY
	rotateBy(deltaX, deltaY, orbitSettings.dragRotateSpeed)
}

const handleMouseLookMove = (event: MouseEvent) => {
	if (!cameraModeState.isPointerLocked) return
	rotateBy(event.movementX, event.movementY, orbitSettings.mouseLookRotateSpeed)
}

const handlePointerUp = (event: PointerEvent) => {
	if (!isDragButton(event.button)) return
	orbitState.isPointerHeld = false
	orbitState.isDragging = false
}

const handleWheel = (event: WheelEvent) => {
	event.preventDefault()
	const nextDistance = orbitState.distance + event.deltaY * orbitSettings.zoomSpeed
	orbitState.distance = clamp(nextDistance, orbitSettings.minDistance, orbitSettings.maxDistance)
}

const handleContextMenu = (event: MouseEvent) => {
	event.preventDefault()
}

export const attachOrbitControls = (element: HTMLElement) => {
	controlledElement = element
	element.addEventListener('pointerdown', handlePointerDown)
	element.addEventListener('pointermove', handlePointerMove)
	element.addEventListener('pointerup', handlePointerUp)
	element.addEventListener('wheel', handleWheel, { passive: false })
	element.addEventListener('contextmenu', handleContextMenu)
	document.addEventListener('mousemove', handleMouseLookMove)
	document.addEventListener('pointerlockchange', handlePointerLockChange)
	window.addEventListener('keydown', handleKeyDown)

	return () => {
		element.removeEventListener('pointerdown', handlePointerDown)
		element.removeEventListener('pointermove', handlePointerMove)
		element.removeEventListener('pointerup', handlePointerUp)
		element.removeEventListener('wheel', handleWheel)
		element.removeEventListener('contextmenu', handleContextMenu)
		document.removeEventListener('mousemove', handleMouseLookMove)
		document.removeEventListener('pointerlockchange', handlePointerLockChange)
		window.removeEventListener('keydown', handleKeyDown)
		releaseMouseLook()
		orbitState.isPointerHeld = false
		orbitState.isDragging = false
		controlledElement = null
	}
}

// Ground-plane directions relative to where the camera looks.
export const getCameraForward = () => ({ x: -Math.sin(orbitState.yaw), z: -Math.cos(orbitState.yaw) })

export const getCameraRight = () => ({ x: Math.cos(orbitState.yaw), z: -Math.sin(orbitState.yaw) })
