import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import strip from '@rollup/plugin-strip';

export default defineConfig(({ command }) => {
	const both = {
		test: {
			include: ["src/**/*.test.{ts,js}"]
		}
	}
	if (command === 'build') {
		return {
			plugins: [sveltekit(), strip({ include: 'src/**/*.{js,ts,svelte}' })],
			...both
		};
	} else {
		return {
			plugins: [sveltekit()],
			...both
		};
	}
});
