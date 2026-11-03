import { getEquipment, getNpc, getWorldObject } from '@minion-campus/content'
import { findEquipmentInstance, findMinion, getEquipmentUsers } from '@minion-campus/sim'
import { getGame } from '../../state/gameStore.svelte'
import { startDialogue } from '../../ui/dialogue/dialogueState.svelte'
import { openMinionPanel } from '../../ui/minion-panel/minionPanelState.svelte'
import { showToast } from '../../ui/toast/toastState.svelte'
import type { InteractTargetT } from '../ecs/ecsWorld'
import { findEntityById } from '../ecs/ecsWorld'
import { interactionState } from './interactionState.svelte'

const describeEquipment = (equipmentInstanceId: string) => {
	const game = getGame()
	if (!game) return
	const instance = findEquipmentInstance(game, equipmentInstanceId)
	const equipmentEntry = getEquipment(instance?.equipmentId ?? '')
	if (!equipmentEntry) return
	const userNames = getEquipmentUsers(game, equipmentInstanceId).map((minionId) => findMinion(game, minionId)?.name ?? '?')
	const usage = userNames.length > 0 ? `In use by ${userNames.join(' & ')}.` : 'Free today.'
	showToast(`${equipmentEntry.name}: ${equipmentEntry.description} ${usage}`)
}

const interactWithTarget = (target: InteractTargetT) => {
	switch (target.kind) {
		case 'npc': {
			const npc = getNpc(target.npcId)
			if (npc) startDialogue(npc.dialogueId)
			return
		}
		case 'object': {
			const worldObject = getWorldObject(target.objectId)
			if (worldObject) startDialogue(worldObject.dialogueId)
			return
		}
		case 'minion': {
			openMinionPanel(target.minionId)
			return
		}
		case 'equipment': {
			describeEquipment(target.equipmentInstanceId)
			return
		}
	}
}

export const interactWithFocused = () => {
	const focusedEntityId = interactionState.focusedEntityId
	if (!focusedEntityId) return
	const entity = findEntityById(focusedEntityId)
	if (!entity?.interactable) return
	interactWithTarget(entity.interactable.target)
}
