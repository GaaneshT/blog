// Single source of truth for the post manifest.
// Read by:
//   - /+page.svelte (home grid + featured post)
//   - /posts.json endpoint (consumed cross-site by gaanesh.com)
//   - the ⌘K command palette

const SITE_URL = 'https://blog.gaanesh.com';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  readingTime: number | string | null;
  categories: string[];
  keywords: string[];
  author: string;
  url: string;
  draft: boolean;
};

type Metadata = {
  title?: string;
  excerpt?: string;
  description?: string;
  date?: string;
  readingTime?: number | string | null;
  categories?: unknown;
  keywords?: unknown;
  slug?: string;
  author?: string;
  draft?: boolean;
};

const modules = import.meta.glob('../routes/*/+page.svx', { eager: true }) as Record<
  string,
  { metadata?: Metadata }
>;

export const posts: Post[] = Object.entries(modules)
  .map(([filePath, mod]) => {
    const folder = filePath.split('/').slice(-2, -1)[0] ?? '';
    const m = mod.metadata ?? {};
    const slug = (m.slug && m.slug.trim()) || folder;
    const cats = Array.isArray(m.categories) ? m.categories.map(String) : [];
    const keys = Array.isArray(m.keywords) ? m.keywords.map(String) : [];
    return {
      slug,
      title: m.title ?? 'Untitled',
      excerpt: m.excerpt ?? '',
      description: m.description ?? m.excerpt ?? '',
      date: m.date ?? '',
      readingTime:
        typeof m.readingTime === 'number' || typeof m.readingTime === 'string'
          ? m.readingTime
          : null,
      categories: cats,
      keywords: keys,
      author: typeof m.author === 'string' ? m.author : 'Gaanesh',
      url: `${SITE_URL}/${slug}/`,
      draft: Boolean(m.draft)
    } satisfies Post;
  })
  .filter((p) => !p.draft && p.date)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const featuredPost: Post | null = posts[0] ?? null;
export const postCount = posts.length;

export const formatDate = (iso: string | undefined | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const truncate = (text: string, max = 130): string =>
  text && text.length > max ? text.slice(0, max).trimEnd() + '…' : text ?? '';
