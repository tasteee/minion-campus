<script lang="ts">
	import { useTask } from '@threlte/core'
	import { onMount } from 'svelte'
	import { interactableEntities } from '../ecs/ecsWorld'
	import { playerState } from '../player/playerState'
	import { findFocusedEntity } from './findFocusedEntity'
	import { attachInteractionKeys } from './interactionKeys'
	import { interactionState } from './interactionState.svelte'

	onMount(() => attachInteractionKeys())

	const clearFocus = () => {
		if (interactionState.focusedEntityId === null) return
		interactionState.focusedEntityId = null
	}

	useTask(() => {
		if (interactionState.mode !== 'free') return
		const focused = findFocusedEntity(playerState.position, interactableEntities)
		if (!focused) return clearFocus()
		if (interactionState.focusedEntityId === focused.id) return
		interactionState.focusedEntityId = focused.id
		interactionState.focusedVerb = focused.interactable.verb
		interactionState.focusedName = focused.interactable.name
	})
</script>
