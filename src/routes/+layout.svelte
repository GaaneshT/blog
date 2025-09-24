<script>

        import { onMount } from 'svelte';
        import { afterNavigate } from '$app/navigation';
        import { tick } from 'svelte';
        import { page } from '$app/stores';
        import { enhanceCodeBlocks, renderMath } from '$lib/enhance.js';

	
	$: isHome = $page.url.pathname === '/';
  
        onMount(() => {
                if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                }

                const runEnhancements = async () => {
                        await tick();
                        try {
                                enhanceCodeBlocks();
                                renderMath();
                        } catch (error) {
                                console.error('Enhancement failure', error);
                        }
                };

                runEnhancements().catch(() => {
                        /* handled in function */
                });

                afterNavigate((navigation) => {
                        runEnhancements().catch(() => {
                                /* handled in function */
                        });

                        const toUrl = navigation.to?.url;
                        if (!toUrl) {
                                return;
                        }

                        const pathnameChanged = navigation.from?.url.pathname !== toUrl.pathname;
                        const hasHash = toUrl.hash.length > 0;

                        if (pathnameChanged && !hasHash) {
                                requestAnimationFrame(() => {
                                        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                                });
                        }
                });
        });
  </script>

{#if !isHome}

        <header class="site-header">
                <nav class="navbar">
                        <a href="/" class="back-button" data-sveltekit-preload-data>Home</a>


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
        :global(.copy-button) {
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

        :global(.copy-button:hover) {
                background-color: #6272a4;
        }

        :global(pre) {
                position: relative;
        }
</style>
