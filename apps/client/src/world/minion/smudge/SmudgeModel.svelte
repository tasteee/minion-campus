<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import type { Group } from 'three'
	import Ink from '../../toon/Ink.svelte'
	import ToonMaterial from '../../toon/ToonMaterial.svelte'
	import type { PoseT } from '../minionBehavior'
	import { smudgePalette } from './smudgePalette'
	import { computeRigPose, createRigState, smudgeDimensions } from './smudgeRig'

	// Smudge: a punk bunny that walks on two feet and plops down to sit with feet out front.
	// Faces +z. Origin between the feet on the ground.

	type PropsT = { getPose: () => PoseT }

	const props: PropsT = $props()
	const dims = smudgeDimensions
	const rigState = createRigState()
	const sides = [1, -1]

	let hips = $state<Group>()
	let torso = $state<Group>()
	let head = $state<Group>()
	let eyes = $state<Group>()
	let tail = $state<Group>()
	let leftLeg = $state<Group>()
	let rightLeg = $state<Group>()
	let leftArm = $state<Group>()
	let rightArm = $state<Group>()
	let leftEar = $state<Group>()
	let rightEar = $state<Group>()
	let elapsedSeconds = Math.random() * 10

	// Mohawk spikes along the top of the head, front (+) to back (-). Angle from vertical.
	const mohawkSpikes = [
		{ angle: 0.62, height: 0.15 },
		{ angle: 0.38, height: 0.25 },
		{ angle: 0.12, height: 0.34 },
		{ angle: -0.16, height: 0.37 },
		{ angle: -0.44, height: 0.31 },
		{ angle: -0.72, height: 0.22 },
		{ angle: -0.98, height: 0.14 }
	]

	const sideTufts = [
		{ y: 0.12, z: -0.1, tilt: -1.05, height: 0.12 },
		{ y: 0.04, z: -0.14, tilt: -1.3, height: 0.1 },
		{ y: 0.18, z: -0.04, tilt: -0.85, height: 0.11 }
	]

	const collarSpikeAngles = [-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35]
	const chestTufts = [-0.09, -0.045, 0, 0.045, 0.09]
	const tailPuffs = [
		{ x: 0.06, y: 0.05, z: -0.02 },
		{ x: -0.06, y: 0.04, z: -0.01 },
		{ x: 0, y: 0.09, z: -0.03 },
		{ x: 0.03, y: -0.03, z: -0.04 }
	]
	const whiskerAngles = [-0.12, 0.05, 0.22]
	const toePads = [-0.035, 0, 0.035]

	useTask((deltaSeconds) => {
		if (!hips || !torso || !head || !eyes || !tail || !leftLeg || !rightLeg || !leftArm || !rightArm || !leftEar || !rightEar) return
		elapsedSeconds += deltaSeconds
		const rig = computeRigPose(rigState, props.getPose(), elapsedSeconds, deltaSeconds)
		hips.position.y = rig.hipY
		hips.rotation.x = rig.hipLean
		torso.scale.set(1 + rig.breathe * 0.5, 1 + rig.breathe, 1 + rig.breathe * 0.5)
		head.rotation.x = rig.headTilt - rig.hipLean * 0.7
		head.rotation.y = rig.headTurn
		eyes.scale.y = rig.eyeOpen
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
	})
</script>

{#snippet leg(side: number)}
	<T.Mesh position.y={-0.02} scale={[0.9, 1, 1.1]} castShadow>
		<T.SphereGeometry args={[0.12, 24, 18]} />
		<ToonMaterial color={smudgePalette.fur} />
		<Ink thickness={0.01} />
	</T.Mesh>
	<T.Mesh position.y={-0.13} castShadow>
		<T.CapsuleGeometry args={[0.068, 0.1, 8, 16]} />
		<ToonMaterial color={smudgePalette.fur} />
		<Ink thickness={0.01} />
	</T.Mesh>
	<T.Group position={[side * 0.005, -0.24, 0.045]}>
		<T.Mesh scale={[0.95, 0.62, 1.6]} castShadow>
			<T.SphereGeometry args={[0.085, 24, 16]} />
			<ToonMaterial color={smudgePalette.white} />
			<Ink thickness={0.01} />
		</T.Mesh>
		<T.Mesh position={[0, -0.05, -0.02]} scale={[1, 0.25, 1.25]}>
			<T.SphereGeometry args={[0.036, 16, 10]} />
			<T.MeshBasicMaterial color={smudgePalette.pad} />
		</T.Mesh>
		{#each toePads as toeX (toeX)}
			<T.Mesh position={[toeX, -0.046, 0.075 - Math.abs(toeX) * 0.4]} scale={[1, 0.3, 1]}>
				<T.SphereGeometry args={[0.016, 10, 8]} />
				<T.MeshBasicMaterial color={smudgePalette.pad} />
			</T.Mesh>
		{/each}
	</T.Group>
{/snippet}

{#snippet arm()}
	<T.Mesh position.y={-0.06} castShadow>
		<T.CapsuleGeometry args={[0.048, 0.08, 6, 12]} />
		<ToonMaterial color={smudgePalette.fur} />
		<Ink thickness={0.008} />
	</T.Mesh>
	<T.Mesh position.y={-0.135} scale={[1, 0.9, 1.1]} castShadow>
		<T.SphereGeometry args={[0.058, 16, 12]} />
		<ToonMaterial color={smudgePalette.white} />
		<Ink thickness={0.008} />
	</T.Mesh>
{/snippet}

{#snippet ear(ringCount: number)}
	<T.Group rotation.x={-0.12}>
		<T.Mesh position.y={0.21} scale={[1, 1, 0.42]} castShadow>
			<T.CapsuleGeometry args={[0.085, 0.3, 8, 20]} />
			<ToonMaterial color={smudgePalette.fur} />
			<Ink thickness={0.01} />
		</T.Mesh>
		<T.Mesh position={[0, 0.215, 0.026]} scale={[1, 1, 0.25]}>
			<T.CapsuleGeometry args={[0.056, 0.24, 8, 16]} />
			<ToonMaterial color={smudgePalette.earInner} />
		</T.Mesh>
		{#each Array.from({ length: ringCount }, (unused, index) => index) as ringIndex (ringIndex)}
			<T.Mesh position={[0.082, 0.07 + ringIndex * 0.07, 0]} rotation.y={Math.PI / 2}>
				<T.TorusGeometry args={[0.02, 0.006, 8, 20]} />
				<ToonMaterial color={smudgePalette.metal} />
				<Ink thickness={0.004} />
			</T.Mesh>
		{/each}
	</T.Group>
{/snippet}

{#snippet eye(side: number)}
	<T.Group position={[side * 0.115, 0, 0.245]} rotation.y={side * 0.32}>
		<T.Mesh position={[side * 0.02, 0.04, -0.006]} scale={[1.2, 0.66, 0.42]}>
			<T.SphereGeometry args={[0.09, 20, 14]} />
			<ToonMaterial color={smudgePalette.eyeshadow} />
		</T.Mesh>
		<T.Mesh position.z={0.008} scale={[0.86, 0.98, 0.38]}>
			<T.SphereGeometry args={[0.088, 24, 18]} />
			<ToonMaterial color={smudgePalette.eye} />
		</T.Mesh>
		<T.Mesh position={[0, -0.034, 0.024]} scale={[0.8, 0.55, 0.3]}>
			<T.SphereGeometry args={[0.056, 16, 12]} />
			<T.MeshBasicMaterial color={smudgePalette.iris} />
		</T.Mesh>
		<T.Mesh position={[-side * 0.022, 0.03, 0.036]}>
			<T.SphereGeometry args={[0.021, 12, 10]} />
			<T.MeshBasicMaterial color="#ffffff" />
		</T.Mesh>
		<T.Mesh position={[side * 0.02, -0.035, 0.035]}>
			<T.SphereGeometry args={[0.01, 8, 8]} />
			<T.MeshBasicMaterial color="#ffffff" />
		</T.Mesh>
		<T.Mesh position={[side * 0.075, 0.045, 0.012]} rotation.z={side * -1.05}>
			<T.ConeGeometry args={[0.016, 0.075, 8]} />
			<ToonMaterial color={smudgePalette.eye} />
		</T.Mesh>
	</T.Group>
{/snippet}

{#snippet cheek(side: number)}
	{#each [-0.04, 0, 0.04] as fluffY (fluffY)}
		<T.Mesh position={[side * 0.27, -0.1 + fluffY, 0.06]} rotation.z={side * -(1.85 + fluffY * 4)} scale={[1, 1, 0.6]}>
			<T.ConeGeometry args={[0.04, 0.12, 10]} />
			<ToonMaterial color={smudgePalette.white} />
			<Ink thickness={0.006} />
		</T.Mesh>
	{/each}
	<T.Mesh position={[side * 0.17, -0.085, 0.215]} scale={[1.3, 0.6, 0.3]}>
		<T.SphereGeometry args={[0.045, 14, 10]} />
		<T.MeshBasicMaterial color={smudgePalette.blush} />
	</T.Mesh>
	{#each whiskerAngles as whiskerAngle (whiskerAngle)}
		<T.Mesh position={[side * 0.3, -0.085 + whiskerAngle * 0.12, 0.17]} rotation={[0, side * -0.35, side * (Math.PI / 2 + whiskerAngle)]}>
			<T.CylinderGeometry args={[0.0035, 0.0035, 0.24, 6]} />
			<T.MeshBasicMaterial color={smudgePalette.eye} />
		</T.Mesh>
	{/each}
{/snippet}

<T.Group>
	<T.Group bind:ref={leftLeg} position={[dims.hipSpread, dims.hipStandY, 0]} rotation.order="YXZ">
		{@render leg(1)}
	</T.Group>
	<T.Group bind:ref={rightLeg} position={[-dims.hipSpread, dims.hipStandY, 0]} rotation.order="YXZ">
		{@render leg(-1)}
	</T.Group>

	<T.Group bind:ref={hips} position.y={dims.hipStandY}>
		<T.Group bind:ref={torso}>
			<T.Mesh position.y={dims.bodyCenterY} scale={[1, 1.12, 0.9]} castShadow>
				<T.SphereGeometry args={[0.24, 32, 24]} />
				<ToonMaterial color={smudgePalette.fur} />
				<Ink thickness={0.012} />
			</T.Mesh>
			<T.Mesh position={[0, 0.15, 0.115]} scale={[0.85, 1.05, 0.5]}>
				<T.SphereGeometry args={[0.2, 24, 18]} />
				<ToonMaterial color={smudgePalette.white} />
			</T.Mesh>
			{#each chestTufts as tuftX (tuftX)}
				<T.Mesh position={[tuftX, 0.06 - Math.abs(tuftX) * 0.4, 0.19 - Math.abs(tuftX) * 0.5]} rotation.x={Math.PI + 0.35} scale={[1, 1, 0.5]}>
					<T.ConeGeometry args={[0.032, 0.09, 8]} />
					<ToonMaterial color={smudgePalette.white} />
				</T.Mesh>
			{/each}
		</T.Group>

		<T.Group bind:ref={tail} position={[0, 0.06, -0.2]}>
			<T.Mesh castShadow>
				<T.SphereGeometry args={[0.09, 18, 14]} />
				<ToonMaterial color={smudgePalette.white} />
				<Ink thickness={0.008} />
			</T.Mesh>
			{#each tailPuffs as puff (`${puff.x}:${puff.y}`)}
				<T.Mesh position={[puff.x, puff.y, puff.z]}>
					<T.SphereGeometry args={[0.055, 14, 10]} />
					<ToonMaterial color={smudgePalette.white} />
					<Ink thickness={0.006} />
				</T.Mesh>
			{/each}
		</T.Group>

		<T.Group position={[0, 0.315, 0.015]} rotation.x={0.12}>
			<T.Mesh rotation.x={Math.PI / 2} scale={[1, 0.92, 1]}>
				<T.TorusGeometry args={[0.17, 0.032, 12, 40]} />
				<ToonMaterial color={smudgePalette.collar} />
				<Ink thickness={0.006} />
			</T.Mesh>
			{#each collarSpikeAngles as spikeAngle (spikeAngle)}
				<T.Group rotation.y={spikeAngle}>
					<T.Mesh position.z={0.198} rotation.x={Math.PI / 2}>
						<T.ConeGeometry args={[0.016, 0.05, 10]} />
						<ToonMaterial color={smudgePalette.metal} />
						<Ink thickness={0.004} />
					</T.Mesh>
				</T.Group>
			{/each}
			<T.Mesh position={[0, -0.042, 0.205]} rotation.y={Math.PI / 2}>
				<T.TorusGeometry args={[0.012, 0.004, 6, 12]} />
				<ToonMaterial color={smudgePalette.metal} />
			</T.Mesh>
			<T.Mesh position={[0, -0.082, 0.222]} scale={[0.6, 1.5, 0.5]}>
				<T.OctahedronGeometry args={[0.028]} />
				<ToonMaterial color={smudgePalette.crystal} />
				<Ink thickness={0.004} />
			</T.Mesh>
		</T.Group>

		<T.Group bind:ref={leftArm} position={[dims.shoulderX, dims.shoulderY, 0.04]}>
			{@render arm()}
		</T.Group>
		<T.Group bind:ref={rightArm} position={[-dims.shoulderX, dims.shoulderY, 0.04]}>
			{@render arm()}
		</T.Group>

		<T.Group bind:ref={head} position.y={dims.headY}>
			<T.Mesh scale={[1.08, 0.93, 0.95]} castShadow>
				<T.SphereGeometry args={[0.3, 40, 30]} />
				<ToonMaterial color={smudgePalette.fur} />
				<Ink thickness={0.012} />
			</T.Mesh>
			<T.Mesh position={[0, -0.125, 0.15]} scale={[1.02, 0.6, 0.66]}>
				<T.SphereGeometry args={[0.22, 28, 20]} />
				<ToonMaterial color={smudgePalette.white} />
			</T.Mesh>

			<T.Group bind:ref={eyes}>
				{#each sides as side (side)}
					{@render eye(side)}
				{/each}
			</T.Group>

			{#each sides as side (side)}
				{@render cheek(side)}
			{/each}

			<T.Mesh position={[0, -0.062, 0.3]} scale={[1.3, 0.85, 0.8]}>
				<T.SphereGeometry args={[0.022, 12, 10]} />
				<ToonMaterial color={smudgePalette.nose} />
			</T.Mesh>
			{#each sides as side (side)}
				<T.Mesh position={[side * 0.021, -0.09, 0.302]} rotation.z={Math.PI}>
					<T.TorusGeometry args={[0.021, 0.0055, 6, 16, Math.PI]} />
					<T.MeshBasicMaterial color={smudgePalette.eye} />
				</T.Mesh>
			{/each}

			{#each mohawkSpikes as spike (spike.angle)}
				<T.Group position={[0, Math.cos(spike.angle) * 0.25, Math.sin(spike.angle) * 0.25]} rotation.x={spike.angle * 0.55 - 0.32}>
					<T.Mesh position.y={spike.height / 2} scale={[0.52, 1, 1]} castShadow>
						<T.ConeGeometry args={[0.075, spike.height, 16]} />
						<ToonMaterial color={smudgePalette.mohawk} />
						<Ink thickness={0.008} />
					</T.Mesh>
					<T.Mesh position={[0.008, spike.height * 0.42, 0.012]} scale={[0.22, 1, 0.6]}>
						<T.ConeGeometry args={[0.06, spike.height * 0.8, 12]} />
						<ToonMaterial color={smudgePalette.mohawkStreak} />
					</T.Mesh>
				</T.Group>
			{/each}
			<T.Mesh position={[0, 0.15, 0.235]} rotation.x={Math.PI + 0.62} scale={[1, 1, 0.3]}>
				<T.ConeGeometry args={[0.05, 0.2, 12]} />
				<ToonMaterial color={smudgePalette.mohawk} />
			</T.Mesh>
			{#each sideTufts as tuft (tuft.tilt)}
				<T.Mesh position={[0.25, tuft.y, tuft.z]} rotation.z={tuft.tilt} scale={[1, 1, 0.5]}>
					<T.ConeGeometry args={[0.035, tuft.height, 10]} />
					<ToonMaterial color={smudgePalette.mohawk} />
					<Ink thickness={0.005} />
				</T.Mesh>
			{/each}

			<T.Group bind:ref={leftEar} position={[0.12, 0.2, -0.04]}>
				{@render ear(2)}
			</T.Group>
			<T.Group bind:ref={rightEar} position={[-0.12, 0.2, -0.04]} scale={[-1, 1, 1]}>
				{@render ear(1)}
			</T.Group>
		</T.Group>
	</T.Group>
</T.Group>
