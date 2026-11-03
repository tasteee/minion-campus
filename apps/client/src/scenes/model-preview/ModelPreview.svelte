<script lang="ts">
	import { T, useThrelte } from '@threlte/core'
	import { onMount } from 'svelte'
	import { Color } from 'three'
	import ChessboardModel from '../../world/equipment/ChessboardModel.svelte'
	import ExerciseMachineModel from '../../world/equipment/ExerciseMachineModel.svelte'
	import NapMatModel from '../../world/equipment/NapMatModel.svelte'
	import RunningTrackModel from '../../world/equipment/RunningTrackModel.svelte'
	import { worldPalette } from '../../world/palette'

	// Dev-only art viewer: open the app with ?preview=<model>.

	type PropsT = { modelId: string }

	const props: PropsT = $props()
	const threlte = useThrelte()

	const cameraPositions: Record<string, [number, number, number]> = {
		exerciseMachine: [2.2, 1.9, 2.8],
		napMatSide: [-1.5, 0.9, 1.4],
		napMat: [1.4, 1.5, 1.9],
		runningTrack: [0, 7.5, 8.5],
		chessboard: [1.4, 1.7, 1.9]
	}

	const cameraPosition: [number, number, number] = $derived(cameraPositions[props.modelId] ?? [3, 3, 3])
	const lookTarget = $derived(props.modelId === 'runningTrack' ? 0 : 0.45)

	onMount(() => {
		threlte.scene.background = new Color('#ffffff')
	})
</script>

<T.PerspectiveCamera
	makeDefault
	fov={40}
	position={cameraPosition}
	oncreate={(camera) => camera.lookAt(0, lookTarget, 0)}
/>
<T.HemisphereLight args={[worldPalette.skyLight, '#ffffff', 1.6]} />
<T.DirectionalLight position={[3, 6, 4]} intensity={1.6} castShadow />

{#if props.modelId === 'exerciseMachine'}
	<ExerciseMachineModel />
{/if}
{#if props.modelId === 'napMat' || props.modelId === 'napMatSide'}
	<NapMatModel />
{/if}
{#if props.modelId === 'runningTrack'}
	<RunningTrackModel />
{/if}
{#if props.modelId === 'chessboard'}
	<ChessboardModel />
{/if}
