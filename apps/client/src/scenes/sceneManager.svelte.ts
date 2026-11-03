// Scene manager state machine. M1 only has the test scene.
// Campus, town and arena join in later milestones.

export type SceneIdT = 'test'

type SceneManagerStateT = {
	currentSceneId: SceneIdT
}

export const sceneManager = $state<SceneManagerStateT>({
	currentSceneId: 'test'
})

export const goToScene = (sceneId: SceneIdT) => {
	sceneManager.currentSceneId = sceneId
}
