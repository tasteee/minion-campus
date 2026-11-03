import type { DialogueT } from './types'

// Placeholder M2 dialogue. Real NPC writing comes with town (M5).

const greeterWelcome: DialogueT = {
	id: 'greeter-welcome',
	speakerName: 'Pip',
	startNodeId: 'hello',
	nodes: {
		hello: {
			text: 'Oh! A new Headmaster! Welcome, welcome.',
			nextNodeId: 'campus'
		},
		campus: {
			text: 'This little patch will be your campus someday. Minions will live here, nap here, and probably eat your snacks.',
			choices: [
				{ label: "What's a minion?", nextNodeId: 'whatMinion' },
				{ label: 'Where do I start?', nextNodeId: 'whereStart' },
				{ label: 'Bye for now!', nextNodeId: null }
			]
		},
		whatMinion: {
			text: "Every minion is one of a kind. Different looks, different moods, different dreams. You'll see.",
			nextNodeId: 'campus'
		},
		whereStart: {
			text: "Say hi to that little one over there. They've been waiting for you.",
			nextNodeId: null
		}
	}
}

const campusSign: DialogueT = {
	id: 'campus-sign',
	speakerName: 'Wooden Sign',
	startNodeId: 'read',
	nodes: {
		read: {
			text: 'CAMPUS — under construction. Please mind the minions.',
			nextNodeId: null
		}
	}
}

export const dialogues: Record<string, DialogueT> = {
	[greeterWelcome.id]: greeterWelcome,
	[campusSign.id]: campusSign
}

export const getDialogue = (dialogueId: string) => dialogues[dialogueId]
