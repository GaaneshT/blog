// Prerendered JSON manifest of all published posts.
// Consumed by gaanesh.com (the portfolio) to render its "Latest writing" section.
//
// Output URL: https://blog.gaanesh.com/posts.json
//
// The actual post list comes from src/lib/posts.ts so home page, command
// palette, and this endpoint always agree.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { posts } from '$lib/posts';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const payload = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    categories: p.categories,
    url: p.url
  }));

  return json(
    { posts: payload, generatedAt: new Date().toISOString() },
    { headers: { 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=300' } }
  );
};
