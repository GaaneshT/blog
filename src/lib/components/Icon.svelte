<script lang="ts">
  // Known icon names — kept inline so we can stay in the instance script.
  // Accept any string; we render nothing if it isn't a known icon name.
  export let name: string;
  export let size: number | string = 16;
  let className: string = '';
  export { className as class };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
>
  {#if name === 'home'}
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z"/>
  {:else if name === 'github'}
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3a4 4 0 0 0-1-3c3 0 6-2 6-6a4.5 4.5 0 0 0-1-3.2 4 4 0 0 0-.1-3S17.2 3 14.5 5a13 13 0 0 0-7 0C4.8 3 3.5 3.3 3.5 3.3a4 4 0 0 0-.1 3A4.5 4.5 0 0 0 2.5 9.5c0 4 3 6 6 6a4 4 0 0 0-1 3v3"/>
  {:else if name === 'linkedin'}
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  {:else if name === 'twitter'}
    <path d="M18 4 13 11l6.5 9H16l-4-5.5L7 20H4l5.5-7.5L3 4h4l3.5 5L14 4Z"/>
  {:else if name === 'wrench'}
    <path d="M14 7a4 4 0 0 1-5 5l-6 6 2 2 6-6a4 4 0 0 1 5-5l-2-2 2-2 2 2-2 2Z"/>
  {:else if name === 'feather'}
    <path d="M20 4 8 16 4 20m12-16a5 5 0 0 1 0 7l-8 8H4v-4l8-8a5 5 0 0 1 7 0Z"/>
    <line x1="14" y1="6" x2="20" y2="12"/>
  {:else if name === 'search'}
    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
  {:else if name === 'terminal'}
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  {:else if name === 'arrow-right'}
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  {:else if name === 'mail'}
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/>
  {:else if name === 'menu'}
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
  {:else if name === 'close'}
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  {:else if name === 'sun'}
    <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
  {:else if name === 'moon'}
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>
  {:else if name === 'external'}
    <path d="M14 4h6v6"/><line x1="20" y1="4" x2="10" y2="14"/><path d="M20 14v6a0 0 0 0 1 0 0h-6m0-16H4v16h6"/>
  {/if}
</svg>
