// Shared identity / external link tokens.
// Keep loosely in sync with the portfolio's content.ts.

const PORTFOLIO = 'https://gaanesh.com';

export const identity = {
  name: 'Gaanesh Theivasigamani',
  shortName: 'Gaanesh',
  location: 'Singapore',
  email: 'gaanesh@u.nus.edu',
  portfolio: PORTFOLIO,
  tagline:
    "Notes on the work, the grind, and what I've figured out along the way. Mostly honest, occasionally useful."
};

export const links = {
  portfolio: PORTFOLIO,
  github: 'https://github.com/GaaneshT',
  linkedin: 'https://www.linkedin.com/in/gaanesht/',
  twitter: 'https://x.com/PlantSecurity',
  blog: 'https://blog.gaanesh.com',
  tools: 'https://tools.gaanesh.com',
  properties: 'https://properties.gaanesh.com'
};

export type Link = { label: string; url: string; external?: boolean; here?: boolean };

export const navLinks: Link[] = [
  { label: 'Work', url: `${PORTFOLIO}/#selected`, external: true },
  { label: 'Projects', url: `${PORTFOLIO}/#projects`, external: true },
  { label: 'Tools', url: links.tools, external: true },
  { label: 'Writing', url: '/', here: true },
  { label: 'Contact', url: `${PORTFOLIO}/#contact`, external: true }
];

export const footerLinks: Link[] = [
  { label: 'GitHub', url: links.github },
  { label: 'LinkedIn', url: links.linkedin },
  { label: 'Twitter', url: links.twitter },
  { label: 'Portfolio', url: links.portfolio },
  { label: 'Tools', url: links.tools },
  { label: 'Properties', url: links.properties }
];

export const copy = {
  footer: `© ${new Date().getFullYear()} ${identity.name} · ${identity.location}`
};
