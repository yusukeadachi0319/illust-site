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
  assets/        画像（works/ items/）。ビルド時に WebP 変換される
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

トップの「recent works」には `featured: true` の作品だけが、制作日の新しい順に最大6点並ぶ（同じ日付ならファイル名順）。
ファイル名は URL になるので英数字とハイフンにする（例：`cat-summer.png`、`cat-summer.md`）。

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
| `image` | 任意 | `src/assets` 配下の画像への相対パス。書かなければ薄青の枠だけ表示（現物が届く前など） |
| `boothUrl` | ○ | BOOTH の商品ページ URL。クリックでここへ飛ぶ |
| `status` | ○ | `available` / `soldout` / `upcoming` のいずれか |

本文（任意）は shop ページの各アイテム下に表示される。
shop ページは `available` → `upcoming` → `soldout` の順で並ぶ。`soldout` は画像が薄く表示される。

## 記事の追加手順

`/blog` は上段「イベント告知」、下段「パンダ飼育日記」の2段構成。`tags` に `event` を入れた記事が上段、それ以外は下段に入る。
各段は新しい記事3件だけ表示し、それより古いものは「more」を開くと出る（件数は `src/pages/blog/index.astro` の `VISIBLE`）。
日記の名前と説明は `src/lib/site.ts` の `blogTitle` / `blogDescription` で変えられる。

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
| `tags` | 任意 | 例：`[car]`（車修理）、`[diary]`（日記）、`[event]`（イベント告知）、`[news]` |

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
| `src/pages/index.astro` | キービジュアル（先頭の `import keyVisual` の画像パス。現在 `works/cat-summer.png`） |
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

## Cloudflare Workers へのデプロイ

Cloudflare ダッシュボードの Workers & Pages で GitHub リポジトリを連携済み。`main` へ push するたびに自動デプロイされる。

| 項目 | 値 |
|---|---|
| Build command | `npm run build`（`npx astro build` でも同じ） |
| Deploy command | `npx wrangler deploy` |
| 配信ディレクトリ | `dist`（`wrangler.jsonc` の `assets.directory`） |
| Node.js version | `.node-version`（24） |

`wrangler.jsonc` は必ずリポジトリに置いておく。これが無いと wrangler の自動設定（autoconfig）が
`@astrojs/cloudflare` アダプターを勝手に追加し、画像が実行時変換の URL（`/_image?...`）になって
静的配信では 404 になる（2026-09-05 に実際に起きた）。このサイトは完全に静的なのでアダプターは不要。

`sharp`（画像変換）は Astro の任意依存だが、ビルド環境で確実に入るよう `package.json` に明示している。
