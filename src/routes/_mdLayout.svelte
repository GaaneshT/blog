<script>
  import { page } from '$app/stores';

  export let metadata = {};

  import '../app.css';

  const SITE_URL = 'https://blog.gaanesh.com';
  const DEFAULT_DESCRIPTION = 'Gaanesh shares notes on security, systems, and personal growth.';

  const slugifySegment = (segment) =>
    decodeURIComponent(segment)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

  $: pathname = $page.url.pathname;
  $: rawFrontmatterSlug =
    typeof metadata.slug === 'string' && metadata.slug.trim() !== ''
      ? metadata.slug.trim().replace(/^\/+|\/+$/g, '')
      : '';
  $: frontmatterSlug = rawFrontmatterSlug
    ? rawFrontmatterSlug
        .split('/')
        .filter(Boolean)
        .map(slugifySegment)
        .join('/')
    : '';
  $: canonicalPath = frontmatterSlug
    ? `/${frontmatterSlug}`
    : (() => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length === 0) return '/';
        const canonicalSegments = segments.map(slugifySegment).filter(Boolean);
        return canonicalSegments.length ? `/${canonicalSegments.join('/')}` : '/';
      })();
  $: canonicalUrl = `${SITE_URL}${canonicalPath}`;

  $: title = metadata.title || 'Gaanesh — Blog';
  $: description = metadata.description || metadata.excerpt || DEFAULT_DESCRIPTION;
  $: computedOgSlug = frontmatterSlug || pathname.replace(/^\/+|\/+$/g, '');
  $: ogImageSlug = computedOgSlug || 'default';
  $: ogImage = `${SITE_URL}/static/og/${ogImageSlug}.jpg`;
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
  {/if}
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="markdown-body">
  <slot />
</div>
