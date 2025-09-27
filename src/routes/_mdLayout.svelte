<script>
  import { page } from '$app/stores';

  export let title = '';
  export let description = '';
  export let excerpt = '';
  export let slug = '';
  export let metadata = {};

  import '../app.css';

  const SITE_URL = 'https://blog.gaanesh.com';
  const OG_BASE_PATH = '/og';
  const DEFAULT_DESCRIPTION = 'Gaanesh shares notes on security, systems, and personal growth.';

  const slugifySegment = (segment) =>
    decodeURIComponent(segment)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

  const withTrailingSlash = (path) => (path === '/' ? '/' : path.replace(/\/+$/, '') + '/');

  $: pathname = $page.url.pathname;
  $: rawFrontmatterSlug = (() => {
    const fromProp = typeof slug === 'string' && slug.trim() !== '' ? slug : null;
    const fromMetadata =
      typeof metadata.slug === 'string' && metadata.slug.trim() !== '' ? metadata.slug : null;
    const resolved = (fromProp ?? fromMetadata ?? '').trim();
    return resolved.replace(/^\/+|\/+$/g, '');
  })();
  $: frontmatterSlug = rawFrontmatterSlug
    ? rawFrontmatterSlug
        .split('/')
        .filter(Boolean)
        .map(slugifySegment)
        .join('/')
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

  $: pageTitle = title || metadata.title || 'Gaanesh — Blog';
  $: pageDescription =
    description || metadata.description || excerpt || metadata.excerpt || DEFAULT_DESCRIPTION;
  $: computedOgSlug = frontmatterSlug || pathname.replace(/^\/+|\/+$/g, '');
  $: ogImageSlug = computedOgSlug || 'default';
  $: ogImage = `${SITE_URL}${OG_BASE_PATH}/${ogImageSlug}.jpg`;
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

<div class="markdown-body">
  <slot />
</div>
