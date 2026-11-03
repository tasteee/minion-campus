<script lang="ts">
	import { toastState } from './toastState.svelte'
	import './Toast.css'
</script>

{#if toastState.message}
	{#key toastState.toastKey}
		<div class="toast" role="status">{toastState.message}</div>
	{/key}
{/if}
