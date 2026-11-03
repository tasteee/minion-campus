import { getNpc, getWorldObject } from '@minion-campus/content'
import type { InteractTargetT } from '../ecs/ecsWorld'
import { findEntityById } from '../ecs/ecsWorld'
import { startDialogue } from '../../ui/dialogue/dialogueState.svelte'
import { openMinionMenu } from '../../ui/minion-menu/minionMenuState.svelte'
import { interactionState } from './interactionState.svelte'

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
			openMinionMenu(target.minionId)
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
