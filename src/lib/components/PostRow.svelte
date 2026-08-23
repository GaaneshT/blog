<script lang="ts">
  import { formatDate, type Post } from '$lib/posts';

  export let post: Post;
</script>

<a class="post" href={`/${post.slug}/`} data-sveltekit-preload-data>
  <span class="d">{formatDate(post.date)}</span>
  <span class="t">
    {post.title}
    {#if post.excerpt}<em>{post.excerpt}</em>{/if}
    {#if post.categories.length}
      <span class="tagrow">
        {#each post.categories as category}
          <span>{category}</span>
        {/each}
      </span>
    {/if}
  </span>
  {#if post.readingTime}<span class="r">{post.readingTime} min</span>{/if}
</a>
