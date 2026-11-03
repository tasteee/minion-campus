<script lang="ts">
	import { T, useThrelte } from '@threlte/core'
	import { World } from '@threlte/rapier'
	import { onMount } from 'svelte'
	import { Color, Fog } from 'three'
	import { getGame } from '../../state/gameStore.svelte'
	import ThirdPersonCamera from '../../world/camera/ThirdPersonCamera.svelte'
	import CampusGround from '../../world/environment/CampusGround.svelte'
	import Cottage from '../../world/environment/Cottage.svelte'
	import FlowerPatch from '../../world/environment/FlowerPatch.svelte'
	import Tree from '../../world/environment/Tree.svelte'
	import EquipmentPiece from '../../world/equipment/EquipmentPiece.svelte'
	import { attachKeyboard } from '../../world/input/keyboard'
	import InteractionSystem from '../../world/interaction/InteractionSystem.svelte'
	import MinionView from '../../world/minion/MinionView.svelte'
	import Npc from '../../world/npc/Npc.svelte'
	import Signpost from '../../world/objects/Signpost.svelte'
	import { worldPalette } from '../../world/palette'
	import Player from '../../world/player/Player.svelte'
	import { equipmentSlots, flowerPatches, housePosition, pipPosition, signPosition, trees } from './campusLayout'

	const threlte = useThrelte()

	const placedEquipment = $derived(
		(getGame()?.campus.equipment ?? []).flatMap((instance) => {
			const slot = equipmentSlots[instance.equipmentId]
			return slot ? [{ instanceId: instance.id, slot }] : []
		})
	)

	const livingMinionIds = $derived((getGame()?.minions ?? []).filter((minion) => minion.isAlive).map((minion) => minion.id))

	onMount(() => {
		threlte.scene.background = new Color(worldPalette.sky)
		threlte.scene.fog = new Fog(worldPalette.sky, 40, 90)
		const detachKeyboard = attachKeyboard()

		return () => {
			detachKeyboard()
			threlte.scene.fog = null
		}
	})
</script>

<T.HemisphereLight args={[worldPalette.skyLight, worldPalette.groundBounce, 1.4]} />

<T.DirectionalLight
	position={[14, 24, 10]}
	intensity={1.7}
	color={worldPalette.sunlight}
	castShadow
	shadow.mapSize={[2048, 2048]}
	shadow.bias={-0.0004}
	shadow.camera.left={-26}
	shadow.camera.right={26}
	shadow.camera.top={26}
	shadow.camera.bottom={-26}
/>

<World>
	<CampusGround />
	<Cottage position={[housePosition.x, 0, housePosition.z]} />

	{#each trees as tree, treeIndex (`${tree.x}:${tree.z}`)}
		<Tree position={[tree.x, 0, tree.z]} scale={0.9 + (treeIndex % 3) * 0.15} foliageColor={treeIndex % 4 === 0 ? '#c9b6ec' : undefined} />
	{/each}

	{#each flowerPatches as patch (`${patch.x}:${patch.z}`)}
		<FlowerPatch position={[patch.x, 0, patch.z]} />
	{/each}

	{#each placedEquipment as placed (placed.instanceId)}
		<EquipmentPiece equipmentInstanceId={placed.instanceId} slot={placed.slot} />
	{/each}

	{#each livingMinionIds as minionId (minionId)}
		<MinionView {minionId} />
	{/each}

	<Npc npcId="pip" position={pipPosition} bodyColor={worldPalette.npcBody} hatColor={worldPalette.npcHat} />
	<Signpost objectId="campusSign" position={signPosition} />

	<Player />
	<ThirdPersonCamera />
	<InteractionSystem />
</World>
