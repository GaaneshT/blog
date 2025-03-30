import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  extensions: ['.svelte', '.md', '.svx'],

  preprocess: [
    vitePreprocess(),
	mdsvex({
		extensions: ['.md', '.svx'],
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
		layout: {
		  _: './src/routes/_mdLayout.svelte'
		}
	  })
  ],

  kit: {
    adapter: adapter()
  }
};

export default config;
