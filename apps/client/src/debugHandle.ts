import { getGame } from './state/gameStore.svelte'
import { openMinionPanel } from './ui/minion-panel/minionPanelState.svelte'

// Opt-in test hook: only exists when the URL has ?debug. Lets automated browser tests
// reach UI that depends on where a wandering minion happens to be.
export const installDebugHandle = () => {
	const isDebug = new URLSearchParams(window.location.search).has('debug')
	if (!isDebug) return
	Object.assign(window, { campusDebug: { getGame, openMinionPanel } })
}
