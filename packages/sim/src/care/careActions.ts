import { cloneState } from '../cloneState'
import { simConfig } from '../config'
import { findMinion } from '../gameState'
import { getCareModifiers } from '../minions/modifiers'
import { changeNeed } from '../needs'
import type { DailyCareCountsT, GameStateT, MinionT, NeedsT } from '../types'

// Care actions happen during the day, apply instantly, and return a new state.

export type CareActionIdT = 'feed' | 'pet' | 'play'

export type CareFailureReasonT = 'notFound' | 'notAlive' | 'noFood' | 'notHungry'

export type CareOutcomeT = {
	action: CareActionIdT
	minionId: string
	isSuccess: boolean
	failureReason: CareFailureReasonT | null
	// Need changes actually applied (after clamping).
	needChanges: Partial<NeedsT>
}

const needKeys: (keyof NeedsT)[] = ['hunger', 'energy', 'happiness', 'affection', 'health', 'stress']

const getNeedChanges = (before: NeedsT, after: NeedsT) => {
	const changes: Partial<NeedsT> = {}

	needKeys.forEach((need) => {
		const difference = after[need] - before[need]
		if (difference !== 0) changes[need] = difference
	})

	return changes
}

// Repeating the same action in one day is worth less each time.
const getRepeatFactor = (timesToday: number) => simConfig.affection.repeatFalloff ** timesToday

const revealPersonality = (minion: MinionT) => {
	const revealed = minion.personalityKnowledge + simConfig.personality.revealPerInteraction
	minion.personalityKnowledge = Math.min(1, revealed)
}

const failedOutcome = (action: CareActionIdT, minionId: string, failureReason: CareFailureReasonT): CareOutcomeT => ({
	action,
	minionId,
	isSuccess: false,
	failureReason,
	needChanges: {}
})

const applyFeed = (state: GameStateT, minion: MinionT) => {
	state.inventory.food -= 1
	changeNeed(minion.needs, 'hunger', -simConfig.hunger.feedAmount)
}

const applyPet = (minion: MinionT) => {
	const modifiers = getCareModifiers(minion)
	const amount = simConfig.affection.petAmount * modifiers.petAffection * getRepeatFactor(minion.todayCare.petted)
	changeNeed(minion.needs, 'affection', amount)
}

const applyPlay = (minion: MinionT) => {
	const modifiers = getCareModifiers(minion)
	const repeatFactor = getRepeatFactor(minion.todayCare.played)
	changeNeed(minion.needs, 'affection', simConfig.affection.playAmount * repeatFactor)
	changeNeed(minion.needs, 'happiness', simConfig.play.happinessAmount * modifiers.playJoy * repeatFactor)
	changeNeed(minion.needs, 'energy', -simConfig.play.energyCost * modifiers.energyDrain)
}

const careCountKeys: Record<CareActionIdT, keyof DailyCareCountsT> = {
	feed: 'fed',
	pet: 'petted',
	play: 'played'
}

const getBlockingReason = (state: GameStateT, minion: MinionT | undefined, action: CareActionIdT) => {
	if (!minion) return 'notFound'
	if (!minion.isAlive) return 'notAlive'
	if (action !== 'feed') return null
	if (state.inventory.food <= 0) return 'noFood'
	if (minion.needs.hunger < simConfig.hunger.refuseBelow) return 'notHungry'
	return null
}

export const performCareAction = (state: GameStateT, minionId: string, action: CareActionIdT) => {
	const nextState = cloneState(state)
	const minion = findMinion(nextState, minionId)
	const blockingReason = getBlockingReason(nextState, minion, action)
	if (blockingReason || !minion) return { nextState: state, outcome: failedOutcome(action, minionId, blockingReason ?? 'notFound') }
	const needsBefore = { ...minion.needs }
	if (action === 'feed') applyFeed(nextState, minion)
	if (action === 'pet') applyPet(minion)
	if (action === 'play') applyPlay(minion)
	minion.todayCare[careCountKeys[action]] += 1
	revealPersonality(minion)

	const outcome: CareOutcomeT = {
		action,
		minionId,
		isSuccess: true,
		failureReason: null,
		needChanges: getNeedChanges(needsBefore, minion.needs)
	}

	return { nextState, outcome }
}

export const feedMinion = (state: GameStateT, minionId: string) => performCareAction(state, minionId, 'feed')

export const petMinion = (state: GameStateT, minionId: string) => performCareAction(state, minionId, 'pet')

export const playWithMinion = (state: GameStateT, minionId: string) => performCareAction(state, minionId, 'play')
