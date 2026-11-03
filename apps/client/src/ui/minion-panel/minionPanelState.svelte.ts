import { setInteractionMode } from '../../world/interaction/interactionState.svelte'

type MinionPanelStateT = {
	minionId: string | null
}

export const minionPanelState = $state<MinionPanelStateT>({ minionId: null })

export const openMinionPanel = (minionId: string) => {
	minionPanelState.minionId = minionId
	setInteractionMode('minionPanel')
}

export const closeMinionPanel = () => {
	minionPanelState.minionId = null
	setInteractionMode('free')
}
