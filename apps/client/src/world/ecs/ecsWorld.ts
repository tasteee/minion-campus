import { World } from 'miniplex'

// In-scene entities only. Persistent game data lives in the sim, never here.

export type Vector3LikeT = { x: number; y: number; z: number }

export type InteractTargetT =
	| { kind: 'npc'; npcId: string }
	| { kind: 'minion'; minionId: string }
	| { kind: 'object'; objectId: string }
	| { kind: 'equipment'; equipmentInstanceId: string }

export type InteractableT = {
	target: InteractTargetT
	verb: string
	name: string
	radius: number
}

export type EntityT = {
	id: string
	position?: Vector3LikeT
	interactable?: InteractableT
}

export const ecsWorld = new World<EntityT>()

export const interactableEntities = ecsWorld.with('position', 'interactable')

export const registerEntity = (entity: EntityT) => {
	ecsWorld.add(entity)
	return () => ecsWorld.remove(entity)
}

export const findEntityById = (entityId: string) => ecsWorld.entities.find((entity) => entity.id === entityId)
