<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import type { Group } from 'three'
	import type { PoseT } from '../../world/minion/minionBehavior'
	import SmudgeModel from '../../world/minion/smudge/SmudgeModel.svelte'

	// Walks a little circle, then plops down and sits, on repeat. Or holds one pose.

	type PropsT = { fixedPose: PoseT | null }

	const props: PropsT = $props()
	const CYCLE_SECONDS = 7
	let walker = $state<Group>()
	let elapsedSeconds = 0
	let pose: PoseT = 'idle'

	useTask((deltaSeconds) => {
		elapsedSeconds += deltaSeconds
		const cycleTime = elapsedSeconds % CYCLE_SECONDS
		const isWalking = props.fixedPose === null && cycleTime < 3.5
		pose = props.fixedPose ?? (isWalking ? 'walk' : 'idle')
		if (!walker || !isWalking) return
		const angle = elapsedSeconds * 0.9
		walker.position.set(Math.sin(angle) * 0.6, 0, Math.cos(angle) * 0.6 - 0.3)
		walker.rotation.y = angle + Math.PI / 2
	})
</script>

<T.Group bind:ref={walker}>
	<SmudgeModel getPose={() => pose} />
</T.Group>
