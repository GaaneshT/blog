<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import Backdrop from '$lib/components/Backdrop.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let paletteOpen = false;

  afterNavigate(({ to, from }) => {
    if (!to?.url?.hash && from?.url.pathname !== to?.url.pathname) {
      window.scrollTo(0, 0);
    }
  });
</script>

<Backdrop />

<Nav onOpenPalette={() => (paletteOpen = true)} />

<CommandPalette bind:open={paletteOpen} />

<a
  href="#top"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink-900 focus:px-3 focus:py-1.5 focus:text-sm focus:text-white"
>
  Skip to content
</a>

<div id="top">
  <slot />
</div>

<Footer />
