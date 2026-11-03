<script lang="ts">
	import { Canvas } from '@threlte/core'
	import { NeutralToneMapping } from 'three'
	import SceneRoot from './scenes/SceneRoot.svelte'
	import ControlsHint from './ui/hud/ControlsHint.svelte'
	import './App.css'
</script>

<div class="app">
	<div class="app-canvas">
		<Canvas toneMapping={NeutralToneMapping}>
			<SceneRoot />
		</Canvas>
	</div>
	<ControlsHint />
</div>
