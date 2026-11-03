import { describe, expect, it } from 'vitest'
import { dialogues, npcs, worldObjects } from './index'

const getReferencedNodeIds = (dialogueId: string) => {
	const dialogue = dialogues[dialogueId]
	if (!dialogue) return []
	const nodes = Object.values(dialogue.nodes)
	const nextIds = nodes.map((node) => node.nextNodeId)
	const choiceIds = nodes.flatMap((node) => (node.choices ?? []).map((choice) => choice.nextNodeId))
	const allIds = [dialogue.startNodeId, ...nextIds, ...choiceIds]
	return allIds.filter((nodeId): nodeId is string => typeof nodeId === 'string')
}

describe('dialogue content', () => {
	it('only points to nodes that exist', () => {
		Object.keys(dialogues).forEach((dialogueId) => {
			const nodeIds = Object.keys(dialogues[dialogueId]?.nodes ?? {})
			getReferencedNodeIds(dialogueId).forEach((referencedId) => {
				expect(nodeIds, `${dialogueId} → ${referencedId}`).toContain(referencedId)
			})
		})
	})

	it('keeps dialogue ids matching their keys', () => {
		Object.entries(dialogues).forEach((entry) => {
			expect(entry[1].id).toBe(entry[0])
		})
	})
})

describe('npc and object content', () => {
	it('references existing dialogues', () => {
		const dialogueIds = Object.keys(dialogues)
		Object.values(npcs).forEach((npc) => expect(dialogueIds).toContain(npc.dialogueId))
		Object.values(worldObjects).forEach((object) => expect(dialogueIds).toContain(object.dialogueId))
	})
})
