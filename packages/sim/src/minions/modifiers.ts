import type { CareModifiersT, PartialCareModifiersT } from '@minion-campus/content'
import { getPersonality, getTrait, neutralCareModifiers } from '@minion-campus/content'
import type { MinionT } from '../types'

const careModifierKeys = Object.keys(neutralCareModifiers) as (keyof CareModifiersT)[]

const multiplyModifiers = (base: CareModifiersT, extra: PartialCareModifiersT): CareModifiersT => {
	const combined = { ...base }
	careModifierKeys.forEach((key) => {
		combined[key] = base[key] * (extra[key] ?? 1)
	})
	return combined
}

export const getTraitModifiers = (traitIds: readonly string[]) => {
	const traitModifiers = traitIds.map((traitId) => getTrait(traitId)?.modifiers ?? {})
	return traitModifiers.reduce(multiplyModifiers, neutralCareModifiers)
}

// Personality × traits. Recomputed on demand; never stored.
export const getCareModifiers = (minion: MinionT) => {
	const personalityModifiers = getPersonality(minion.personalityId)?.modifiers ?? {}
	return multiplyModifiers(getTraitModifiers(minion.traitIds), personalityModifiers)
}
