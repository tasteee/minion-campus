<script lang="ts">
	import { cameraModeState } from '../../world/camera/cameraMode.svelte'
	import { interactionState } from '../../world/interaction/interactionState.svelte'
	import './ControlsHint.css'

	const isMouseLook = $derived(cameraModeState.mode === 'mouseLook')
	const isWaitingForClick = $derived(isMouseLook && !cameraModeState.isPointerLocked && interactionState.mode === 'free')
</script>

<div class="controls-hint">
	<span class="controls-hint-item"><b>WASD</b> move</span>
	<span class="controls-hint-item"><b>Shift</b> run</span>
	<span class="controls-hint-item"><b>Space</b> hop</span>
	<span class="controls-hint-item"><b>E</b> interact</span>
	{#if !isMouseLook}
		<span class="controls-hint-item"><b>Right-drag</b> look</span>
	{/if}
	{#if isMouseLook}
		<span class="controls-hint-item"><b>Mouse</b> look</span>
	{/if}
	<span class="controls-hint-item"><b>Tab</b> {isMouseLook ? 'drag look' : 'mouse look'}</span>
	<span class="controls-hint-item"><b>Wheel</b> zoom</span>
</div>

{#if isWaitingForClick}
	<div class="controls-resume">Click to resume mouse look</div>
{/if}
