<script lang="ts">
	import type { ReviewWarningT } from '@minion-campus/sim'
	import { getEndDayReview } from '@minion-campus/sim'
	import { endDay } from '../../state/gameActions'
	import { getGame } from '../../state/gameStore.svelte'
	import Modal from './Modal.svelte'
	import { closeModal, showDayReport } from './modalState.svelte'
	import './EndDayReview.css'

	const game = $derived(getGame())
	const review = $derived(game ? getEndDayReview(game) : [])
	let isEnding = $state(false)

	const warningText: Record<ReviewWarningT, string> = {
		hungry: 'is hungry',
		lonely: 'feels lonely',
		tiredTraining: 'is tired for training',
		notCaredFor: 'had no care today'
	}

	const confirmEndDay = async () => {
		isEnding = true
		const report = await endDay()
		isEnding = false
		showDayReport(report)
	}
</script>

<Modal title="End the day?">
	<p class="review-intro">Here is the plan for tonight. Time only moves when you say so.</p>
	<ul class="review-list">
		{#each review as entry (entry.minionId)}
			<li class="review-entry">
				<div class="review-heading">
					<b>{entry.name}</b>
					<span class="review-assignment">{entry.assignmentLabel}</span>
				</div>
				{#if entry.warnings.length > 0}
					<p class="review-warnings">{entry.name} {entry.warnings.map((warning) => warningText[warning]).join(', ')}.</p>
				{/if}
			</li>
		{/each}
	</ul>

	{#snippet actions()}
		<button class="modal-button" onclick={closeModal}>Not yet</button>
		<button class="modal-button isPrimary" onclick={confirmEndDay} disabled={isEnding}>Sleep</button>
	{/snippet}
</Modal>
