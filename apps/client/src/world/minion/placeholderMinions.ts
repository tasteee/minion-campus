// Placeholder minion until the sim owns minions (M3/M4). View data only.

export type PlaceholderMinionT = {
	id: string
	name: string
	bodyColor: string
	earColor: string
	position: [number, number, number]
}

export const placeholderMinions: PlaceholderMinionT[] = [
	{ id: 'mochi', name: 'Mochi', bodyColor: '#ffd1dc', earColor: '#ff9fb6', position: [-2.5, 0, -2.5] }
]

export const getPlaceholderMinion = (minionId: string) => placeholderMinions.find((minion) => minion.id === minionId)
