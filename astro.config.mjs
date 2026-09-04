// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 公開 URL。独自ドメインに変えるときはこの1行だけ直す。
// （canonical / OGP / sitemap / RSS / robots.txt はすべてここから生成される）
const SITE_URL = 'https://illust-site.lazysundayclub.workers.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  outDir: './dist',
  integrations: [sitemap()],
});
