<script lang="ts">
  import { onMount } from 'svelte';

  export let error: unknown = null;
  export let status: number | null = null;
  $: void error;
  $: void status;

  const slugifySegment = (segment: string): string =>
    decodeURIComponent(segment)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

  const redirectToCanonical = (): void => {
    const { pathname, search, hash } = window.location;
    const canonicalSegments = pathname
      .split('/')
      .filter(Boolean)
      .map(slugifySegment)
      .filter(Boolean);
    const canonicalPath = canonicalSegments.length ? `/${canonicalSegments.join('/')}` : '/';
    if (canonicalPath !== pathname) {
      window.location.replace(`${canonicalPath}${search}${hash}`);
    }
  };

  onMount(() => {
    redirectToCanonical();
  });
</script>

<svelte:head>
  <title>Redirecting…</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 pt-28 text-center font-mono">
  <div class="prompt-heading">
    <span class="user">gaanesh</span><span class="at">@</span><span class="host">blog</span>
    <span class="sign"> $</span>
    <span class="cmd">cd ~ # redirecting…</span>
  </div>
  <p class="mt-4 text-sm text-ghost-500 dark:text-ghost-400">Sending you to the lowercase URL…</p>
  <p class="mt-2">
    <a href="/" class="text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 transition hover:decoration-neon-cyan">return to the homepage</a>
  </p>
  <noscript>
    <p class="mt-2 text-xs text-ghost-500">Enable JavaScript or manually update the URL to use lowercase characters.</p>
  </noscript>
</main>
