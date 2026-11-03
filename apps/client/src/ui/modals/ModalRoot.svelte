<script lang="ts">
	import DayReport from './DayReport.svelte'
	import EndDayReview from './EndDayReview.svelte'
	import GameMenu from './GameMenu.svelte'
	import { modalState } from './modalState.svelte'
</script>

{#if modalState.openModalId === 'endDayReview'}
	<EndDayReview />
{/if}
{#if modalState.openModalId === 'dayReport'}
	<DayReport />
{/if}
{#if modalState.openModalId === 'gameMenu'}
	<GameMenu />
{/if}
