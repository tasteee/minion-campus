import type { PartialCareModifiersT } from './modifiers'

// Starter personality set from the GDD examples. Modifier values are provisional.

export type PersonalityT = {
	id: string
	name: string
	hint: string
	modifiers: PartialCareModifiersT
}

export const personalities: Record<string, PersonalityT> = {
	clingy: { id: 'clingy', name: 'Clingy', hint: 'Always wants to be near you.', modifiers: { affectionDecay: 1.6, petAffection: 1.2, trustGain: 1.2 } },
	independent: { id: 'independent', name: 'Independent', hint: 'Happy doing their own thing.', modifiers: { affectionDecay: 0.5, petAffection: 0.8 } },
	energetic: { id: 'energetic', name: 'Energetic', hint: 'Bounces back fast.', modifiers: { energyRecovery: 1.25, energyDrain: 0.85, hungerRate: 1.15 } },
	lazy: { id: 'lazy', name: 'Lazy', hint: 'Loves a long nap.', modifiers: { energyRecovery: 0.9, energyDrain: 1.2, statGain: 0.9 } },
	shy: { id: 'shy', name: 'Shy', hint: 'Takes a while to warm up.', modifiers: { trustGain: 0.5, stressGain: 1.2 } },
	playful: { id: 'playful', name: 'Playful', hint: 'Lights up at playtime.', modifiers: { playJoy: 1.5 } },
	curious: { id: 'curious', name: 'Curious', hint: 'Into everything.', modifiers: { statGain: 1.1, stressGain: 0.9 } },
	stubborn: { id: 'stubborn', name: 'Stubborn', hint: 'Does things their own way.', modifiers: { statGain: 0.85, trustGain: 0.8, stressGain: 0.8 } },
	affectionate: { id: 'affectionate', name: 'Affectionate', hint: 'Showers you with love.', modifiers: { petAffection: 1.4, trustGain: 1.3 } },
	nervous: { id: 'nervous', name: 'Nervous', hint: 'Startles easily.', modifiers: { stressGain: 1.5, trustGain: 0.8 } }
}

export const personalityIds = Object.keys(personalities)

export const getPersonality = (personalityId: string) => personalities[personalityId]
