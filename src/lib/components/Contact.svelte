<script lang="ts">
  import { identity } from '$lib/identity';
  import { reveal } from '$lib/reveal';

  export let line = 'Happy to chat about anything here, or about security in general.';
  export let backHref = '/';
  export let backLabel = 'Back to start';
</script>

<section class="end">
  <p class="q" use:reveal>Want to <span class="hl">talk?</span></p>
  <p use:reveal>{line}</p>
  <a class="mail" href="mailto:{identity.email}" use:reveal>{identity.email}</a>
  <div>
    <a class="back" href={backHref}><span aria-hidden="true">&larr;</span> {backLabel}</a>
  </div>
</section>
