// Scene manager state machine. Town and arena join in later milestones.

export type SceneIdT = 'campus'

type SceneManagerStateT = {
	currentSceneId: SceneIdT
}

export const sceneManager = $state<SceneManagerStateT>({
	currentSceneId: 'campus'
})

export const goToScene = (sceneId: SceneIdT) => {
	sceneManager.currentSceneId = sceneId
}
