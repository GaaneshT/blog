<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhanceCodeBlocks, renderMath } from '$lib/enhance.js';
  
	function goHome() {
    window.location.href = '/';
  }
	
	$: isHome = $page.url.pathname === '/';
  
	onMount(() => {
	  enhanceCodeBlocks();
	  renderMath();
  
	  afterNavigate(async () => {
		await tick();
		enhanceCodeBlocks();
		renderMath();
	  });
	});
  </script>

{#if !isHome}
	<header class="site-header">
		<nav class="navbar">
			<a on:click={goHome} class="back-button">Home</a>

		</nav>
	</header>
{/if}

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
