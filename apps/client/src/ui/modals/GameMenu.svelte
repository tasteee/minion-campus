<script lang="ts">
	import { exportSaveFile } from '../../persistence/saveGame'
	import { importSave, startNewGame } from '../../state/gameActions'
	import { getGame } from '../../state/gameStore.svelte'
	import { showToast } from '../toast/toastState.svelte'
	import Modal from './Modal.svelte'
	import { closeModal } from './modalState.svelte'
	import './GameMenu.css'

	let isConfirmingNewGame = $state(false)
	let fileInput = $state<HTMLInputElement>()

	const importMessages = {
		loaded: 'Save loaded. Welcome back!',
		empty: 'That file has no save in it.',
		invalid: 'That file is not a Minion Campus save.',
		incompatible: 'That save is from a different version and cannot be loaded yet.'
	}

	const handleExport = () => {
		const game = getGame()
		if (game) exportSaveFile(game)
	}

	const handleImport = async (event: Event) => {
		const input = event.currentTarget as HTMLInputElement
		const file = input.files?.[0]
		input.value = ''
		if (!file) return
		const status = await importSave(file)
		showToast(importMessages[status])
		if (status === 'loaded') closeModal()
	}

	const handleNewGame = async () => {
		await startNewGame()
		isConfirmingNewGame = false
		closeModal()
		showToast('A fresh campus! Say hello to your new minion.')
	}
</script>

<Modal title="Campus menu">
	<p class="menu-note">Your campus saves automatically in this browser.</p>
	<div class="menu-actions">
		<button class="modal-button" onclick={handleExport}>Export save file</button>
		<button class="modal-button" onclick={() => fileInput?.click()}>Import save file</button>
		<input class="menu-file-input" type="file" accept="application/json,.json" bind:this={fileInput} onchange={handleImport} />
		{#if !isConfirmingNewGame}
			<button class="modal-button isDanger" onclick={() => (isConfirmingNewGame = true)}>Start a new campus</button>
		{/if}
		{#if isConfirmingNewGame}
			<div class="menu-confirm">
				<p>This replaces your current campus. Export first if you want to keep it.</p>
				<button class="modal-button isDanger" onclick={handleNewGame}>Yes, start over</button>
				<button class="modal-button" onclick={() => (isConfirmingNewGame = false)}>Keep my campus</button>
			</div>
		{/if}
	</div>

	{#snippet actions()}
		<button class="modal-button isPrimary" onclick={closeModal}>Close</button>
	{/snippet}
</Modal>
