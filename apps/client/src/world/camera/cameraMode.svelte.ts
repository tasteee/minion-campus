// Camera look mode. Tab toggles. Reactive because the HUD shows it.
// drag: hold left or right mouse and drag to orbit. mouseLook: pointer lock, mouse moves the camera.

export type CameraModeT = 'drag' | 'mouseLook'

type CameraModeStateT = {
	mode: CameraModeT
	isPointerLocked: boolean
}

export const cameraModeState = $state<CameraModeStateT>({
	mode: 'drag',
	isPointerLocked: false
})
