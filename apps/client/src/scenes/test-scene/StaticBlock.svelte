<script lang="ts">
	import { T } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'
	import type { BlockT } from './testSceneLayout'

	type PropsT = { block: BlockT }

	const props: PropsT = $props()
</script>

<T.Group position={props.block.position}>
	<RigidBody type="fixed">
		<Collider shape="cuboid" args={[props.block.size[0] / 2, props.block.size[1] / 2, props.block.size[2] / 2]} />
		<T.Mesh castShadow receiveShadow>
			<T.BoxGeometry args={props.block.size} />
			<T.MeshStandardMaterial color={props.block.color} roughness={0.9} />
		</T.Mesh>
	</RigidBody>
</T.Group>
