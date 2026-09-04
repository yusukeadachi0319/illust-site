# illust-site

個人のイラスト作品を見せる創作サイト。Astro（静的サイト生成）で構築し、Cloudflare Pages にデプロイする。
仕様は [CLAUDE.md](./CLAUDE.md) を参照。

## 開発

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に出力
npm run preview  # ビルド結果を確認
```

Node.js 22 以上が必要。

## ディレクトリ

```
src/
  assets/        画像（works/ items/ key-visual.png）。ビルド時に WebP 変換される
  content/       コンテンツ（Markdown + frontmatter）
    works/       作品
    items/       同人誌・グッズ
    blog/        記事
    events/      イベント参加情報
  content.config.ts  各コレクションのスキーマ
  components/    Header / Footer / WorkGrid
  layouts/       Base.astro（共通レイアウト）
  lib/           日付整形、次回イベント取得
  pages/         各ページ
  styles/        global.css（色・フォント・レイアウトの共通ルール）
public/
  cursor-pencil.png        鉛筆カーソル（32×32 透過PNG、hotspot 2,30）
  cursor-pencil-hover.png  リンク hover 時のカーソル
```

ファイル名（拡張子を除く）がそのまま URL のスラッグになる。
例：`src/content/works/morning-window.md` → `/gallery/morning-window`

---

## 作品の追加手順

1. 画像を `src/assets/works/` に置く（例：`morning-window.png`）。
   JPG / PNG どちらでも可。ビルド時に WebP へ変換され、複数サイズが自動生成される。
2. `src/content/works/` に `.md` ファイルを作る（例：`morning-window.md`）。

```md
---
title: "朝の窓"
date: 2026-08-20
image: ../../assets/works/morning-window.png
tags: [original]
featured: true
description: "夏の終わりの光を描いた習作。"
---
```

| 項目 | 必須 | 内容 |
|---|---|---|
| `title` | ○ | 作品タイトル |
| `date` | ○ | 制作日（`YYYY-MM-DD`）。ギャラリーはこの日付の新しい順に並ぶ |
| `image` | ○ | `src/assets` 配下の画像への相対パス |
| `tags` | ○ | `original` / `fanart` / `doujin` など。複数可 `[original, fanart]` |
| `featured` | ○ | `true` にするとトップの「works」6点に優先して表示される |
| `description` | 任意 | 作品ページに表示する短い説明 |

frontmatter の下に本文（Markdown）を書くと、作品ページのコメントとして表示される。

トップに出る6点は「`featured: true` を優先 → 制作日の新しい順」で自動選出。

## グッズ・同人誌の追加手順

1. 画像を `src/assets/items/` に置く。
2. `src/content/items/` に `.md` ファイルを作る。

```md
---
title: "夜行"
type: doujinshi
price: 1000
image: ../../assets/items/yakou.png
boothUrl: https://booth.pm/ja/items/0000001
status: available
---

B5 / 24p / フルカラーイラスト集。
```

| 項目 | 必須 | 内容 |
|---|---|---|
| `title` | ○ | 商品名 |
| `type` | ○ | `doujinshi` / `sticker` / `keychain` / `other` のいずれか |
| `price` | ○ | 円（数字のみ） |
| `image` | ○ | `src/assets` 配下の画像への相対パス |
| `boothUrl` | ○ | BOOTH の商品ページ URL。クリックでここへ飛ぶ |
| `status` | ○ | `available` / `soldout` / `upcoming` のいずれか |

本文（任意）は shop ページの各アイテム下に表示される。
shop ページは `available` → `upcoming` → `soldout` の順で並ぶ。`soldout` は画像が薄く表示される。

## 記事の追加手順

`src/content/blog/` に `.md` ファイルを作る。画像は不要。

```md
---
title: "サイトを作りました"
date: 2026-08-30
description: "作品置き場としてサイトを開設しました。"
tags: [news]
---

本文をここに Markdown で書く。
```

| 項目 | 必須 | 内容 |
|---|---|---|
| `title` | ○ | 記事タイトル |
| `date` | ○ | 公開日（`YYYY-MM-DD`）。一覧はこの日付の降順 |
| `description` | 任意 | 一覧に表示する一行説明 |
| `tags` | 任意 | 例：`[news, event]` |

記事内に画像を入れる場合は `src/assets/blog/` に置き、本文に `![説明](../../assets/blog/xxx.png)` と書く。

## イベントの追加手順

`src/content/events/` に `.md` ファイルを作る。

```md
---
name: "名古屋コミティア"
date: 2026-11-15
space: "A-12"
url: https://example.com/
---
```

トップの「next event」には、今日以降で最も近い1件が自動で表示される（該当なしなら枠ごと非表示）。
about ページの「events」には全件が日付降順で並ぶので、終わったイベントも消さずに残しておくと活動歴になる。

---

## サイト固有の設定（差し替え箇所）

| ファイル | 内容 |
|---|---|
| `src/layouts/Base.astro` | `siteName`（ロゴ・タブタイトルに使う）。現在 `nakano` |
| `src/components/Footer.astro` | フッターの SNS リンクと © 表記。BOOTH の URL は仮（登録後に差し替える） |
| `src/pages/about.astro` | プロフィール文、SNS リンク（BOOTH の URL は仮） |
| `src/pages/index.astro` | キービジュアル（`src/assets/key-visual.png`） |
| `astro.config.mjs` | 先頭の `SITE_URL`（公開 URL）。独自ドメインに変えるときはここだけ直す。canonical / OGP / sitemap / RSS / robots.txt すべてに反映される |
| `src/lib/site.ts` | `siteName`（サイト名）と `siteDescription`（既定の description）。レイアウト・RSS・OGP 画像で共有 |
| `public/og-default.png` | 共通の OGP 画像（1200×630）。`node scripts/make-og-image.mjs` で再生成できる |
| `public/cursor-pencil.png` | 鉛筆カーソル画像（32×32 透過 PNG、先端が左下 2,30 に来るように描く） |

## meta / OGP / sitemap / RSS

- 各ページの `<title>` と `description`、canonical、OGP、Twitter card は `src/layouts/Base.astro` が出力する。ページ側は `<Base title="..." description="...">` で渡すだけ。
- OGP 画像は共通の `public/og-default.png`。作品ページ（`/gallery/[slug]`）だけはその作品の画像（幅 1200px の JPEG）を使う。
- サイト名を変えたら `node scripts/make-og-image.mjs` で OGP 画像を作り直す（Astro 同梱の sharp を使うので追加インストール不要）。
- sitemap は `@astrojs/sitemap` がビルド時に `/sitemap-index.xml` を生成する。`/robots.txt` にもその URL が入る。
- ブログの RSS は `/rss.xml`（`src/pages/rss.xml.ts`）。各ページの head に `<link rel="alternate">` を出しているので RSS リーダーが自動検出できる。

## ギャラリーのタグフィルタ

`/gallery` 上部のタグをクリックすると絞り込まれ、URL が `/gallery?tag=original` のように変わる（「all」で解除）。
作品の `tags` に書いたものが自動でタグ一覧に出るので、設定は不要。JS はこのページの表示切り替えだけで、ライブラリは使っていない。

## パフォーマンス

Google Fonts の CSS は `preload` → `stylesheet` の切り替えで非同期に読み込んでいる（レンダリングをブロックしない）。
Lighthouse（モバイル）はフェーズ2時点で Performance 97〜100、Accessibility 100、Best Practices 96〜100、SEO 100。

## Cloudflare Pages へのデプロイ

1. このリポジトリを GitHub に push する。
2. Cloudflare ダッシュボード → Workers & Pages → Create → Pages → Connect to Git でリポジトリを選ぶ。
3. ビルド設定：

| 項目 | 値 |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `.node-version` ファイル（22）が自動で使われる |

以降は `main` ブランチへ push するたびに自動デプロイされる。
