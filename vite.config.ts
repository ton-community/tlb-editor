import { resolve } from 'path';
import { defineConfig, UserConfig } from 'vite';
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	const config: UserConfig = {
		plugins: [react()],
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
			},
		},
		build: {
			rollupOptions: {
				plugins: inject({
					include: ['node_modules/@ledgerhq/**'],
					modules: { Buffer: ['buffer', 'Buffer'] },
				}),
			},
		},
	};

	if (command !== 'serve') {
		config.base = '/tlb-editor/';
	}

	return config;
});
