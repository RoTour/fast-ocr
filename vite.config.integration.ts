// vitest.config.integration.ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
  test: {
    include: ['src/**/*.int.test.ts'],
		fileParallelism: false,
		setupFiles: ['./src/lib/_tests/testContainers.setup.test.ts'],
		alias: {
			"$lib": './src/lib'
		}
  },
})
