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

  // Old mixed-case URLs are redirected to their lowercase canonical form.
  const redirectToCanonical = (): void => {
    const { pathname, search, hash } = window.location;
    const canonicalSegments = pathname.split('/').filter(Boolean).map(slugifySegment).filter(Boolean);
    const canonicalPath = canonicalSegments.length ? `/${canonicalSegments.join('/')}` : '/';
    if (canonicalPath !== pathname) {
      window.location.replace(`${canonicalPath}${search}${hash}`);
    }
  };

  onMount(redirectToCanonical);
</script>

<svelte:head>
  <title>Redirecting…</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="phead">
  <h1>That page moved</h1>
  <p>
    Sending you to the lowercase version of this URL. If nothing happens,
    <a class="mail" href="/" style="font-size:inherit">head back to the archive</a>.
  </p>
  <noscript>
    <p>Enable JavaScript, or edit the URL so it is all lowercase.</p>
  </noscript>
  <a class="back" href="/"><span aria-hidden="true">&larr;</span> All writing</a>
</div>
