<script lang="ts">
	import { Canvas } from '@threlte/core'
	import { NeutralToneMapping } from 'three'
	import ModelPreview from './scenes/model-preview/ModelPreview.svelte'
	import SceneRoot from './scenes/SceneRoot.svelte'
	import DialogueBox from './ui/dialogue/DialogueBox.svelte'
	import ControlsHint from './ui/hud/ControlsHint.svelte'
	import InteractionPrompt from './ui/hud/InteractionPrompt.svelte'
	import MinionMenu from './ui/minion-menu/MinionMenu.svelte'
	import Toast from './ui/toast/Toast.svelte'
	import './App.css'

	const previewModelId = new URLSearchParams(window.location.search).get('preview')
</script>

<div class="app">
	<div class="app-canvas">
		<Canvas toneMapping={NeutralToneMapping}>
			{#if previewModelId}
				<ModelPreview modelId={previewModelId} />
			{/if}
			{#if !previewModelId}
				<SceneRoot />
			{/if}
		</Canvas>
	</div>
	<ControlsHint />
	<InteractionPrompt />
	<DialogueBox />
	<MinionMenu />
	<Toast />
</div>
