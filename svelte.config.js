import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

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
    adapter: adapter({
      fallback: '404.html'
    }),

    paths: {
      // Use '' for subdomain deploy (blog.gaanesh.com), or set base path if needed
      base: dev ? '' : (process.env.BASE_PATH ?? '')
    },

  }
};

export default config;
