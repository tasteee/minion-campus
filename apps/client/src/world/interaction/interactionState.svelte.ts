// Interaction mode drives input routing and player lock.
// Changes rarely, so it is safe as reactive state.

export type InteractionModeT = 'free' | 'dialogue' | 'minionPanel' | 'modal'

type InteractionStateT = {
	mode: InteractionModeT
	focusedEntityId: string | null
	focusedVerb: string
	focusedName: string
}

export const interactionState = $state<InteractionStateT>({
	mode: 'free',
	focusedEntityId: null,
	focusedVerb: '',
	focusedName: ''
})

export const isPlayerLocked = () => interactionState.mode !== 'free'

export const setInteractionMode = (mode: InteractionModeT) => {
	interactionState.mode = mode
}
