<script lang="ts">
  export let path: string;
  export let command: string | null = null;
  export let user: string = 'gaanesh';
  export let host: string = 'blog';
</script>

<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
  <h2 class="prompt-heading">
    <span class="user">{user}</span><span class="at">@</span><span class="host">{host}</span>
    <span class="text-ghost-400 dark:text-ghost-500"> ~/</span><span class="path">{path}</span>
    <span class="sign"> $</span>
    {#if command}<span class="cmd">{command}</span>{/if}
  </h2>
  {#if $$slots.default}
    <div class="text-xs font-mono text-ghost-400 dark:text-ghost-500"><slot /></div>
  {/if}
</div>
