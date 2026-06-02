<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import {
    enhanceCodeBlocks,
    renderMath,
    enhanceCallouts,
    enhanceHeadings,
    buildToc
  } from '$lib/enhance.js';

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

  type TocItem = { id: string; text: string; level: number };

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

  let toc: TocItem[] = [];
  let activeId = '';
  let progress = 0;
  let observer: IntersectionObserver | null = null;
  let mounted = false;

  const wireObserver = () => {
    if (observer) observer.disconnect();
    if (typeof IntersectionObserver === 'undefined') return;
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible.length) activeId = (visible[0].target as HTMLElement).id;
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: [0, 1] }
    );
    document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((h) => {
      if (h.id) observer!.observe(h);
    });
  };

  const updateProgress = () => {
    const article = document.querySelector('.markdown-body') as HTMLElement | null;
    if (!article) {
      progress = 0;
      return;
    }
    const rect = article.getBoundingClientRect();
    const start = window.scrollY + rect.top;
    const total = rect.height - window.innerHeight;
    if (total <= 0) {
      progress = window.scrollY > start ? 100 : 0;
      return;
    }
    const scrolled = Math.min(Math.max(window.scrollY - start, 0), total);
    progress = Math.round((scrolled / total) * 1000) / 10;
  };

  const refresh = async () => {
    await tick();
    enhanceCodeBlocks();
    renderMath();
    enhanceCallouts();
    enhanceHeadings();
    toc = buildToc();
    activeId = toc[0]?.id ?? '';
    wireObserver();
    updateProgress();
  };

  const handleTocClick = (event: MouseEvent, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    activeId = id;
    history.replaceState(null, '', `#${id}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  onMount(() => {
    mounted = true;
    refresh();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    }
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

<div class="read-progress" aria-hidden="true">
  <div class="read-progress-bar" style="width: {progress}%"></div>
</div>

<div class="post-shell">
  {#if toc.length > 1}
    <aside class="post-toc" aria-label="On this page">
      <div class="post-toc-inner">
        <div class="post-toc-head">
          <span class="post-toc-prompt">$ tree</span>
          <span class="post-toc-title">on this page</span>
        </div>
        <ol class="post-toc-list">
          {#each toc as item (item.id)}
            <li class="post-toc-item lvl-{item.level}" class:active={activeId === item.id}>
              <a href={`#${item.id}`} on:click={(e) => handleTocClick(e, item.id)}>{item.text}</a>
            </li>
          {/each}
        </ol>
      </div>
    </aside>
  {/if}

  <main class="post-main">
    <header class="post-header">
      <a
        href="/"
        data-sveltekit-preload-data
        class="back-link"
      >
        <span>←</span> back to archive
      </a>

      <div class="post-prompt">
        <span class="text-neon-green">gaanesh</span><span class="text-ghost-400">@</span><span class="text-neon-violet">blog</span>
        <span class="text-ghost-400"> ~/{frontmatterSlug || 'post'}</span>
        <span class="text-ghost-400"> $</span>
        <span class="text-ghost-100">cat post.md</span>
      </div>

      {#if postTitle}
        <h1>{postTitle}</h1>
      {/if}

      <div class="post-meta">
        {#if postDate}<time datetime={postDate}>{formatDate(postDate)}</time>{/if}
        {#if postReading}<span>· {postReading} min read</span>{/if}
        {#if postAuthor}<span>· by {postAuthor}</span>{/if}
      </div>

      {#if postCategories.length}
        <div class="post-tags">
          {#each postCategories as cat}
            <span class="post-tag">{cat}</span>
          {/each}
        </div>
      {/if}

      <div class="post-divider"></div>
    </header>

    <article class="markdown-body">
      <slot />
    </article>

    <div class="post-footer">
      <a href="/" data-sveltekit-preload-data>← back to archive</a>
      <a href="https://gaanesh.com">portfolio ↗</a>
    </div>
  </main>
</div>

<style>
  .read-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 60;
    background: transparent;
    pointer-events: none;
  }
  .read-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-neon-cyan), var(--color-neon-violet));
    box-shadow: 0 0 12px rgba(103, 232, 249, 0.6);
    transition: width 0.08s linear;
  }

  .post-shell {
    position: relative;
    margin: 0 auto;
    padding: 7rem 1rem 3rem;
    max-width: 80rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }
  @media (min-width: 1100px) {
    .post-shell {
      grid-template-columns: 16rem minmax(0, 48rem);
      justify-content: center;
      padding-top: 8rem;
    }
  }

  .post-toc {
    display: none;
  }
  @media (min-width: 1100px) {
    .post-toc {
      display: block;
      position: sticky;
      top: 7rem;
      align-self: start;
      max-height: calc(100vh - 8rem);
      overflow-y: auto;
      padding-right: 0.5rem;
    }
  }
  .post-toc-inner {
    border-left: 1px solid rgba(103, 232, 249, 0.15);
    padding-left: 1rem;
  }
  .post-toc-head {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin-bottom: 0.85rem;
  }
  .post-toc-prompt {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-neon-cyan);
    letter-spacing: 0.04em;
  }
  .post-toc-title {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-ghost-500);
  }
  .post-toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .post-toc-item a {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.4;
    padding: 0.25rem 0.5rem;
    color: var(--color-ghost-500);
    border-left: 2px solid transparent;
    margin-left: -1rem;
    padding-left: calc(1rem - 2px);
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .post-toc-item.lvl-3 a {
    padding-left: calc(1.75rem - 2px);
    font-size: 0.72rem;
    color: var(--color-ghost-500);
    opacity: 0.85;
  }
  .post-toc-item a:hover {
    color: var(--color-neon-cyan);
  }
  .post-toc-item.active > a {
    color: var(--color-neon-cyan);
    border-left-color: var(--color-neon-cyan);
    background: rgba(103, 232, 249, 0.06);
  }

  .post-main {
    min-width: 0;
  }

  .post-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-ghost-500);
    transition: color 0.15s ease;
  }
  .back-link:hover {
    color: var(--color-neon-cyan);
  }

  .post-prompt {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--color-neon-cyan);
  }

  .post-header h1 {
    font-size: clamp(1.85rem, 4vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.015em;
    color: var(--color-ink-900);
    text-wrap: balance;
    margin: 0;
  }
  :global(.dark) .post-header h1 {
    color: #fff;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.85rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-ghost-500);
  }
  :global(.dark) .post-meta {
    color: var(--color-ghost-400);
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding-top: 0.25rem;
  }
  .post-tag {
    border: 1px solid rgba(200, 208, 230, 0.6);
    background: var(--color-ghost-50);
    color: var(--color-ghost-500);
    border-radius: 999px;
    padding: 0.15rem 0.6rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  :global(.dark) .post-tag {
    background: rgba(10, 14, 26, 0.6);
    border-color: rgba(31, 39, 66, 0.7);
    color: var(--color-ghost-400);
  }

  .post-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(103, 232, 249, 0.3), transparent);
  }

  .post-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(200, 208, 230, 0.6);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-ghost-500);
  }
  :global(.dark) .post-footer {
    border-color: rgba(31, 39, 66, 0.6);
    color: var(--color-ghost-400);
  }
  .post-footer a {
    transition: color 0.15s ease;
  }
  .post-footer a:hover {
    color: var(--color-neon-cyan);
  }
</style>
