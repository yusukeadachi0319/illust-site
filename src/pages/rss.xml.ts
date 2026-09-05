import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { rssTitle, rssDescription } from '../lib/site';

// ブログの RSS（/rss.xml）。告知と日記をまとめて日付降順。
export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: rssTitle,
    description: rssDescription,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>ja</language>',
  });
}
