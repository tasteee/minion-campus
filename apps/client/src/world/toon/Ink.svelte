<script lang="ts">
	import { Outlines } from '@threlte/extras'
	import { toonPalette } from './toonPalette'

	// Hand-drawn style outline (inverted hull). Thickness in world units.
	type PropsT = { thickness?: number }

	const props: PropsT = $props()
</script>

<Outlines color={toonPalette.ink} thickness={props.thickness ?? 0.018} />
