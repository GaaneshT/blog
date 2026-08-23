<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import Contact from '$lib/components/Contact.svelte';
  import { enhanceCodeBlocks, renderMath, enhanceCallouts, enhanceHeadings } from '$lib/enhance.js';

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

  // mdsvex passes each frontmatter key to the layout as its own prop. The
  // metadata object is kept as a fallback for anything that arrives bundled.
  export let title: string = '';
  export let description: string = '';
  export let excerpt: string = '';
  export let slug: string = '';
  export let date: string = '';
  export let readingTime: number | string | null = null;
  export let categories: unknown = [];
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
    const path = frontmatterSlug
      ? `/${frontmatterSlug}`
      : (() => {
          const segments = pathname.split('/').filter(Boolean);
          if (segments.length === 0) return '/';
          const canonicalSegments = segments.map(slugifySegment).filter(Boolean);
          return canonicalSegments.length ? `/${canonicalSegments.join('/')}` : '/';
        })();
    return withTrailingSlash(path);
  })();

  $: canonicalUrl = `${SITE_URL}${canonicalPath}`;

  $: pageTitle = title || (typeof metadata.title === 'string' ? metadata.title : '') || 'Gaanesh — Blog';

  $: pageDescription =
    description ||
    (typeof metadata.description === 'string' ? metadata.description : '') ||
    excerpt ||
    (typeof metadata.excerpt === 'string' ? metadata.excerpt : '') ||
    DEFAULT_DESCRIPTION;

  $: computedOgSlug = frontmatterSlug || pathname.replace(/^\/+|\/+$/g, '');
  $: ogImageSlug = computedOgSlug || 'default';
  $: ogImage = `${SITE_URL}${OG_BASE_PATH}/${ogImageSlug}.jpg`;

  $: postTitle = title || (typeof metadata.title === 'string' ? metadata.title : '');

  $: rawDate = date || (typeof metadata.date === 'string' ? metadata.date : '');
  $: postDate = rawDate;

  $: rawReading = readingTime ?? metadata.readingTime ?? null;
  $: postReading =
    typeof rawReading === 'number' || typeof rawReading === 'string' ? rawReading : null;

  $: rawCategories = Array.isArray(categories)
    ? categories
    : Array.isArray(metadata.categories)
      ? (metadata.categories as unknown[])
      : [];
  $: postCategories = rawCategories.map(String);

  const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let mounted = false;

  const refresh = async () => {
    await tick();
    enhanceCodeBlocks();
    renderMath();
    enhanceCallouts();
    enhanceHeadings();
  };

  onMount(() => {
    mounted = true;
    refresh();
  });

  afterNavigate(() => {
    if (!mounted) return;
    setTimeout(refresh, 0);
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

<div class="phead">
  {#if postTitle}
    <h1>{postTitle}</h1>
  {/if}
  <div class="artmeta">
    {#if postDate}<time datetime={postDate}>{formatDate(postDate)}</time>{/if}
    {#if postReading}<span>{postReading} min read</span>{/if}
    {#if postCategories.length}<span>{postCategories.join(' · ')}</span>{/if}
  </div>
</div>

<article class="markdown-body">
  <slot />
</article>

<Contact
  line="If this was useful, or you disagree with it, tell me."
  backHref="/"
  backLabel="All writing"
/>
