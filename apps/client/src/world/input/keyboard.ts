// Per-frame keyboard state. Plain mutable data, read inside frame tasks.

const pressedKeyCodes = new Set<string>()

const handleKeyDown = (event: KeyboardEvent) => {
	pressedKeyCodes.add(event.code)
}

const handleKeyUp = (event: KeyboardEvent) => {
	pressedKeyCodes.delete(event.code)
}

const handleBlur = () => {
	pressedKeyCodes.clear()
}

export const attachKeyboard = () => {
	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
	window.addEventListener('blur', handleBlur)

	return () => {
		window.removeEventListener('keydown', handleKeyDown)
		window.removeEventListener('keyup', handleKeyUp)
		window.removeEventListener('blur', handleBlur)
		pressedKeyCodes.clear()
	}
}

export const isKeyPressed = (code: string) => pressedKeyCodes.has(code)

export const isAnyKeyPressed = (codes: readonly string[]) => codes.some(isKeyPressed)
