<script lang="ts">
	import CampusScene from './campus/CampusScene.svelte'
	import { sceneManager } from './sceneManager.svelte'
</script>

{#if sceneManager.currentSceneId === 'campus'}
	<CampusScene />
{/if}
