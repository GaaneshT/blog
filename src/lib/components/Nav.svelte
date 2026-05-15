<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { identity } from '$lib/identity';
  import Icon from './Icon.svelte';

  export let onOpenPalette: () => void = () => {};

  let isOpen = false;
  let theme: 'dark' | 'light' = 'dark';
  let mounted = false;

  $: isHome = $page.url.pathname === '/';

  const applyTheme = (t: 'dark' | 'light') => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', t === 'dark');
  };

  const toggle = () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('theme', theme); } catch {}
  };

  onMount(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') theme = saved;
      else theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true ? 'dark' : 'light';
    } catch {}
    applyTheme(theme);
    mounted = true;
  });
</script>

<nav
  class="fixed left-1/2 top-4 z-40 w-[min(96%,1080px)] -translate-x-1/2 border border-ghost-200/60 bg-white/85 px-4 py-2 backdrop-blur-md shadow-lg transition-colors dark:border-ink-600/60 dark:bg-ink-900/70 sm:px-5 {isOpen ? 'rounded-2xl' : 'rounded-full'}"
  aria-label="Primary"
>
  <div class="flex items-center justify-between gap-3">
    <a
      href="/"
      class="group flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-ghost-500 transition-colors hover:text-ink-900 dark:hover:text-white"
    >
      <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ink-900 text-neon-cyan font-bold leading-none ring-1 ring-neon-cyan/30 dark:bg-ink-700">~</span>
      <span class="hidden sm:inline">{identity.handle}@{identity.host}</span>
      <span class="hidden sm:inline text-neon-cyan" style="animation: var(--animate-blink);">▌</span>
    </a>

    <div class="hidden items-center gap-1 md:flex">
      <a
        href="/"
        aria-current={isHome ? 'page' : undefined}
        class="rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ghost-500 transition-colors hover:bg-ghost-100/60 hover:text-ink-900 dark:hover:bg-ink-700/60 dark:hover:text-white {isHome ? 'text-neon-cyan dark:text-neon-cyan' : ''}"
      >
        home
      </a>
      <a
        href="https://gaanesh.com"
        class="rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ghost-500 transition-colors hover:bg-ghost-100/60 hover:text-ink-900 dark:hover:bg-ink-700/60 dark:hover:text-white"
      >
        portfolio ↗
      </a>
    </div>

    <div class="flex items-center gap-1.5">
      <button
        on:click={onOpenPalette}
        class="hidden sm:inline-flex items-center gap-2 rounded-full border border-ghost-200/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-ghost-500 shadow-sm transition hover:border-neon-cyan/40 hover:text-ink-900 dark:border-ink-600/70 dark:bg-ink-800/70 dark:hover:text-white"
        aria-label="Open command palette"
      >
        <Icon name="search" size={12} />
        <span class="hidden lg:inline">Search</span>
        <span class="kbd">⌘K</span>
      </button>

      <button
        on:click={toggle}
        class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ghost-200/70 bg-white/80 text-ghost-500 transition hover:text-ink-900 dark:border-ink-600/70 dark:bg-ink-800/70 dark:hover:text-white"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {#if mounted}<Icon name={theme === 'dark' ? 'moon' : 'sun'} />{/if}
      </button>

      <button
        on:click={() => (isOpen = !isOpen)}
        class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ghost-200/70 bg-white/80 text-ghost-500 transition hover:text-ink-900 dark:border-ink-600/70 dark:bg-ink-800/70 dark:hover:text-white md:hidden"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <Icon name={isOpen ? 'close' : 'menu'} />
      </button>
    </div>
  </div>

  {#if isOpen}
    <div class="mt-3 flex flex-col gap-1 md:hidden">
      <a href="/" on:click={() => (isOpen = false)} class="rounded-lg px-3 py-2 font-mono text-sm text-ghost-500 transition hover:bg-ghost-100/60 hover:text-ink-900 dark:hover:bg-ink-700/60 dark:hover:text-white">~/<span class="text-neon-cyan">home</span></a>
      <a href="https://gaanesh.com" class="rounded-lg px-3 py-2 font-mono text-sm text-ghost-500 transition hover:bg-ghost-100/60 hover:text-ink-900 dark:hover:bg-ink-700/60 dark:hover:text-white">~/<span class="text-neon-cyan">portfolio</span> ↗</a>
    </div>
  {/if}
</nav>
