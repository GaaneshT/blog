<script lang="ts">
  import { socialLinks, identity } from '$lib/identity';
  import Icon from './Icon.svelte';

  const year = new Date().getFullYear();
</script>

<footer class="mx-auto mt-16 w-full max-w-3xl px-4 pb-16 sm:px-6">
  <div class="rounded-3xl border border-ghost-200/70 bg-white/85 p-6 shadow-xl backdrop-blur-xl dark:border-ink-600/60 dark:bg-ink-900/70 sm:p-8">
    <div class="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">// thanks for reading</p>
        <p class="mt-3 max-w-md text-pretty text-sm text-ink-700 dark:text-ghost-300">
          Find me elsewhere — or head back to the portfolio for the full story.
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          {#each socialLinks as s}
            <a
              href={s.url}
              target={s.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              class="inline-flex h-9 items-center gap-1.5 rounded-full border border-ghost-200/70 bg-white/90 px-3 text-ghost-500 transition hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:text-ink-900 dark:border-ink-600/60 dark:bg-ink-800/70 dark:hover:text-white"
            >
              <Icon name={s.icon} size={14} />
              <span class="font-mono text-[11px] uppercase tracking-[0.15em]">{s.label}</span>
            </a>
          {/each}
        </div>
      </div>

      <div class="rounded-xl border border-ghost-200/60 bg-ghost-50/80 p-4 font-mono text-[11px] text-ghost-500 dark:border-ink-600/60 dark:bg-ink-950/70 dark:text-ghost-400">
        <p><span class="text-neon-green">{identity.handle}</span><span class="text-ghost-400">@</span><span class="text-neon-violet">{identity.host}</span><span class="text-ghost-400">:~$</span> <span class="text-ink-900 dark:text-ghost-100">echo "© {year}"</span></p>
        <p class="mt-1">© {year} {identity.name}. Built with SvelteKit + mdsvex. <span class="text-neon-cyan">▌</span></p>
      </div>
    </div>
  </div>
</footer>
