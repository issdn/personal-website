import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import strip from '@rollup/plugin-strip';

export default defineConfig(({ command }) => {
	if (command === 'build') {
		return {
			plugins: [sveltekit(), strip({ include: 'src/**/*.{js,ts,svelte}' })]
		};
	} else {
		return {
			plugins: [sveltekit()],
			test: {
				include: ['src/**/*.{test,spec}.{js,ts}']
			}
		};
	}
});
