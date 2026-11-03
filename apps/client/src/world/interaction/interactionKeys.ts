import { advanceDialogue, chooseDialogueOption, closeDialogue } from '../../ui/dialogue/dialogueState.svelte'
import { closeMinionMenu, performMinionActionAt } from '../../ui/minion-menu/minionMenuState.svelte'
import { interactWithFocused } from './interact'
import { interactionState } from './interactionState.svelte'

const ADVANCE_KEYS = ['KeyE', 'Space', 'Enter']

// "Digit1" → 0, "Digit9" → 8, anything else → null.
const getNumberKeyIndex = (code: string) => {
	const match = /^Digit([1-9])$/.exec(code)
	if (!match) return null
	return Number(match[1]) - 1
}

const handleDialogueKey = (event: KeyboardEvent) => {
	if (event.code === 'Escape') return closeDialogue()
	if (ADVANCE_KEYS.includes(event.code)) return advanceDialogue()
	const choiceIndex = getNumberKeyIndex(event.code)
	if (choiceIndex !== null) chooseDialogueOption(choiceIndex)
}

const handleMinionMenuKey = (event: KeyboardEvent) => {
	if (event.code === 'Escape') return closeMinionMenu()
	const actionIndex = getNumberKeyIndex(event.code)
	if (actionIndex !== null) performMinionActionAt(actionIndex)
}

const handleFreeKey = (event: KeyboardEvent) => {
	if (event.code === 'KeyE') interactWithFocused()
}

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.repeat) return
	if (interactionState.mode === 'dialogue') return handleDialogueKey(event)
	if (interactionState.mode === 'minionMenu') return handleMinionMenuKey(event)
	handleFreeKey(event)
}

export const attachInteractionKeys = () => {
	window.addEventListener('keydown', handleKeyDown)
	return () => window.removeEventListener('keydown', handleKeyDown)
}
