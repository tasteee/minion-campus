import { advanceDialogue, chooseDialogueOption, closeDialogue } from '../../ui/dialogue/dialogueState.svelte'
import { closeModal } from '../../ui/modals/modalState.svelte'
import { performPanelCareAt } from '../../ui/minion-panel/minionPanelActions'
import { closeMinionPanel } from '../../ui/minion-panel/minionPanelState.svelte'
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

const handleMinionPanelKey = (event: KeyboardEvent) => {
	if (event.code === 'Escape' || event.code === 'KeyE') return closeMinionPanel()
	const actionIndex = getNumberKeyIndex(event.code)
	if (actionIndex !== null) performPanelCareAt(actionIndex)
}

const handleModalKey = (event: KeyboardEvent) => {
	if (event.code === 'Escape') closeModal()
}

const handleFreeKey = (event: KeyboardEvent) => {
	if (event.code === 'KeyE') interactWithFocused()
}

const isTypingInField = (event: KeyboardEvent) => event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.repeat || isTypingInField(event)) return
	if (interactionState.mode === 'dialogue') return handleDialogueKey(event)
	if (interactionState.mode === 'minionPanel') return handleMinionPanelKey(event)
	if (interactionState.mode === 'modal') return handleModalKey(event)
	handleFreeKey(event)
}

export const attachInteractionKeys = () => {
	window.addEventListener('keydown', handleKeyDown)
	return () => window.removeEventListener('keydown', handleKeyDown)
}
