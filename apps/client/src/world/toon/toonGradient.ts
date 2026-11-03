import { DataTexture, NearestFilter, RedFormat } from 'three'

// Three-step light ramp for MeshToonMaterial: soft shadow, mid, lit.
const createToonGradient = () => {
	const tones = new Uint8Array([178, 228, 255])
	const texture = new DataTexture(tones, tones.length, 1, RedFormat)
	texture.minFilter = NearestFilter
	texture.magFilter = NearestFilter
	texture.generateMipmaps = false
	texture.needsUpdate = true
	return texture
}

export const toonGradient = createToonGradient()
