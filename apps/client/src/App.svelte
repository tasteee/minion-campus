<script lang="ts">
	import { Canvas } from '@threlte/core'
	import { onMount } from 'svelte'
	import { NeutralToneMapping } from 'three'
	import ModelPreview from './scenes/model-preview/ModelPreview.svelte'
	import SceneRoot from './scenes/SceneRoot.svelte'
	import { bootGame } from './state/gameActions'
	import { getGame } from './state/gameStore.svelte'
	import DialogueBox from './ui/dialogue/DialogueBox.svelte'
	import CampusHud from './ui/hud/CampusHud.svelte'
	import ControlsHint from './ui/hud/ControlsHint.svelte'
	import InteractionPrompt from './ui/hud/InteractionPrompt.svelte'
	import MinionPanel from './ui/minion-panel/MinionPanel.svelte'
	import ModalRoot from './ui/modals/ModalRoot.svelte'
	import Toast from './ui/toast/Toast.svelte'
	import { showToast } from './ui/toast/toastState.svelte'
	import './App.css'

	const previewModelId = new URLSearchParams(window.location.search).get('preview')
	const isLoaded = $derived(getGame() !== null)

	onMount(async () => {
		if (previewModelId) return
		const bootResult = await bootGame()
		if (bootResult === 'newGame') showToast('Welcome, Headmaster! Walk up to your first minion and press E.')
		if (bootResult === 'replacedIncompatible') showToast('Your old save was from an earlier build. It was kept as a backup, and a fresh campus started.')
	})
</script>

<div class="app">
	<div class="app-canvas">
		<Canvas toneMapping={NeutralToneMapping}>
			{#if previewModelId}
				<ModelPreview modelId={previewModelId} />
			{/if}
			{#if !previewModelId && isLoaded}
				<SceneRoot />
			{/if}
		</Canvas>
	</div>

	{#if !previewModelId}
		{#if !isLoaded}
			<div class="app-loading">Waking up the campus…</div>
		{/if}
		<ControlsHint />
		<CampusHud />
		<InteractionPrompt />
		<DialogueBox />
		<MinionPanel />
		<ModalRoot />
		<Toast />
	{/if}
</div>
