import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const ROUTES_DIR = path.join(ROOT, 'src', 'routes');
const OUTPUT_DIR = path.join(ROOT, 'static', 'og');

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_TITLE_LINES = 3;
const MAX_CHARS_PER_LINE = 28;

const SITE_LABEL = 'blog.gaanesh.com';
const SITE_TAGLINE = 'Security • Systems • Curiosity';

const slugifySegment = (segment) =>
  decodeURIComponent(segment)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

const sanitizeSlug = (slug) =>
  slug
    .split('/')
    .filter(Boolean)
    .map(slugifySegment)
    .join('/');

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const wrapTitle = (text) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return ['Untitled'];
  }

  const lines = [];
  let currentLine = '';
  let index = 0;

  while (index < words.length) {
    const word = words[index];
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= MAX_CHARS_PER_LINE || !currentLine) {
      currentLine = candidate;
      index += 1;
    } else {
      lines.push(currentLine);
      currentLine = '';
      if (lines.length === MAX_TITLE_LINES) {
        break;
      }
    }
  }

  if (currentLine && lines.length < MAX_TITLE_LINES) {
    lines.push(currentLine);
  }

  const usedWords = lines
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const truncated = usedWords < words.length;

  if (truncated && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/\s+$/, '')}…`;
  }

  return lines.slice(0, MAX_TITLE_LINES);
};

const buildSvg = (title) => {
  const lines = wrapTitle(title).map(escapeXml);
  const lineHeight = 70;
  const startY = 260 - ((lines.length - 1) * lineHeight) / 2;

  const titleSpans = lines
    .map((line, index) => `<tspan x="80" y="${startY + index * lineHeight}">${line}</tspan>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1f2937" />
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0.9" />
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect x="50" y="50" width="1100" height="530" rx="40" fill="rgba(15, 23, 42, 0.6)" stroke="url(#accent)" stroke-width="3" />

  <g font-family="'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif">
    <text fill="#f8fafc" font-size="58" font-weight="700" letter-spacing="0.5">
      ${titleSpans}
    </text>

    <text x="80" y="470" fill="#cbd5f5" font-size="28" font-weight="500" letter-spacing="3" text-transform="uppercase">
      ${escapeXml(SITE_TAGLINE)}
    </text>

    <text x="80" y="550" fill="#f8fafc" font-size="34" font-weight="600">
      ${escapeXml(SITE_LABEL)}
    </text>
  </g>
</svg>`;
};

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const findPosts = async () => {
  const entries = await fs.readdir(ROUTES_DIR, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(ROUTES_DIR, entry.name, '+page.svx');
    try {
      const source = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(source);
      if (data?.draft) continue;
      const title = typeof data.title === 'string' ? data.title : entry.name;
      const slug = typeof data.slug === 'string' && data.slug.trim() !== '' ? sanitizeSlug(data.slug.trim()) : sanitizeSlug(entry.name);
      posts.push({ title, slug });
    } catch (error) {
      // Ignore directories without +page.svx files.
    }
  }

  return posts;
};

const generateImage = async ({ title, slug }) => {
  const svg = buildSvg(title);
  const outputPath = path.join(OUTPUT_DIR, `${slug}.jpg`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outputPath);
  return outputPath;
};

const main = async () => {
  await ensureDir(OUTPUT_DIR);
  const posts = await findPosts();
  const defaultPath = await generateImage({ title: "Gaanesh's latest posts", slug: 'default' });
  console.log(`Generated OG image: ${path.relative(ROOT, defaultPath)}`);
  if (posts.length === 0) {
    console.log('No posts found, skipping OG generation.');
    return;
  }

  for (const post of posts) {
    const output = await generateImage(post);
    console.log(`Generated OG image: ${path.relative(ROOT, output)}`);
  }
};

main().catch((error) => {
  console.error('Failed to generate OG images:', error);
  process.exit(1);
});
