// 共通 OGP 画像（public/og-default.png、1200×630）を生成する。
// 白地に青文字でサイト名を載せるだけ。Astro 同梱の sharp を使うので追加ライブラリは不要。
// フォントは OS にある等幅フォント（Courier New）。Space Mono は sharp から使えないため。
//
//   node scripts/make-og-image.mjs
//
// サイト名を変えたら再実行する。
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { siteName } from '../src/lib/site.ts';

const outFile = fileURLToPath(new URL('../public/og-default.png', import.meta.url));

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <text x="${W / 2}" y="${H / 2}" dominant-baseline="central" text-anchor="middle"
        font-family="Courier New, monospace" font-size="72" letter-spacing="10"
        fill="#0C447C">${siteName}</text>
  <rect x="${W / 2 - 160}" y="${H / 2 + 72}" width="320" height="1" fill="#185FA5"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
console.log('wrote public/og-default.png');
