import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 作品（1作品 = 1つの .md）
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(), // 制作日
      image: image(), // src/assets 配下の画像
      tags: z.array(z.string()).default([]), // 例: [original, fanart, doujin]
      featured: z.boolean().default(false), // true ならトップに出す候補
      description: z.string().optional(),
    }),
});

// グッズ・同人誌（1点 = 1つの .md）
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(['doujinshi', 'sticker', 'keychain', 'other']),
      price: z.number(), // 円
      image: image(),
      boothUrl: z.string().url(), // BOOTH の商品ページ URL
      status: z.enum(['available', 'soldout', 'upcoming']),
    }),
});

// ブログ記事
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// イベント参加情報（トップの next event に使う）
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    name: z.string(), // 例: 名古屋コミティア
    date: z.coerce.date(),
    space: z.string().optional(), // スペース番号
    url: z.string().url().optional(),
  }),
});

export const collections = { works, items, blog, events };
