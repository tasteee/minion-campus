import type { InteractableT, Vector3LikeT } from '../ecs/ecsWorld'

type FocusCandidateT = {
	id: string
	position: Vector3LikeT
	interactable: InteractableT
}

const getPlanarDistance = (a: Vector3LikeT, b: Vector3LikeT) => Math.hypot(a.x - b.x, a.z - b.z)

// Nearest interactable within its own radius, or null.
export const findFocusedEntity = (playerPosition: Vector3LikeT, candidates: Iterable<FocusCandidateT>) => {
	let closest: FocusCandidateT | null = null
	let closestDistance = Number.POSITIVE_INFINITY

	for (const candidate of candidates) {
		const distance = getPlanarDistance(playerPosition, candidate.position)
		const isInRange = distance <= candidate.interactable.radius
		const isCloser = distance < closestDistance
		if (!isInRange || !isCloser) continue
		closest = candidate
		closestDistance = distance
	}

	return closest
}
