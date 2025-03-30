<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import Prism from 'prismjs';
	import '../app.css';
	import 'prismjs/themes/prism-tomorrow.css';
	import "katex/dist/katex.min.css";
	// @ts-ignore
	import renderMathInElement from 'katex/dist/contrib/auto-render.js';
	import 'prismjs/components/prism-c';
	import 'prismjs/components/prism-python.js';
	import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
	import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

	function enhanceCodeBlocks() {
		document.querySelectorAll('pre code').forEach((block) => {
			const parent = block.parentElement;
			if (parent && !parent.querySelector('.copy-button')) {
				const button = document.createElement('button');
				button.innerText = 'Copy';
				button.className = 'copy-button';
				parent.appendChild(button);

				button.addEventListener('click', () => {
					const text = block.textContent ?? '';
					navigator.clipboard.writeText(text).then(() => {
						button.innerText = 'Copied!';
						setTimeout(() => (button.innerText = 'Copy'), 1500);
					});
				});
			}
		});
		document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
			block.classList.add('line-numbers');
		});
		document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
			const match = block.className.match(/language-(\w+)/);
			if (match) {
				const lang = match[1];
				block.setAttribute('data-lang', `</> ${lang.charAt(0).toUpperCase() + lang.slice(1)}`);
			}
		});
		Prism.highlightAll();
	}

	function renderMath() {
		renderMathInElement(document.body, {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '$', right: '$', display: false }
			],
		});
	}

	onMount(() => {
		// console.log("FirstLoad");
		enhanceCodeBlocks();
		renderMath();

		afterNavigate(async () => {
			// console.log("afterNavigate logged");
			await tick();
			enhanceCodeBlocks();
			renderMath();
		});
	});
</script>

<slot />

<footer>


	<div class="footer-links">
		<a href="https://github.com/GaaneshT" target="_blank">GitHub</a>
		<a href="https://linkedin.com/in/gaanesht" target="_blank">LinkedIn</a>
		<a href="https://x.com/PlantSecurity" target="_blank">Twitter</a>
	</div>

</footer>

<style>
	.copy-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background-color: #44475a;
		color: #f8f8f2;
		border: none;
		padding: 0.3rem 0.6rem;
		font-size: 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.2s ease;
		z-index: 10;
	}

	.copy-button:hover {
		background-color: #6272a4;
	}

	pre {
		position: relative;
	}
</style>
