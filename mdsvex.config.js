// mdsvex.config.js
import { defineMDSveXConfig as defineConfig } from 'mdsvex';

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

    preprocess: [
        mdsvex({
            extensions: ['.md', '.svx'],
        })
    ],
});

export default config;
