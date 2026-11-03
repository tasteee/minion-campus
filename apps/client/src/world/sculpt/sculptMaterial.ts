import type { Texture } from 'three'
import { Color, MeshToonMaterial, Vector2 } from 'three'
import { toonGradient } from '../toon/toonGradient'

// Toon material for sculpted characters: vertex-colored fur, an optional painted
// decal projected along local +z (faces), and a soft rim light for that illustrated glow.

export type DecalT = {
	map: Texture
	center: [number, number]
	size: [number, number]
}

export type SculptMaterialOptionsT = {
	decal?: DecalT
	rimColor?: string
	rimStrength?: number
}

const vertexDeclarations = `
varying vec3 vObjectPosition;
varying vec3 vObjectNormal;
`

const fragmentDeclarations = `
varying vec3 vObjectPosition;
varying vec3 vObjectNormal;
uniform vec3 rimColor;
uniform float rimStrength;
#ifdef USE_DECAL
uniform sampler2D decalMap;
uniform vec2 decalCenter;
uniform vec2 decalSize;
uniform float decalEnabled;
#endif
`

const decalChunk = `
#include <color_fragment>
#ifdef USE_DECAL
vec2 decalUv = (vObjectPosition.xy - decalCenter) / decalSize + 0.5;
bool isInDecal = decalUv.x > 0.0 && decalUv.x < 1.0 && decalUv.y > 0.0 && decalUv.y < 1.0;
if (isInDecal && vObjectNormal.z > 0.12) {
	vec4 decalColor = texture2D(decalMap, decalUv);
	diffuseColor.rgb = mix(diffuseColor.rgb, decalColor.rgb, decalColor.a * decalEnabled);
}
#endif
`

const rimChunk = `
float rimFacing = 1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);
outgoingLight += rimColor * rimStrength * pow(rimFacing, 2.6);
#include <opaque_fragment>
`

export const createSculptMaterial = (options: SculptMaterialOptionsT = {}) => {
	const material = new MeshToonMaterial({ vertexColors: true, gradientMap: toonGradient })
	const decal = options.decal

	material.onBeforeCompile = (shader) => {
		shader.uniforms.rimColor = { value: new Color(options.rimColor ?? '#ffffff') }
		shader.uniforms.rimStrength = { value: options.rimStrength ?? 0.35 }
		if (decal) shader.uniforms.decalMap = { value: decal.map }
		if (decal) shader.uniforms.decalCenter = { value: new Vector2(decal.center[0], decal.center[1]) }
		if (decal) shader.uniforms.decalSize = { value: new Vector2(decal.size[0], decal.size[1]) }
		if (decal) shader.uniforms.decalEnabled = { value: 1 }
		const decalDefine = decal ? '#define USE_DECAL\n' : ''
		shader.vertexShader = vertexDeclarations + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjectPosition = position;\nvObjectNormal = normal;')
		shader.fragmentShader = decalDefine + fragmentDeclarations + shader.fragmentShader
			.replace('#include <color_fragment>', decalChunk)
			.replace('#include <opaque_fragment>', rimChunk)
		material.userData.shader = shader
	}

	// Different decal textures need separate shader programs.
	material.customProgramCacheKey = () => (decal ? `sculpt-decal-${decal.map.uuid}` : 'sculpt')
	return material
}

// Swap the decal texture at runtime (e.g. open ↔ closed eyes).
export const setDecalMap = (material: MeshToonMaterial, map: Texture) => {
	const shader = material.userData.shader as { uniforms: Record<string, { value: unknown }> } | undefined
	if (!shader?.uniforms.decalMap) return
	shader.uniforms.decalMap.value = map
}
