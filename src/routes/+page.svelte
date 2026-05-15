<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import PromptHeading from '$lib/components/PromptHeading.svelte';
  import PostCard from '$lib/components/PostCard.svelte';
  import { reveal } from '$lib/reveal';
  import { posts, postCount } from '$lib/posts';
</script>

<svelte:head>
  <title>Gaanesh — Blog</title>
</svelte:head>

<main class="relative mx-auto flex max-w-5xl flex-col gap-14 px-4 pb-24 pt-28 sm:gap-16 sm:px-6 md:pt-32">
  <Hero />

  <section id="posts" use:reveal={{ distance: 24 }} class="space-y-6">
    <PromptHeading path="posts" command="ls -la --sort=time">
      {postCount} {postCount === 1 ? 'entry' : 'entries'} · most recent first
    </PromptHeading>

    {#if posts.length === 0}
      <p class="rounded-2xl border border-ghost-200/70 bg-white/85 p-6 font-mono text-sm text-ghost-500 dark:border-ink-600/60 dark:bg-ink-900/60">
        // archive is empty — writing the next one
      </p>
    {:else}
      <div class="grid gap-5 md:grid-cols-2" use:reveal={{ delay: 60, distance: 20 }}>
        {#each posts as post, i}
          <PostCard {post} delay={80 + Math.min(i, 5) * 70} />
        {/each}
      </div>
    {/if}
  </section>
</main>
