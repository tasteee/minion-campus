<script lang="ts">
	import { formatCalendarDate } from '@minion-campus/sim'
	import Modal from './Modal.svelte'
	import { closeModal, modalState } from './modalState.svelte'
	import './DayReport.css'

	const report = $derived(modalState.report)
</script>

{#if report}
	<Modal title={`Good morning! ${formatCalendarDate(report.newDate)}`}>
		{#if report.entries.length === 0}
			<p class="report-empty">A quiet night on campus. Everyone slept well.</p>
		{/if}
		<ul class="report-list">
			{#each report.entries as entry, entryIndex (entryIndex)}
				<li class={`report-entry is${entry.tone[0]?.toUpperCase()}${entry.tone.slice(1)}`}>{entry.message}</li>
			{/each}
		</ul>

		{#snippet actions()}
			<button class="modal-button isPrimary" onclick={closeModal}>Start the day</button>
		{/snippet}
	</Modal>
{/if}
