<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import { enhanceCodeBlocks, renderMath } from '$lib/enhance.js';

  type PostMetadata = {
    title?: string;
    description?: string;
    excerpt?: string;
    slug?: string;
    author?: string;
    date?: string;
    readingTime?: number | string | null;
    categories?: unknown;
    [k: string]: unknown;
  };

  export let title: string = '';
  export let description: string = '';
  export let excerpt: string = '';
  export let slug: string = '';
  export let metadata: PostMetadata = {};

  const SITE_URL = 'https://blog.gaanesh.com';
  const OG_BASE_PATH = '/og';
  const DEFAULT_DESCRIPTION = 'Gaanesh shares notes on security, systems, and personal growth.';

  const slugifySegment = (segment: string): string =>
    decodeURIComponent(segment)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

  const withTrailingSlash = (path: string): string =>
    path === '/' ? '/' : path.replace(/\/+$/, '') + '/';

  $: pathname = $page.url.pathname;

  $: rawFrontmatterSlug = (() => {
    const fromProp = typeof slug === 'string' && slug.trim() !== '' ? slug : null;
    const metaSlug = typeof metadata.slug === 'string' ? metadata.slug : null;
    const fromMetadata = metaSlug && metaSlug.trim() !== '' ? metaSlug : null;
    const resolved = (fromProp ?? fromMetadata ?? '').trim();
    return resolved.replace(/^\/+|\/+$/g, '');
  })();

  $: frontmatterSlug = rawFrontmatterSlug
    ? rawFrontmatterSlug.split('/').filter(Boolean).map(slugifySegment).join('/')
    : '';

  $: canonicalPath = (() => {
    const base = frontmatterSlug
      ? `/${frontmatterSlug}`
      : (() => {
          const segments = pathname.split('/').filter(Boolean);
          if (segments.length === 0) return '/';
          const canonicalSegments = segments.map(slugifySegment).filter(Boolean);
          return canonicalSegments.length ? `/${canonicalSegments.join('/')}` : '/';
        })();
    return withTrailingSlash(base);
  })();

  $: canonicalUrl = `${SITE_URL}${canonicalPath}`;

  $: pageTitle =
    title ||
    (typeof metadata.title === 'string' ? metadata.title : '') ||
    'Gaanesh — Blog';

  $: pageDescription =
    description ||
    (typeof metadata.description === 'string' ? metadata.description : '') ||
    excerpt ||
    (typeof metadata.excerpt === 'string' ? metadata.excerpt : '') ||
    DEFAULT_DESCRIPTION;

  $: computedOgSlug = frontmatterSlug || pathname.replace(/^\/+|\/+$/g, '');
  $: ogImageSlug = computedOgSlug || 'default';
  $: ogImage = `${SITE_URL}${OG_BASE_PATH}/${ogImageSlug}.jpg`;

  $: postTitle =
    (typeof metadata.title === 'string' ? metadata.title : '') || title;
  $: postDate = typeof metadata.date === 'string' ? metadata.date : '';
  $: postReading =
    typeof metadata.readingTime === 'number' || typeof metadata.readingTime === 'string'
      ? metadata.readingTime
      : null;
  $: postCategories = Array.isArray(metadata.categories)
    ? (metadata.categories as unknown[]).map(String)
    : [];
  $: postAuthor =
    typeof metadata.author === 'string' && metadata.author ? metadata.author : 'Gaanesh';

  const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let mounted = false;
  onMount(() => {
    mounted = true;
    enhanceCodeBlocks();
    renderMath();
  });

  afterNavigate(() => {
    if (!mounted) return;
    setTimeout(() => {
      enhanceCodeBlocks();
      renderMath();
    }, 0);
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  {#if pageDescription}
    <meta name="description" content={pageDescription} />
    <meta property="og:description" content={pageDescription} />
  {/if}
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="relative mx-auto w-full max-w-3xl px-4 pb-12 pt-28 sm:px-6 md:pt-32">
  <header class="mb-10 space-y-4">
    <a
      href="/"
      data-sveltekit-preload-data
      class="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ghost-500 transition hover:text-neon-cyan"
    >
      <span>←</span> back to archive
    </a>

    <div class="font-mono text-xs text-neon-cyan">
      <span class="text-neon-green">gaanesh</span><span class="text-ghost-400">@</span><span class="text-neon-violet">blog</span>
      <span class="text-ghost-400"> ~/{frontmatterSlug || 'post'}</span>
      <span class="text-ghost-400"> $</span>
      <span class="text-ghost-100">cat post.md</span>
    </div>

    {#if postTitle}
      <h1 class="text-balance text-3xl font-bold leading-tight tracking-tight text-ink-900 dark:text-white sm:text-4xl">{postTitle}</h1>
    {/if}

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-ghost-500 dark:text-ghost-400">
      {#if postDate}<time datetime={postDate}>{formatDate(postDate)}</time>{/if}
      {#if postReading}<span>· {postReading} min read</span>{/if}
      {#if postAuthor}<span>· by {postAuthor}</span>{/if}
    </div>

    {#if postCategories.length}
      <div class="flex flex-wrap gap-1.5 pt-1">
        {#each postCategories as cat}
          <span class="rounded-full border border-ghost-200/60 bg-ghost-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ghost-500 dark:border-ink-600/70 dark:bg-ink-900/60 dark:text-ghost-400">{cat}</span>
        {/each}
      </div>
    {/if}

    <div class="h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"></div>
  </header>

  <article class="markdown-body">
    <slot />
  </article>

  <div class="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-ghost-200/60 pt-6 font-mono text-xs text-ghost-500 dark:border-ink-600/60 dark:text-ghost-400">
    <a href="/" data-sveltekit-preload-data class="inline-flex items-center gap-1 transition hover:text-neon-cyan">
      ← back to archive
    </a>
    <a href="https://gaanesh.com" class="inline-flex items-center gap-1 transition hover:text-neon-cyan">
      portfolio ↗
    </a>
  </div>
</main>
