export type DialogueChoiceT = {
	label: string
	nextNodeId: string | null
}

// A node either continues to nextNodeId, offers choices, or ends (nextNodeId null).
export type DialogueNodeT = {
	text: string
	nextNodeId?: string | null
	choices?: DialogueChoiceT[]
}

export type DialogueT = {
	id: string
	speakerName: string
	startNodeId: string
	nodes: Record<string, DialogueNodeT>
}
