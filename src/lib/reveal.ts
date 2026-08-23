// Fades an element in when it scrolls into view, then stops observing it.
//
// The hidden state is set here in JS rather than in the stylesheet. Svelte
// actions never run during SSR, so the prerendered HTML ships fully visible
// and readers with JavaScript off still see everything.

const DURATION = 700;
const EASING = 'cubic-bezier(.2,.7,.2,1)';

let observer: IntersectionObserver | null = null;

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const node = entry.target as HTMLElement;
        node.style.opacity = '1';
        node.style.transform = 'none';
        observer?.unobserve(node);
      }
    },
    { threshold: 0.08 }
  );
}

export function reveal(node: HTMLElement, delay = 0) {
  if (typeof window === 'undefined') return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduced) return;

  node.style.opacity = '0';
  node.style.transform = 'translateY(16px)';
  node.style.transitionProperty = 'opacity, transform';
  node.style.transitionDuration = `${DURATION}ms`;
  node.style.transitionTimingFunction = EASING;
  if (delay) node.style.transitionDelay = `${delay}ms`;

  ensureObserver();
  observer?.observe(node);

  return {
    destroy() {
      observer?.unobserve(node);
    }
  };
}
