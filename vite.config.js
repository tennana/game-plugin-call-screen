import {sveltekit} from '@sveltejs/kit/vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess'
import autoprefixer from "autoprefixer";
import cssnext from "postcss-cssnext";
import * as fs from "fs";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import {defineConfig} from 'vite'
import {resolve} from 'path'
import zipPack from "vite-plugin-zip-pack";

export default defineConfig(({command, mode}) => {
	if (command === 'build' && mode === 'TYRANO') {
		if(fs.existsSync("dist/tyrano/call_screen.tbp")){
			fs.unlinkSync("dist/tyrano/call_screen.tbp");
		}
		/** @type {import('vite').UserConfig} */
		return {
			plugins: [svelte({
				compilerOptions: {customElement: true},
				preprocess: preprocess({
					postcss: {
						plugins: [
							cssnext({
								features: {
									calc: true,
									filter: true,
									rem: true
								}
							}),
							autoprefixer(["last 4 versions"])
						]
					}
				})
			}), viteStaticCopy({
				targets: [
					{src: './src/init.ks', dest: '.'},
					{src: './src/call_screen.builder.js', dest: '.'}
				]
			}), zipPack({
				inDir: "dist/tyrano/",
				outDir: "dist/tyrano/",
				outFileName: "call_screen.tbp"
			})],
			build: {
				outDir: "dist/tyrano/call_screen/",
				lib: {
					entry: resolve(__dirname, "src/tyrano_init.ts"),
					name: "call-screen.js",
					formats: ['iife'],
					fileName: () => 'call_screen.js'
				},
			}
		};
	}
	/** @type {import('vite').UserConfig} */
	return {
		plugins: [sveltekit({
			svelte: {customElement: true}
		})],
	};
});

