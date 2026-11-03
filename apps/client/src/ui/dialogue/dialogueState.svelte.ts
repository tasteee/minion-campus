import { getDialogue } from '@minion-campus/content'
import { setInteractionMode } from '../../world/interaction/interactionState.svelte'

type DialogueStateT = {
	dialogueId: string | null
	nodeId: string | null
}

export const dialogueState = $state<DialogueStateT>({
	dialogueId: null,
	nodeId: null
})

export const getActiveDialogue = () => {
	if (!dialogueState.dialogueId) return null
	return getDialogue(dialogueState.dialogueId) ?? null
}

export const getActiveNode = () => {
	const dialogue = getActiveDialogue()
	if (!dialogue || !dialogueState.nodeId) return null
	return dialogue.nodes[dialogueState.nodeId] ?? null
}

export const closeDialogue = () => {
	dialogueState.dialogueId = null
	dialogueState.nodeId = null
	setInteractionMode('free')
}

const goToNode = (nodeId: string | null | undefined) => {
	if (!nodeId) return closeDialogue()
	dialogueState.nodeId = nodeId
}

export const startDialogue = (dialogueId: string) => {
	const dialogue = getDialogue(dialogueId)
	if (!dialogue) return
	dialogueState.dialogueId = dialogue.id
	dialogueState.nodeId = dialogue.startNodeId
	setInteractionMode('dialogue')
}

// Nodes with choices wait for a choice instead of advancing.
export const advanceDialogue = () => {
	const node = getActiveNode()
	if (!node) return closeDialogue()
	const hasChoices = (node.choices?.length ?? 0) > 0
	if (hasChoices) return
	goToNode(node.nextNodeId)
}

export const chooseDialogueOption = (choiceIndex: number) => {
	const node = getActiveNode()
	const choice = node?.choices?.[choiceIndex]
	if (!choice) return
	goToNode(choice.nextNodeId)
}
