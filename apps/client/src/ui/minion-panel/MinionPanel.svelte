<script lang="ts">
	import { findMinion, getAssignment } from '@minion-campus/sim'
	import { assignMinion } from '../../state/gameActions'
	import { getGame } from '../../state/gameStore.svelte'
	import { careActionOrder, performPanelCare } from './minionPanelActions'
	import { closeMinionPanel, minionPanelState } from './minionPanelState.svelte'
	import {
		getAssignmentOptions,
		getCareCounts,
		getGenderLabel,
		getLifeStageLabel,
		getNeedBars,
		getPersonalityText,
		getSpeciesName,
		getStatRows,
		getTraitNames,
		isSameAssignment
	} from './minionPanelView'
	import './MinionPanel.css'

	const game = $derived(getGame())
	const minion = $derived(game && minionPanelState.minionId ? findMinion(game, minionPanelState.minionId) : undefined)
	const currentAssignment = $derived(game && minion ? getAssignment(game, minion.id) : null)
	const careCounts = $derived(minion ? getCareCounts(minion) : null)
	const assignmentOptions = $derived(game && minion ? getAssignmentOptions(game, minion.id) : [])

	const careLabels = { pet: 'Pet', feed: 'Feed', play: 'Play' }

	const getCareDetail = (action: 'pet' | 'feed' | 'play') => {
		if (!careCounts || !game) return ''
		const count = careCounts[action]
		if (count.limit === null) return `${game.inventory.food} food`
		return `${count.used}/${count.limit} today`
	}

	const isCareSpent = (action: 'pet' | 'feed' | 'play') => {
		const count = careCounts?.[action]
		if (!count || count.limit === null) return false
		return count.used >= count.limit
	}
</script>

{#if game && minion && currentAssignment}
	<aside class="minion-panel" aria-label={`${minion.name} details`}>
		<header class="minion-panel-header">
			<div>
				<h2 class="minion-panel-name">{minion.name}</h2>
				<p class="minion-panel-subtitle">
					{getSpeciesName(minion)} · {getGenderLabel(minion)} · {getLifeStageLabel(minion)} · {minion.daysLived} days old
				</p>
			</div>
			<button class="minion-panel-close" onclick={closeMinionPanel}>Esc</button>
		</header>

		<section class="minion-panel-section">
			<p class="minion-panel-personality">{getPersonalityText(minion)}</p>
			{#if minion.traitIds.length > 0}
				<div class="minion-panel-traits">
					{#each getTraitNames(minion) as traitName (traitName)}
						<span class="minion-panel-trait">{traitName}</span>
					{/each}
				</div>
			{/if}
		</section>

		<section class="minion-panel-section">
			<div class="need-row">
				<span class="need-label">Bond</span>
				<div class="need-bar isBond"><div class="need-fill" style:width={`${minion.trust}%`}></div></div>
			</div>
			{#each getNeedBars(minion) as need (need.label)}
				<div class="need-row">
					<span class="need-label">{need.label}</span>
					<div class="need-bar" class:isLow={need.value < 30}>
						<div class="need-fill" style:width={`${need.value}%`}></div>
					</div>
				</div>
			{/each}
		</section>

		<section class="minion-panel-section">
			<h3 class="minion-panel-heading">Care</h3>
			<div class="care-buttons">
				{#each careActionOrder as action, actionIndex (action)}
					<button class="care-button" class:isSpent={isCareSpent(action)} onclick={() => performPanelCare(action)}>
						<span class="minion-panel-key">{actionIndex + 1}</span>
						<span class="care-button-label">{careLabels[action]}</span>
						<span class="care-button-detail">{getCareDetail(action)}</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="minion-panel-section">
			<h3 class="minion-panel-heading">Today's activity</h3>
			<div class="assignment-grid">
				{#each assignmentOptions as option (option.key)}
					<button
						class="assignment-option"
						class:isSelected={isSameAssignment(option.assignment, currentAssignment)}
						disabled={!option.isAvailable}
						onclick={() => assignMinion(minion.id, option.assignment)}
					>
						<span class="assignment-label">{option.label}</span>
						<span class="assignment-detail">{option.detail}</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="minion-panel-section">
			<h3 class="minion-panel-heading">Stats</h3>
			<div class="stat-grid">
				{#each getStatRows(minion) as stat (stat.key)}
					<div class="stat-cell">
						<span class="stat-label">{stat.label}</span>
						<span class="stat-value">{stat.value}</span>
					</div>
				{/each}
			</div>
		</section>
	</aside>
{/if}
