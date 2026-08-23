<script lang="ts">
  import PostRow from '$lib/components/PostRow.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import { reveal } from '$lib/reveal';
  import { posts, type Post } from '$lib/posts';
  import { identity, links } from '$lib/identity';

  // posts is already sorted newest first, so years come out newest first too.
  const groups: { year: string; items: Post[] }[] = [];
  for (const post of posts) {
    const year = post.date.slice(0, 4) || 'Undated';
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.items.push(post);
    else groups.push({ year, items: [post] });
  }
</script>

<svelte:head>
  <title>Writing — {identity.name}</title>
  <meta
    name="description"
    content="Notes on security work, studying at NUS, and what I have figured out along the way."
  />
</svelte:head>

<div class="phead">
  <h1>Writing</h1>
  <p>{identity.tagline}</p>
</div>

{#each groups as group}
  <div use:reveal>
    <div class="yrhead">
      <span class="y">{group.year}</span>
      <span class="n">{group.items.length} {group.items.length === 1 ? 'post' : 'posts'}</span>
      <span class="ln"></span>
    </div>
    {#each group.items as post (post.slug)}
      <PostRow {post} />
    {/each}
  </div>
{/each}

{#if posts.length === 0}
  <div class="subnote">
    <p>The archive is empty. The next one is being written.</p>
  </div>
{/if}

<Contact
  line="Happy to chat about anything here, or about security in general."
  backHref={links.portfolio}
  backLabel="Back to start"
/>
