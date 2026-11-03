<script lang="ts">
	import { advanceDialogue, chooseDialogueOption, dialogueState, getActiveDialogue, getActiveNode } from './dialogueState.svelte'
	import './DialogueBox.css'

	const dialogue = $derived(dialogueState.dialogueId ? getActiveDialogue() : null)
	const node = $derived(dialogueState.nodeId ? getActiveNode() : null)
	const choices = $derived(node?.choices ?? [])
	const hasChoices = $derived(choices.length > 0)
	const isLastNode = $derived(!hasChoices && !node?.nextNodeId)
</script>

{#if dialogue && node}
	<div class="dialogue-box" role="dialog" aria-label={dialogue.speakerName}>
		<div class="dialogue-speaker">{dialogue.speakerName}</div>
		<p class="dialogue-text">{node.text}</p>

		{#if hasChoices}
			<ol class="dialogue-choices">
				{#each choices as choice, choiceIndex (choice.label)}
					<li>
						<button class="dialogue-choice" onclick={() => chooseDialogueOption(choiceIndex)}>
							<span class="dialogue-key">{choiceIndex + 1}</span>
							{choice.label}
						</button>
					</li>
				{/each}
			</ol>
		{/if}

		{#if !hasChoices}
			<button class="dialogue-continue" onclick={advanceDialogue}>
				<span class="dialogue-key">E</span>
				{isLastNode ? 'Close' : 'Continue'}
			</button>
		{/if}
	</div>
{/if}
