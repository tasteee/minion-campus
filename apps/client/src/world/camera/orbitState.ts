// Third-person orbit camera state. Right-drag orbits, wheel zooms.
// Per-frame data: plain mutable object, not reactive.

export const orbitSettings = {
	minPitch: 0.15,
	maxPitch: 1.25,
	minDistance: 3.5,
	maxDistance: 14,
	rotateSpeed: 0.005,
	zoomSpeed: 0.006,
	followSharpness: 10,
	targetHeight: 1.1
} as const

export const orbitState = {
	yaw: 0,
	pitch: 0.45,
	distance: 8,
	isDragging: false,
	lastPointerX: 0,
	lastPointerY: 0
}

const RIGHT_MOUSE_BUTTON = 2

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const handlePointerDown = (event: PointerEvent) => {
	if (event.button !== RIGHT_MOUSE_BUTTON) return
	const target = event.currentTarget as HTMLElement
	target.setPointerCapture(event.pointerId)
	orbitState.isDragging = true
	orbitState.lastPointerX = event.clientX
	orbitState.lastPointerY = event.clientY
}

const handlePointerMove = (event: PointerEvent) => {
	if (!orbitState.isDragging) return
	const deltaX = event.clientX - orbitState.lastPointerX
	const deltaY = event.clientY - orbitState.lastPointerY
	orbitState.lastPointerX = event.clientX
	orbitState.lastPointerY = event.clientY
	orbitState.yaw -= deltaX * orbitSettings.rotateSpeed
	const nextPitch = orbitState.pitch + deltaY * orbitSettings.rotateSpeed
	orbitState.pitch = clamp(nextPitch, orbitSettings.minPitch, orbitSettings.maxPitch)
}

const handlePointerUp = (event: PointerEvent) => {
	if (event.button !== RIGHT_MOUSE_BUTTON) return
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
	element.addEventListener('pointerdown', handlePointerDown)
	element.addEventListener('pointermove', handlePointerMove)
	element.addEventListener('pointerup', handlePointerUp)
	element.addEventListener('wheel', handleWheel, { passive: false })
	element.addEventListener('contextmenu', handleContextMenu)

	return () => {
		element.removeEventListener('pointerdown', handlePointerDown)
		element.removeEventListener('pointermove', handlePointerMove)
		element.removeEventListener('pointerup', handlePointerUp)
		element.removeEventListener('wheel', handleWheel)
		element.removeEventListener('contextmenu', handleContextMenu)
		orbitState.isDragging = false
	}
}

// Ground-plane directions relative to where the camera looks.
export const getCameraForward = () => ({ x: -Math.sin(orbitState.yaw), z: -Math.cos(orbitState.yaw) })

export const getCameraRight = () => ({ x: Math.cos(orbitState.yaw), z: -Math.sin(orbitState.yaw) })
