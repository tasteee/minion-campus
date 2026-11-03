<script lang="ts">
	import { getEquipment } from '@minion-campus/content'
	import { T } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'
	import { onMount } from 'svelte'
	import type { EquipmentSlotT } from '../../scenes/campus/campusLayout'
	import { registerEntity } from '../ecs/ecsWorld'
	import FocusMarker from '../interaction/FocusMarker.svelte'
	import ChessboardModel from './ChessboardModel.svelte'
	import ExerciseMachineModel from './ExerciseMachineModel.svelte'
	import NapMatModel from './NapMatModel.svelte'
	import RunningTrackModel from './RunningTrackModel.svelte'

	type PropsT = { equipmentInstanceId: string; slot: EquipmentSlotT }

	const props: PropsT = $props()
	const equipmentEntry = $derived(getEquipment(props.slot.equipmentId))
	const entityId = $derived(`equipment:${props.equipmentInstanceId}`)
	const position = $derived<[number, number, number]>([props.slot.position.x, 0, props.slot.position.z])

	onMount(() =>
		registerEntity({
			id: entityId,
			position: { x: props.slot.position.x, y: 0, z: props.slot.position.z },
			interactable: {
				target: { kind: 'equipment', equipmentInstanceId: props.equipmentInstanceId },
				verb: 'Look at',
				name: equipmentEntry?.name ?? 'Equipment',
				radius: props.slot.interactRadius
			}
		})
	)
</script>

<T.Group {position} rotation.y={props.slot.rotationY}>
	{#if props.slot.collider}
		<T.Group position.y={props.slot.collider.halfY}>
			<RigidBody type="fixed">
				<Collider shape="cuboid" args={[props.slot.collider.halfX, props.slot.collider.halfY, props.slot.collider.halfZ]} />
			</RigidBody>
		</T.Group>
	{/if}

	{#if props.slot.equipmentId === 'exerciseMachine'}
		<ExerciseMachineModel />
	{/if}
	{#if props.slot.equipmentId === 'chessboard'}
		<ChessboardModel />
	{/if}
	{#if props.slot.equipmentId === 'runningTrack'}
		<T.Group position.y={-0.03}>
			<RunningTrackModel />
		</T.Group>
	{/if}
	{#if props.slot.equipmentId === 'napMat'}
		<NapMatModel />
	{/if}

	<FocusMarker {entityId} height={props.slot.equipmentId === 'runningTrack' ? 1.2 : 1.7} />
</T.Group>
