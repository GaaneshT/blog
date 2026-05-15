// Scroll-reveal action (same shape as the portfolio's).

export type RevealOptions = {
  delay?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
};

type RevealState = { options: Required<RevealOptions>; baseTransform: string };

const defaults: Required<RevealOptions> = { delay: 0, distance: 24, threshold: 0.12, once: true };

let observer: IntersectionObserver | null = null;
const map = new Map<Element, RevealState>();
const timers = new Map<Element, number>();

function ensureObserver() {
  if (observer || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const node = entry.target as HTMLElement;
        const state = map.get(node);
        if (!state) continue;
        const { options, baseTransform } = state;
        const prefix = baseTransform ? `${baseTransform} ` : '';

        if (entry.isIntersecting && entry.intersectionRatio >= options.threshold) {
          requestAnimationFrame(() => {
            node.style.opacity = '1';
            node.style.transform = `${prefix}translateY(0)`;
          });
          const old = timers.get(node);
          if (old) window.clearTimeout(old);
          const t = window.setTimeout(() => {
            node.style.removeProperty('transition-property');
            node.style.removeProperty('transition-duration');
            node.style.removeProperty('transition-timing-function');
            node.style.removeProperty('transition-delay');
            if (options.once) {
              node.style.removeProperty('opacity');
              node.style.removeProperty('transform');
            }
            timers.delete(node);
          }, 720 + options.delay);
          timers.set(node, t);
          if (options.once) {
            observer?.unobserve(node);
            map.delete(node);
          }
        } else if (!options.once) {
          node.style.opacity = '0';
          node.style.transform = `${prefix}translateY(${options.distance}px)`;
        }
      }
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
  );
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  if (typeof window === 'undefined') return;
  const opts: Required<RevealOptions> = { ...defaults, ...options };
  const computed = window.getComputedStyle(node).transform;
  const baseTransform = computed === 'none' ? '' : computed;
  const prefix = baseTransform ? `${baseTransform} ` : '';

  node.style.opacity = '0';
  node.style.transform = `${prefix}translateY(${opts.distance}px)`;
  node.style.transitionProperty = 'opacity, transform';
  node.style.transitionDuration = '600ms';
  node.style.transitionTimingFunction = 'cubic-bezier(0.25, 0.15, 0.25, 1)';
  node.style.transitionDelay = `${opts.delay}ms`;

  map.set(node, { options: opts, baseTransform });
  ensureObserver();
  observer?.observe(node);

  return {
    destroy() {
      const t = timers.get(node);
      if (t) window.clearTimeout(t);
      timers.delete(node);
      observer?.unobserve(node);
      map.delete(node);
      node.style.removeProperty('opacity');
      node.style.removeProperty('transform');
      node.style.removeProperty('transition-property');
      node.style.removeProperty('transition-duration');
      node.style.removeProperty('transition-timing-function');
      node.style.removeProperty('transition-delay');
    }
  };
}
