// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 本番URLが決まったら差し替える（フェーズ2の sitemap / OGP / RSS で使う）
  site: 'https://example.pages.dev',
  output: 'static',
  outDir: './dist',
});
