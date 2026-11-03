<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import type { Group } from 'three'
	import { createSculptMaterial, setDecalMap } from '../../sculpt/sculptMaterial'
	import Ink from '../../toon/Ink.svelte'
	import ToonMaterial from '../../toon/ToonMaterial.svelte'
	import type { PoseT } from '../minionBehavior'
	import { faceDecal, getFaceTextures } from './smudgeFace'
	import { smudgePalette } from './smudgePalette'
	import { computeRigPose, createRigState, smudgeDimensions } from './smudgeRig'
	import { getSmudgeGeometries } from './smudgeSculpt'

	// Smudge: a sculpted punk bunny. Walks on two feet; plops down to sit with feet out front.
	// Faces +z. Origin between the feet on the ground.

	type PropsT = { getPose: () => PoseT }

	const props: PropsT = $props()
	const dims = smudgeDimensions
	const rigState = createRigState()
	const geometries = getSmudgeGeometries()
	const faceTextures = getFaceTextures()
	const furMaterial = createSculptMaterial({ rimColor: '#ffffff', rimStrength: 0.22 })
	const mohawkMaterial = createSculptMaterial({ rimColor: '#c9a6ff', rimStrength: 0.45 })
	const headMaterial = createSculptMaterial({ rimStrength: 0.22, decal: { map: faceTextures.open, center: faceDecal.center, size: faceDecal.size } })
	const collarSpikeAngles = [-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35]
	const whiskers = [-0.1, 0.04, 0.18]
	const sides = [1, -1]

	let hips = $state<Group>()
	let torso = $state<Group>()
	let head = $state<Group>()
	let tail = $state<Group>()
	let leftLeg = $state<Group>()
	let rightLeg = $state<Group>()
	let leftArm = $state<Group>()
	let rightArm = $state<Group>()
	let leftEar = $state<Group>()
	let rightEar = $state<Group>()
	let elapsedSeconds = Math.random() * 10
	let areEyesOpen = true

	const updateEyes = (eyeOpen: number) => {
		const shouldBeOpen = eyeOpen > 0.5
		if (shouldBeOpen === areEyesOpen) return
		areEyesOpen = shouldBeOpen
		setDecalMap(headMaterial, shouldBeOpen ? faceTextures.open : faceTextures.closed)
	}

	useTask((deltaSeconds) => {
		if (!hips || !torso || !head || !tail || !leftLeg || !rightLeg || !leftArm || !rightArm || !leftEar || !rightEar) return
		elapsedSeconds += deltaSeconds
		const rig = computeRigPose(rigState, props.getPose(), elapsedSeconds, deltaSeconds)
		hips.position.y = rig.hipY
		hips.rotation.x = rig.hipLean
		torso.scale.set(1 + rig.breathe * 0.5, 1 + rig.breathe, 1 + rig.breathe * 0.5)
		head.rotation.x = rig.headTilt - rig.hipLean * 0.7
		head.rotation.y = rig.headTurn
		tail.rotation.y = rig.tailWag
		leftLeg.position.y = rig.hipY
		rightLeg.position.y = rig.hipY
		leftLeg.rotation.x = rig.leftLeg
		rightLeg.rotation.x = rig.rightLeg
		leftLeg.rotation.y = rig.legSplay
		rightLeg.rotation.y = -rig.legSplay
		leftArm.rotation.x = rig.leftArm
		rightArm.rotation.x = rig.rightArm
		leftArm.rotation.z = rig.armSpread
		rightArm.rotation.z = -rig.armSpread
		leftEar.rotation.z = -rig.leftEar
		rightEar.rotation.z = -rig.rightEar
		updateEyes(rig.eyeOpen)
	})
</script>

{#snippet earRings(count: number)}
	{#each Array.from({ length: count }, (unused, index) => index) as ringIndex (ringIndex)}
		<T.Mesh position={[0.086, 0.08 + ringIndex * 0.075, 0]} rotation.y={Math.PI / 2}>
			<T.TorusGeometry args={[0.02, 0.0055, 10, 24]} />
			<ToonMaterial color={smudgePalette.metal} />
			<Ink thickness={0.003} />
		</T.Mesh>
	{/each}
{/snippet}

<T.Group>
	<T.Group bind:ref={leftLeg} position={[dims.hipSpread, dims.hipStandY, 0]} rotation.order="YXZ">
		<T.Mesh geometry={geometries.leg} material={furMaterial} castShadow>
			<Ink thickness={0.008} />
		</T.Mesh>
	</T.Group>
	<T.Group bind:ref={rightLeg} position={[-dims.hipSpread, dims.hipStandY, 0]} rotation.order="YXZ">
		<T.Mesh geometry={geometries.leg} material={furMaterial} castShadow>
			<Ink thickness={0.008} />
		</T.Mesh>
	</T.Group>

	<T.Group bind:ref={hips} position.y={dims.hipStandY}>
		<T.Group bind:ref={torso}>
			<T.Mesh geometry={geometries.torso} material={furMaterial} castShadow>
				<Ink thickness={0.009} />
			</T.Mesh>
		</T.Group>

		<T.Group bind:ref={tail} position={[0, 0.06, -0.19]}>
			<T.Mesh geometry={geometries.tail} material={furMaterial} castShadow>
				<Ink thickness={0.007} />
			</T.Mesh>
		</T.Group>

		<T.Group position={[0, 0.315, 0.015]} rotation.x={0.12}>
			<T.Mesh rotation.x={Math.PI / 2} scale={[1, 0.92, 1]}>
				<T.TorusGeometry args={[0.165, 0.03, 16, 48]} />
				<ToonMaterial color={smudgePalette.collar} />
				<Ink thickness={0.005} />
			</T.Mesh>
			{#each collarSpikeAngles as spikeAngle (spikeAngle)}
				<T.Group rotation.y={spikeAngle}>
					<T.Mesh position.z={0.193} rotation.x={Math.PI / 2}>
						<T.ConeGeometry args={[0.017, 0.055, 14]} />
						<ToonMaterial color={smudgePalette.metal} />
						<Ink thickness={0.004} />
					</T.Mesh>
				</T.Group>
			{/each}
			<T.Mesh position={[0, -0.042, 0.2]} rotation.y={Math.PI / 2}>
				<T.TorusGeometry args={[0.012, 0.004, 8, 16]} />
				<ToonMaterial color={smudgePalette.metal} />
			</T.Mesh>
			<T.Mesh position={[0, -0.082, 0.215]} scale={[0.6, 1.5, 0.5]}>
				<T.OctahedronGeometry args={[0.03]} />
				<ToonMaterial color={smudgePalette.crystal} />
				<Ink thickness={0.004} />
			</T.Mesh>
		</T.Group>

		<T.Group bind:ref={leftArm} position={[dims.shoulderX, dims.shoulderY, 0.04]}>
			<T.Mesh geometry={geometries.arm} material={furMaterial} castShadow>
				<Ink thickness={0.006} />
			</T.Mesh>
		</T.Group>
		<T.Group bind:ref={rightArm} position={[-dims.shoulderX, dims.shoulderY, 0.04]}>
			<T.Mesh geometry={geometries.arm} material={furMaterial} castShadow>
				<Ink thickness={0.006} />
			</T.Mesh>
		</T.Group>

		<T.Group bind:ref={head} position.y={dims.headY}>
			<T.Mesh geometry={geometries.head} material={headMaterial} castShadow>
				<Ink thickness={0.01} />
			</T.Mesh>
			<T.Mesh geometry={geometries.mohawk} material={mohawkMaterial} castShadow>
				<Ink thickness={0.008} />
			</T.Mesh>

			{#each sides as side (side)}
				{#each whiskers as whiskerTilt (whiskerTilt)}
					<T.Mesh position={[side * 0.33, -0.075 + whiskerTilt * 0.1, 0.16]} rotation={[0, side * -0.4, side * (Math.PI / 2 + whiskerTilt)]}>
						<T.CylinderGeometry args={[0.0018, 0.0032, 0.26, 6]} />
						<T.MeshBasicMaterial color={smudgePalette.eye} />
					</T.Mesh>
				{/each}
			{/each}

			<T.Group bind:ref={leftEar} position={[0.12, 0.2, -0.04]}>
				<T.Group rotation.x={-0.12}>
					<T.Mesh geometry={geometries.ear} material={furMaterial} castShadow>
						<Ink thickness={0.007} />
					</T.Mesh>
					{@render earRings(2)}
				</T.Group>
			</T.Group>
			<T.Group bind:ref={rightEar} position={[-0.12, 0.2, -0.04]} scale={[-1, 1, 1]}>
				<T.Group rotation.x={-0.12}>
					<T.Mesh geometry={geometries.ear} material={furMaterial} castShadow>
						<Ink thickness={0.007} />
					</T.Mesh>
					{@render earRings(1)}
				</T.Group>
			</T.Group>
		</T.Group>
	</T.Group>
</T.Group>
