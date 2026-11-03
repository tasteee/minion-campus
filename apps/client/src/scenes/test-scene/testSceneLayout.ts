import { worldPalette } from '../../world/palette'

// Static blocks for testing movement and collisions. Sizes are full extents.

export type BlockT = {
	id: string
	position: [number, number, number]
	size: [number, number, number]
	color: string
}

export const groundSize = 60

export const testBlocks: BlockT[] = [
	{ id: 'pink-cube', position: [5, 1, -4], size: [2, 2, 2], color: worldPalette.blockPink },
	{ id: 'lilac-wall', position: [-6, 1.5, -2], size: [1, 3, 8], color: worldPalette.blockLilac },
	{ id: 'mint-step-low', position: [0, 0.15, -8], size: [3, 0.3, 2], color: worldPalette.blockMint },
	{ id: 'mint-step-mid', position: [0, 0.3, -10], size: [3, 0.6, 2], color: worldPalette.blockMint },
	{ id: 'mint-step-high', position: [0, 0.45, -12], size: [3, 0.9, 2], color: worldPalette.blockMint },
	{ id: 'butter-platform', position: [0, 0.6, -15.5], size: [6, 1.2, 5], color: worldPalette.blockButter },
	{ id: 'pink-pillar', position: [8, 2, 6], size: [1.2, 4, 1.2], color: worldPalette.blockPink },
	{ id: 'lilac-crate', position: [-4, 0.5, 7], size: [1, 1, 1], color: worldPalette.blockLilac }
]
