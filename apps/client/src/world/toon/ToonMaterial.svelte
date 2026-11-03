<script lang="ts">
	import { T } from '@threlte/core'
	import { toonGradient } from './toonGradient'

	type PropsT = { color: string }

	const props: PropsT = $props()
</script>

<T.MeshToonMaterial color={props.color} gradientMap={toonGradient} />
