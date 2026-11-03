<script lang="ts">
	import { formatCalendarDate, getCalendarDate } from '@minion-campus/sim'
	import { getGame } from '../../state/gameStore.svelte'
	import { interactionState } from '../../world/interaction/interactionState.svelte'
	import { openModal } from '../modals/modalState.svelte'
	import './CampusHud.css'

	const game = $derived(getGame())
	const date = $derived(game ? getCalendarDate(game.absoluteDay) : null)
	const isFree = $derived(interactionState.mode === 'free')
	const seasonLabels = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' }
</script>

{#if game && date}
	<div class="campus-hud">
		<div class="hud-date">
			<span class={`hud-season is${seasonLabels[date.season]}`}>{seasonLabels[date.season]}</span>
			<span>{formatCalendarDate(date)}</span>
		</div>
		<div class="hud-resources">
			<span class="hud-resource"><b>{game.money}</b> coins</span>
			<span class="hud-resource"><b>{game.inventory.food}</b> food</span>
			<button class="hud-menu-button" onclick={() => openModal('gameMenu')} disabled={!isFree}>Menu</button>
		</div>
	</div>

	<button class="end-day-button" onclick={() => openModal('endDayReview')} disabled={!isFree}>End Day</button>
{/if}
