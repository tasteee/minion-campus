export type WorldObjectT = {
	id: string
	name: string
	verb: string
	dialogueId: string
}

export const worldObjects: Record<string, WorldObjectT> = {
	campusSign: { id: 'campusSign', name: 'Sign', verb: 'Read', dialogueId: 'campus-sign' }
}

export const getWorldObject = (objectId: string) => worldObjects[objectId]
