import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Relative base so the build works on GitHub Pages under /<repo>/.
export default defineConfig({
	base: './',
	plugins: [svelte()],

	// Three + Rapier (WASM inlined) make one large chunk. Revisit code-splitting in M8.
	build: { chunkSizeWarningLimit: 6000 }
})
