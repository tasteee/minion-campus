<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import { getAssignment } from '@minion-campus/sim'
	import { onMount } from 'svelte'
	import type { Group } from 'three'
	import { getGame } from '../../state/gameStore.svelte'
	import { minionPanelState } from '../../ui/minion-panel/minionPanelState.svelte'
	import { registerEntity } from '../ecs/ecsWorld'
	import FocusMarker from '../interaction/FocusMarker.svelte'
	import { interactionState } from '../interaction/interactionState.svelte'
	import { playerState } from '../player/playerState'
	import type { PoseT } from './minionBehavior'
	import { createBehaviorState, faceToward, getWorkSpot, leaveWork, updateTowardWork, updateWander } from './minionBehavior'
	import { getMinionLook } from './minionLook'
	import MinionModel from './MinionModel.svelte'
	import { tickMinionHop } from './minionReactions'

	type PropsT = { minionId: string }

	const props: PropsT = $props()
	const minion = $derived(getGame()?.minions.find((candidate) => candidate.id === props.minionId))
	const look = $derived(minion ? getMinionLook(minion.id, minion.appearance, minion.lifeStage) : null)
	const entityId = $derived(`minion:${props.minionId}`)
	const behavior = createBehaviorState()
	const entityPosition = { x: behavior.x, y: 0, z: behavior.z }
	const workPoses: PoseT[] = ['lift', 'think', 'run', 'sleep']
	let rootGroup = $state<Group>()
	let bodyGroup = $state<Group>()
	let elapsedSeconds = Math.random() * 10

	onMount(() =>
		registerEntity({
			id: entityId,
			position: entityPosition,
			interactable: {
				target: { kind: 'minion', minionId: props.minionId },
				verb: 'Visit',
				name: minion?.name ?? 'Minion',
				radius: 1.8
			}
		})
	)

	const isEngaged = () => {
		const isFocused = interactionState.mode === 'free' && interactionState.focusedEntityId === entityId
		return isFocused || minionPanelState.minionId === props.minionId
	}

	const updateBehavior = (deltaSeconds: number) => {
		const game = getGame()
		if (!game) return
		const assignment = getAssignment(game, props.minionId)
		const spot = getWorkSpot(game, props.minionId, assignment)
		const isWorking = workPoses.includes(behavior.pose)

		if (isEngaged() && !isWorking) {
			behavior.pose = 'idle'
			faceToward(behavior, playerState.position.x, playerState.position.z, deltaSeconds)
			return
		}

		if (spot) return updateTowardWork(behavior, spot, deltaSeconds)
		if (isWorking) leaveWork(behavior)
		updateWander(behavior, assignment.activity === 'play', deltaSeconds)
	}

	// Vertical bounce per pose, from elapsed time.
	const poseBounce: Record<PoseT, (time: number) => number> = {
		walk: (time) => Math.abs(Math.sin(time * 9)) * 0.05,
		hop: (time) => Math.abs(Math.sin(time * 6)) * 0.28,
		run: (time) => Math.abs(Math.sin(time * 14)) * 0.1,
		lift: (time) => (Math.sin(time * 4) + 1) * 0.05,
		idle: () => 0,
		think: () => 0,
		sleep: () => 0
	}

	const poseLean: Partial<Record<PoseT, number>> = { run: 0.18, walk: 0.06 }

	const poseSway: Partial<Record<PoseT, (time: number) => number>> = {
		think: (time) => Math.sin(time * 1.3) * 0.09,
		walk: (time) => Math.sin(time * 9) * 0.05
	}

	const animateBody = (body: Group, deltaSeconds: number) => {
		const time = elapsedSeconds
		const pose = behavior.pose
		const isAsleep = pose === 'sleep'
		const breathe = Math.sin(time * (isAsleep ? 1.2 : 2.2)) * 0.025
		const sideScale = isAsleep ? 1.1 : 1
		body.position.y = poseBounce[pose](time) + tickMinionHop(props.minionId, deltaSeconds)
		body.scale.set(sideScale, (isAsleep ? 0.78 : 1) + breathe, sideScale)
		body.rotation.x = poseLean[pose] ?? 0
		body.rotation.z = poseSway[pose]?.(time) ?? 0
	}

	useTask((deltaSeconds) => {
		if (!rootGroup || !bodyGroup) return
		elapsedSeconds += deltaSeconds
		updateBehavior(deltaSeconds)
		rootGroup.position.set(behavior.x, behavior.y, behavior.z)
		rootGroup.rotation.y = behavior.facing
		animateBody(bodyGroup, deltaSeconds)
		entityPosition.x = behavior.x
		entityPosition.y = behavior.y
		entityPosition.z = behavior.z
	})
</script>

{#if look}
	<T.Group bind:ref={rootGroup}>
		<T.Group scale={look.scale}>
			<T.Group bind:ref={bodyGroup}>
				<MinionModel {look} />
			</T.Group>
		</T.Group>
		<FocusMarker {entityId} height={look.scale * 1.45} />
	</T.Group>
{/if}
