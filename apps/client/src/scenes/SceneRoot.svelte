<script lang="ts">
	import { sceneManager } from './sceneManager.svelte'
	import TestScene from './test-scene/TestScene.svelte'
</script>

{#if sceneManager.currentSceneId === 'test'}
	<TestScene />
{/if}
