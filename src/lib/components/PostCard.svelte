<script lang="ts">
  import { formatDate, truncate, type Post } from '$lib/posts';
  import { reveal } from '$lib/reveal';

  export let post: Post;
  export let delay = 0;
</script>

<a
  use:reveal={{ delay, distance: 20 }}
  href={`/${post.slug}/`}
  data-sveltekit-preload-data
  class="group relative flex flex-col overflow-hidden rounded-2xl border border-ghost-200/70 bg-white/90 p-5 shadow-lg transition hover:-translate-y-1 hover:border-neon-cyan/50 hover:shadow-xl dark:border-ink-600/60 dark:bg-ink-800/60"
>
  <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-rose opacity-60 transition group-hover:opacity-100"></div>

  <div class="flex items-start justify-between gap-3 font-mono text-[11px] text-ghost-500 dark:text-ghost-400">
    <time datetime={post.date}>{formatDate(post.date)}</time>
    {#if post.readingTime}<span>{post.readingTime} min read</span>{/if}
  </div>

  <h3 class="mt-2 text-balance text-lg font-semibold text-ink-900 transition group-hover:text-neon-cyan dark:text-white">{post.title}</h3>

  {#if post.excerpt}
    <p class="mt-2 flex-1 text-pretty text-sm leading-relaxed text-ink-600 dark:text-ghost-300">{truncate(post.excerpt, 160)}</p>
  {/if}

  <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
    {#if post.categories.length}
      <div class="flex flex-wrap gap-1.5">
        {#each post.categories as cat}
          <span class="rounded-full border border-ghost-200/60 bg-ghost-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ghost-500 dark:border-ink-600/70 dark:bg-ink-900/60 dark:text-ghost-400">{cat}</span>
        {/each}
      </div>
    {:else}<span></span>{/if}
    <span class="font-mono text-xs text-neon-cyan transition group-hover:translate-x-0.5">read ↗</span>
  </div>
</a>
