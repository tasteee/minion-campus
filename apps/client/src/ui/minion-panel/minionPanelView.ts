import { genders, getEquipment, getPersonality, getSpecies, getTrait, statIds } from '@minion-campus/content'
import type { ActivityAssignmentT, GameStateT, MinionT } from '@minion-campus/sim'
import { getAssignmentIssue, simConfig } from '@minion-campus/sim'

// Shapes sim data into what the panel shows. No game rules: thresholds come from simConfig.

export type NeedBarT = { label: string; value: number }

export type AssignmentOptionT = {
	key: string
	label: string
	detail: string
	assignment: ActivityAssignmentT
	isAvailable: boolean
}

const lifeStageLabels = { baby: 'Baby', young: 'Young', adult: 'Adult', elder: 'Elder' }

export const getLifeStageLabel = (minion: MinionT) => lifeStageLabels[minion.lifeStage]

export const getSpeciesName = (minion: MinionT) => getSpecies(minion.speciesId)?.name ?? 'Unknown'

export const getGenderLabel = (minion: MinionT) => genders.find((gender) => gender.id === minion.genderId)?.label ?? ''

export const getPersonalityText = (minion: MinionT) => {
	const personality = getPersonality(minion.personalityId)
	const knowledge = minion.personalityKnowledge
	if (!personality || knowledge < simConfig.personality.hintAt) return 'Still getting to know them…'
	if (knowledge < simConfig.personality.fullAt) return `Hmm… ${personality.hint}`
	return `${personality.name}: ${personality.hint}`
}

export const getTraitNames = (minion: MinionT) => minion.traitIds.map((traitId) => getTrait(traitId)?.name ?? traitId)

// Every bar reads "fuller is better", so hunger and stress are flipped.
export const getNeedBars = (minion: MinionT): NeedBarT[] => [
	{ label: 'Fullness', value: 100 - minion.needs.hunger },
	{ label: 'Energy', value: minion.needs.energy },
	{ label: 'Happiness', value: minion.needs.happiness },
	{ label: 'Affection', value: minion.needs.affection },
	{ label: 'Health', value: minion.needs.health },
	{ label: 'Calm', value: 100 - minion.needs.stress }
]

const statLabels = { strength: 'STR', intelligence: 'INT', speed: 'SPD', defense: 'DEF', endurance: 'END', accuracy: 'ACC' }

export const getStatRows = (minion: MinionT) =>
	statIds.map((statId) => ({ key: statId, label: statLabels[statId], value: Math.floor(minion.stats[statId]) }))

export const getCareCounts = (minion: MinionT) => ({
	pet: { used: minion.todayCare.petted, limit: simConfig.careDailyLimits.pet },
	play: { used: minion.todayCare.played, limit: simConfig.careDailyLimits.play },
	feed: { used: minion.todayCare.fed, limit: null }
})

const basicOptions: { key: string; label: string; detail: string; assignment: ActivityAssignmentT }[] = [
	{ key: 'idle', label: 'Free time', detail: 'Wander and relax', assignment: { activity: 'idle' } },
	{ key: 'rest', label: 'Rest', detail: 'Nap on the lawn', assignment: { activity: 'rest' } },
	{ key: 'play', label: 'Play', detail: 'Run around for fun', assignment: { activity: 'play' } }
]

const describeEquipment = (equipmentId: string) => {
	const equipmentEntry = getEquipment(equipmentId)
	if (!equipmentEntry) return { label: equipmentId, detail: '' }
	const detail = equipmentEntry.trainedStat ? `Trains ${equipmentEntry.trainedStat}` : 'Deep rest'
	return { label: equipmentEntry.name, detail }
}

export const getAssignmentOptions = (game: GameStateT, minionId: string): AssignmentOptionT[] => {
	const equipmentOptions = game.campus.equipment.map((instance) => {
		const assignment: ActivityAssignmentT = { activity: 'equipment', equipmentInstanceId: instance.id }
		const description = describeEquipment(instance.equipmentId)
		const isAvailable = getAssignmentIssue(game, minionId, assignment) === null
		return { key: instance.id, label: description.label, detail: isAvailable ? description.detail : 'In use', assignment, isAvailable }
	})

	return [...basicOptions.map((option) => ({ ...option, isAvailable: true })), ...equipmentOptions]
}

export const isSameAssignment = (left: ActivityAssignmentT, right: ActivityAssignmentT) => JSON.stringify(left) === JSON.stringify(right)
