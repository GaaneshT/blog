// Shared identity / external link tokens.
// Keep loosely in sync with the portfolio's content.ts.

export const identity = {
  name: 'Gaanesh Theivasigamani',
  shortName: 'Gaanesh',
  handle: 'gaanesh',
  host: 'blog',
  tagline: 'Thinkspace — security, systems, and the occasional reflection.',
  location: 'Singapore',
  email: 'gaaneshtheivasigamani@gmail.com'
};

export type Social = { label: string; icon: string; url: string };

// Note: no FontAwesome here; we use inline SVGs in the components to keep the blog light.
export const socialLinks: Social[] = [
  { label: 'Portfolio', icon: 'home',     url: 'https://gaanesh.com' },
  { label: 'GitHub',    icon: 'github',   url: 'https://github.com/GaaneshT' },
  { label: 'LinkedIn',  icon: 'linkedin', url: 'https://www.linkedin.com/in/gaanesht/' },
  { label: 'X',         icon: 'twitter',  url: 'https://x.com/PlantSecurity' },
  { label: 'Tools',     icon: 'wrench',   url: 'https://tools.gaanesh.com' }
];
