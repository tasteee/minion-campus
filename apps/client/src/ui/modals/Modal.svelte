<script lang="ts">
	import type { Snippet } from 'svelte'
	import './Modal.css'

	type PropsT = { title: string; children: Snippet; actions: Snippet }

	const props: PropsT = $props()
</script>

<div class="modal-scrim">
	<div class="modal-card" role="dialog" aria-label={props.title}>
		<h2 class="modal-title">{props.title}</h2>
		<div class="modal-body">{@render props.children()}</div>
		<div class="modal-actions">{@render props.actions()}</div>
	</div>
</div>
