const MIN_TOAST_MS = 2600
const MS_PER_CHARACTER = 55

type ToastStateT = {
	message: string
	toastKey: number
}

export const toastState = $state<ToastStateT>({ message: '', toastKey: 0 })

let hideTimeoutId: ReturnType<typeof setTimeout> | undefined

export const showToast = (message: string) => {
	toastState.message = message
	toastState.toastKey += 1
	clearTimeout(hideTimeoutId)

	hideTimeoutId = setTimeout(() => {
		toastState.message = ''
	}, Math.max(MIN_TOAST_MS, message.length * MS_PER_CHARACTER))
}
