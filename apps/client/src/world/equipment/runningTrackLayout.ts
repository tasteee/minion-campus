import { getStadiumPoint } from '../toon/shapes'

// Track dimensions shared by the model and the minion running path.

export const trackStraight = 4
export const trackLanes = [
	{ radius: 3.2, color: 'lavenderDeep' },
	{ radius: 3.0, color: 'lavenderLight' },
	{ radius: 2.55, color: 'butter' },
	{ radius: 2.1, color: 'lavenderLight' },
	{ radius: 1.7, color: 'lavenderLight' },
	{ radius: 1.3, color: 'sand' }
] as const

// Lane the minions run in (middle of the yellow lane).
export const runningLaneRadius = 2.32

export const getRunningPoint = (progress: number) => getStadiumPoint(trackStraight, runningLaneRadius, progress)

export const getRunningLapLength = () => trackStraight * 2 + Math.PI * 2 * runningLaneRadius
