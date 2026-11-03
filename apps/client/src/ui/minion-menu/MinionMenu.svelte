<script lang="ts">
	import { getPlaceholderMinion } from '../../world/minion/placeholderMinions'
	import { closeMinionMenu, minionActions, minionMenuState, performMinionActionAt } from './minionMenuState.svelte'
	import './MinionMenu.css'

	const minion = $derived(minionMenuState.minionId ? getPlaceholderMinion(minionMenuState.minionId) : undefined)
</script>

{#if minion}
	<div class="minion-menu" role="dialog" aria-label={minion.name}>
		<div class="minion-menu-header">
			<span class="minion-menu-name">{minion.name}</span>
			<button class="minion-menu-close" onclick={closeMinionMenu}>Esc</button>
		</div>
		<div class="minion-menu-actions">
			{#each minionActions as action, actionIndex (action.id)}
				<button class="minion-menu-action" onclick={() => performMinionActionAt(actionIndex)}>
					<span class="minion-menu-key">{actionIndex + 1}</span>
					{action.label}
				</button>
			{/each}
		</div>
	</div>
{/if}
