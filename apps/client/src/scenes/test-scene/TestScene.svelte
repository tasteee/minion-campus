<script lang="ts">
	import { T, useThrelte } from '@threlte/core'
	import { Collider, RigidBody, World } from '@threlte/rapier'
	import { onMount } from 'svelte'
	import { Color, Fog } from 'three'
	import ThirdPersonCamera from '../../world/camera/ThirdPersonCamera.svelte'
	import { attachKeyboard } from '../../world/input/keyboard'
	import { worldPalette } from '../../world/palette'
	import Player from '../../world/player/Player.svelte'
	import StaticBlock from './StaticBlock.svelte'
	import { groundSize, testBlocks } from './testSceneLayout'

	const threlte = useThrelte()
	const halfGround = groundSize / 2

	onMount(() => {
		threlte.scene.background = new Color(worldPalette.sky)
		threlte.scene.fog = new Fog(worldPalette.sky, 30, 80)
		const detachKeyboard = attachKeyboard()

		return () => {
			detachKeyboard()
			threlte.scene.fog = null
		}
	})
</script>

<T.HemisphereLight args={[worldPalette.skyLight, worldPalette.groundBounce, 1.2]} />

<T.DirectionalLight
	position={[12, 20, 8]}
	intensity={1.8}
	color={worldPalette.sunlight}
	castShadow
	shadow.mapSize={[2048, 2048]}
	shadow.camera.left={-30}
	shadow.camera.right={30}
	shadow.camera.top={30}
	shadow.camera.bottom={-30}
/>

<World>
	<T.Group position={[0, -0.5, 0]}>
		<RigidBody type="fixed">
			<Collider shape="cuboid" args={[halfGround, 0.5, halfGround]} />
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[groundSize, 1, groundSize]} />
				<T.MeshStandardMaterial color={worldPalette.grass} roughness={1} />
			</T.Mesh>
		</RigidBody>
	</T.Group>

	{#each testBlocks as block (block.id)}
		<StaticBlock {block} />
	{/each}

	<Player />
	<ThirdPersonCamera />
</World>
