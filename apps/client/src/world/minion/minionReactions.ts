// Per-frame hop timers, keyed by minion id. View-only feedback after care.

const HOP_DURATION_SECONDS = 0.45

const hopTimers = new Map<string, number>()

export const triggerMinionHop = (minionId: string) => {
	hopTimers.set(minionId, HOP_DURATION_SECONDS)
}

// Returns hop height for this frame and ticks the timer down.
export const tickMinionHop = (minionId: string, deltaSeconds: number) => {
	const remaining = hopTimers.get(minionId) ?? 0
	if (remaining <= 0) return 0
	const nextRemaining = Math.max(0, remaining - deltaSeconds)
	hopTimers.set(minionId, nextRemaining)
	const progress = 1 - nextRemaining / HOP_DURATION_SECONDS
	return Math.sin(progress * Math.PI) * 0.35
}
