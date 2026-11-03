import type { CareActionIdT } from '@minion-campus/sim'
import { findMinion } from '@minion-campus/sim'
import { careForMinion } from '../../state/gameActions'
import { getGame } from '../../state/gameStore.svelte'
import { triggerMinionHop } from '../../world/minion/minionReactions'
import { showToast } from '../toast/toastState.svelte'
import { getCareReaction } from './careReactions'
import { minionPanelState } from './minionPanelState.svelte'

export const careActionOrder: CareActionIdT[] = ['pet', 'feed', 'play']

export const performPanelCare = (action: CareActionIdT) => {
	const minionId = minionPanelState.minionId
	const game = getGame()
	if (!minionId || !game) return
	const name = findMinion(game, minionId)?.name ?? 'Your minion'
	const outcome = careForMinion(minionId, action)
	if (outcome.isSuccess) triggerMinionHop(minionId)
	showToast(getCareReaction(outcome, name))
}

export const performPanelCareAt = (index: number) => {
	const action = careActionOrder[index]
	if (action) performPanelCare(action)
}
