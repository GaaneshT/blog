<script lang="ts">
  import { onMount } from 'svelte';
  import { reveal } from '$lib/reveal';
  import { identity } from '$lib/identity';
  import { postCount, featuredPost, formatDate } from '$lib/posts';

  const lines = [
    { prompt: '$', cmd: 'whoami' },
    { out: identity.name },
    { out: identity.tagline },
    { prompt: '$', cmd: 'echo $POSTS_COUNT' },
    { out: `${postCount} posts in the archive${featuredPost ? `  ·  latest: ${formatDate(featuredPost.date)}` : ''}` },
    { prompt: '$', cmd: 'ls ~/posts' },
    { out: '_' }
  ];

  let visibleCount = 0;
  let mounted = false;
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  onMount(() => {
    mounted = true;
    if (reducedMotion) { visibleCount = lines.length; return; }
    let i = 0;
    const tick = () => {
      visibleCount = ++i;
      if (i < lines.length) setTimeout(tick, 360);
    };
    setTimeout(tick, 220);
  });
</script>

<section
  use:reveal={{ distance: 32 }}
  class="relative overflow-hidden rounded-3xl border border-ghost-200/60 bg-white/85 p-6 shadow-2xl backdrop-blur-xl transition-colors dark:border-ink-600/60 dark:bg-ink-900/70 sm:p-8 md:p-10"
>
  <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-neon-cyan/[0.06] via-transparent to-neon-violet/[0.06]"></div>
  <div class="pointer-events-none absolute -right-24 top-10 hidden h-72 w-72 rounded-full bg-neon-cyan/10 blur-3xl md:block"></div>

  <div class="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
    <!-- Terminal panel -->
    <div use:reveal={{ delay: 80, distance: 28 }}>
      <div class="overflow-hidden rounded-2xl border border-ghost-200/70 bg-ghost-50 shadow-[var(--shadow-inset-line)] dark:border-ink-600 dark:bg-ink-950/80">
        <div class="flex items-center justify-between gap-3 border-b border-ghost-200/70 bg-white/60 px-3.5 py-2 font-mono text-[11px] text-ghost-500 dark:border-ink-600 dark:bg-ink-900/80 dark:text-ghost-400">
          <div class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-neon-rose/70"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-neon-amber/70"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-neon-green/70"></span>
          </div>
          <span class="truncate">{identity.handle}@{identity.host}:~</span>
          <span class="inline-flex items-center gap-1.5"><span class="dot-live"></span> live</span>
        </div>

        <div class="px-4 py-3.5 font-mono text-[13px] leading-relaxed sm:text-sm" style="min-height: 13rem;">
          {#each lines.slice(0, visibleCount) as line, i (i)}
            {#if line.prompt}
              <div class="text-ghost-700 dark:text-ghost-200">
                <span class="text-neon-green">{identity.handle}</span><span class="text-ghost-400">@</span><span class="text-neon-violet">{identity.host}</span><span class="text-ghost-400">:~$</span>
                <span class="ml-2 text-ink-900 dark:text-ghost-100">{line.cmd}</span>
              </div>
            {:else if line.out === '_'}
              <div class="pl-1 cursor"></div>
            {:else if line.out}
              <div class="pl-1 text-ink-900 dark:text-ghost-100 {i === 1 ? 'text-base sm:text-lg font-semibold tracking-tight glow-text' : ''}">{line.out}</div>
            {/if}
          {/each}
          {#if !mounted}
            <div class="text-ghost-700 dark:text-ghost-200"><span class="text-neon-green">{identity.handle}</span><span class="text-ghost-400">@</span><span class="text-neon-violet">{identity.host}</span><span class="text-ghost-400">:~$</span> <span class="ml-2 text-ink-900 dark:text-ghost-100">whoami</span></div>
            <div class="pl-1 text-base sm:text-lg font-semibold tracking-tight text-ink-900 dark:text-ghost-100">{identity.name}</div>
            <div class="pl-1 text-ink-900 dark:text-ghost-100">{identity.tagline}</div>
            <div class="pl-1 text-ink-900 dark:text-ghost-100">{postCount} posts in the archive</div>
          {/if}
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-3" use:reveal={{ delay: 140, distance: 20 }}>
        {#if featuredPost}
          <a
            href={`/${featuredPost.slug}/`}
            data-sveltekit-preload-data
            class="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2 font-mono text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-ink-700 dark:bg-ghost-100 dark:text-ink-900 dark:hover:bg-white"
          >
            ↓ read latest post
          </a>
        {/if}
        <a
          href="#posts"
          class="inline-flex items-center gap-2 rounded-full border border-ghost-200/70 bg-white/90 px-5 py-2 font-mono text-xs font-medium text-ink-900 transition hover:-translate-y-0.5 hover:border-neon-cyan/50 dark:border-ink-600/70 dark:bg-ink-800/70 dark:text-ghost-100"
        >
          all posts ↓
        </a>
        <a
          href="https://gaanesh.com"
          class="inline-flex items-center gap-2 rounded-full border border-ghost-200/70 bg-white/90 px-5 py-2 font-mono text-xs font-medium text-ink-900 transition hover:-translate-y-0.5 hover:border-neon-cyan/50 dark:border-ink-600/70 dark:bg-ink-800/70 dark:text-ghost-100"
        >
          portfolio ↗
        </a>
      </div>
    </div>

    <!-- Featured-post card -->
    {#if featuredPost}
      <a
        href={`/${featuredPost.slug}/`}
        data-sveltekit-preload-data
        use:reveal={{ delay: 130, distance: 24 }}
        class="group relative overflow-hidden rounded-2xl border border-ghost-200/70 bg-white/90 p-5 shadow-lg transition hover:-translate-y-1 hover:border-neon-cyan/50 hover:shadow-xl dark:border-ink-600/60 dark:bg-ink-800/60"
      >
        <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-rose"></div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-cyan">
          <span class="dot-live"></span> new post
        </span>
        <h3 class="mt-3 text-balance text-lg font-semibold text-ink-900 transition group-hover:text-neon-cyan dark:text-white">{featuredPost.title}</h3>
        <p class="mt-2 text-sm text-ink-600 dark:text-ghost-300">{featuredPost.excerpt}</p>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ghost-500 dark:text-ghost-400">
          <time datetime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
          {#if featuredPost.readingTime}<span>{featuredPost.readingTime} min read</span>{/if}
        </div>
      </a>
    {/if}
  </div>
</section>
