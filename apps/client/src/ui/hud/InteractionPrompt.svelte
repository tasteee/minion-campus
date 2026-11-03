<script lang="ts">
	import { interactionState } from '../../world/interaction/interactionState.svelte'
	import './InteractionPrompt.css'

	const isVisible = $derived(interactionState.mode === 'free' && interactionState.focusedEntityId !== null)
</script>

{#if isVisible}
	<div class="interaction-prompt">
		<span class="interaction-key">E</span>
		{interactionState.focusedVerb}
		<b>{interactionState.focusedName}</b>
	</div>
{/if}
