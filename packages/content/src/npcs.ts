export type NpcT = {
	id: string
	name: string
	role: string
	dialogueId: string
}

export const npcs: Record<string, NpcT> = {
	pip: { id: 'pip', name: 'Pip', role: 'Campus Greeter', dialogueId: 'greeter-welcome' }
}

export const getNpc = (npcId: string) => npcs[npcId]
