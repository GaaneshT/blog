<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import Bar from '$lib/components/Bar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  afterNavigate(({ to, from }) => {
    if (!to?.url?.hash && from?.url.pathname !== to?.url.pathname) {
      window.scrollTo(0, 0);
    }
  });
</script>

<a href="#top" class="skip">Skip to content</a>

<div class="wrap">
  <Bar />
  <main id="top">
    <slot />
  </main>
</div>

<Footer />
