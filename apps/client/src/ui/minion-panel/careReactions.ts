import type { CareOutcomeT } from '@minion-campus/sim'

// Friendly text for care outcomes. Presentation only.

const successMessages = {
	feed: (name: string) => `${name} munches happily.`,
	pet: (name: string) => `${name} leans into your hand and wiggles.`,
	play: (name: string) => `${name} bounces around with you!`
}

const failureMessages = {
	notFound: () => 'That minion is not here.',
	notAlive: (name: string) => `${name} is resting forever now.`,
	noFood: () => 'You are out of food.',
	notHungry: (name: string) => `${name} sniffs the food but is not hungry.`,
	dailyLimit: (name: string) => `${name} is content for today. Maybe tomorrow!`
}

export const getCareReaction = (outcome: CareOutcomeT, name: string) => {
	if (outcome.isSuccess) return successMessages[outcome.action](name)
	return failureMessages[outcome.failureReason ?? 'notFound'](name)
}
