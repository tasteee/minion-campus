import { setInteractionMode } from '../../world/interaction/interactionState.svelte'
import { getPlaceholderMinion } from '../../world/minion/placeholderMinions'
import { triggerMinionHop } from '../../world/minion/minionReactions'
import { showToast } from '../toast/toastState.svelte'

// Placeholder actions. Real care effects come from the sim in M3/M4.

export type MinionActionT = {
	id: string
	label: string
	getReaction: (minionName: string) => string
}

export const minionActions: MinionActionT[] = [
	{ id: 'pet', label: 'Pet', getReaction: (name) => `${name} leans into your hand and wiggles.` },
	{ id: 'feed', label: 'Feed', getReaction: (name) => `${name} sniffs the air hopefully. (Food arrives in M4.)` },
	{ id: 'play', label: 'Play', getReaction: (name) => `${name} bounces in a happy little circle!` },
	{ id: 'check', label: 'Check on', getReaction: (name) => `${name} seems content. (Needs and stats arrive in M3.)` }
]

type MinionMenuStateT = {
	minionId: string | null
}

export const minionMenuState = $state<MinionMenuStateT>({ minionId: null })

export const openMinionMenu = (minionId: string) => {
	if (!getPlaceholderMinion(minionId)) return
	minionMenuState.minionId = minionId
	setInteractionMode('minionMenu')
}

export const closeMinionMenu = () => {
	minionMenuState.minionId = null
	setInteractionMode('free')
}

export const performMinionActionAt = (actionIndex: number) => {
	const action = minionActions[actionIndex]
	const minionId = minionMenuState.minionId
	if (!action || !minionId) return
	const minion = getPlaceholderMinion(minionId)
	if (!minion) return
	triggerMinionHop(minionId)
	showToast(action.getReaction(minion.name))
}
