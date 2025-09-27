<script>
  import { onMount } from 'svelte';

  export let error;
  export let status;
  $: void error;
  $: void status;

  const slugifySegment = (segment) =>
    decodeURIComponent(segment)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

  const redirectToCanonical = () => {
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

<main class="fallback">
  <p>Redirecting you to the lowercase URL…</p>
  <p>
    <a href="/">Return to the homepage</a>
  </p>
  <noscript>
    Enable JavaScript or manually update the URL to use lowercase characters.
  </noscript>
</main>

<style>
  .fallback {
    min-height: 100vh;
    display: grid;
    place-content: center;
    gap: 0.75rem;
    text-align: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #1f2933;
    padding: 1.5rem;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
