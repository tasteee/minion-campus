// Static game content: species, traits, personalities, equipment, NPCs, dialogue, items.

export const CONTENT_VERSION = 1

export type { DialogueT, DialogueNodeT, DialogueChoiceT } from './dialogue/types'
export { dialogues, getDialogue } from './dialogue/dialogues'
export type { NpcT } from './npcs'
export { npcs, getNpc } from './npcs'
export type { WorldObjectT } from './worldObjects'
export { worldObjects, getWorldObject } from './worldObjects'
