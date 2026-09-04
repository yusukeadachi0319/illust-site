# 創作サイト構築指示書（Claude Code用）

このファイルをリポジトリ直下に `CLAUDE.md` として置き、最初の指示は
「CLAUDE.md の仕様どおりにサイトの雛形を作ってください。まずフェーズ1のみ。」で始める。

---

## 1. 概要

- 個人のイラスト作品を見せる創作サイト。
- 用途：作品ギャラリー／同人誌・グッズ紹介（BOOTHへ誘導）／プロフィール・SNSリンク／ブログ。
- 雰囲気：白背景に青文字、装飾ゼロ、タイポグラフィと余白で見せるミニマル。
  参考にするサイトの方向性：Dover Street Market Ginza、PALACE Skateboards。
- 画像（イラスト）が主役。UIは一切主張しない。

## 2. 技術スタック

- フレームワーク：Astro（最新安定版）。静的サイト生成（SSG）。
- スタイル：素のCSS（グローバル1ファイル＋コンポーネント内scoped）。TailwindやUIライブラリは使わない。
- 画像：Astro の `<Image />` / `<Picture />` で WebP 変換・遅延読み込み。
- コンテンツ：Astro Content Collections（Markdown + frontmatter）。CMS・DBは使わない。
- デプロイ：Cloudflare Pages。GitHub push で自動デプロイ。
- パッケージマネージャ：npm。
- 依存は最小限。フェーズ2以前にライブラリを追加しない。

## 3. ページ構成

| パス | 内容 |
|---|---|
| `/` | トップ。キービジュアル1点 → 最新作6点グリッド → shop / next event の2カラム → フッター |
| `/gallery` | 全作品のグリッド。タグでフィルタ（original / fanart / doujin など）。クリックで `/gallery/[slug]` |
| `/gallery/[slug]` | 作品単体ページ。大きな画像、タイトル、制作年、タグ、コメント（任意） |
| `/shop` | 同人誌・グッズ一覧。各アイテムはBOOTHの商品ページへ外部リンク。カート機能は持たない |
| `/blog` | 記事一覧（日付降順） |
| `/blog/[slug]` | 記事ページ |
| `/about` | プロフィール、活動歴（イベント参加など）、SNSリンク、連絡先 |
| `/404` | 存在しないページ。最小限のテキストとトップへのリンク |

共通レイアウト：ヘッダー（左にロゴ、右に nav: gallery / shop / blog / about）、フッター（SNSリンク、©表記）。

## 4. コンテンツの持ち方（Content Collections）

```
src/content/
  works/     作品。1作品 = 1つの .md
  items/     グッズ・同人誌。1点 = 1つの .md
  blog/      記事
  events/    イベント参加情報（トップの next event に使う）
```

### works のスキーマ
```yaml
title: string
date: date            # 制作日
image: image()        # src/assets 配下の画像
tags: string[]        # 例: [original, fanart, doujin]
featured: boolean     # true ならトップに出す候補
description: string?  # 任意
```

### items のスキーマ
```yaml
title: string
type: enum [doujinshi, sticker, keychain, other]
price: number         # 円
image: image()
boothUrl: string      # BOOTHの商品ページURL
status: enum [available, soldout, upcoming]
```

### blog のスキーマ
```yaml
title: string
date: date
description: string?
tags: string[]?
```

### events のスキーマ
```yaml
name: string          # 例: 名古屋コミティア
date: date
space: string?        # スペース番号
url: string?
```

トップの「next event」は events のうち今日以降で最も近いものを自動で表示。該当なしなら枠ごと非表示。

## 5. デザインルール

### 色（この3色以外は使わない）
- 背景：`#FFFFFF`
- 本文・罫線：`#185FA5`（中間の青）
- 見出し・ロゴ・強調：`#0C447C`（濃い青）
- 画像プレースホルダやhover背景に薄い青 `#E6F1FB` を使ってよい。

### フォント
- 欧文・数字：等幅フォント。Google Fonts の `Space Mono`（代替：`JetBrains Mono`）。
- 和文：`Noto Sans JP` weight 300〜400。
- 基本サイズ 12〜13px、`letter-spacing: 0.08em`。見出しも大きくしすぎない（最大 15〜16px）。
- ナビやラベルは小文字英語（gallery, shop, blog, about）。

### レイアウト
- 最大幅 1100px、中央寄せ。左右パディング 24px（モバイル 16px）。
- セクションの区切りは `border-top: 1px solid #185FA5` のみ。角丸・影・枠カードは使わない。
- 余白は大きめ。セクション間 40〜60px。
- グリッド：PC 3列、タブレット 2列、スマホ 1〜2列。画像は正方形トリミングでなく元の比率を尊重（object-fit: contain または aspect-ratio を作品ごとに）。
- hover：リンクは下線が出る程度。画像は薄い青のオーバーレイか opacity 変化のみ。アニメーションは 150ms 以内。

### カーソル（PCのみ）
- `public/cursor-pencil.png`（32×32px、透過PNG、鉛筆の絵は後で差し替える）を用意し、
  `body { cursor: url('/cursor-pencil.png') 2 30, auto; }` を適用。
- リンク hover 時は `cursor: url('/cursor-pencil-hover.png') 2 30, pointer;` に切り替え（画像は同じでも可）。
- 画像が未用意の間は仮の簡易PNGを生成して置く。

## 6. 隠し要素（フェーズ3で実装。フェーズ1では作らない）

- ヘッダーのロゴを5回連続クリック（1.5秒以内）でミニゲームのオーバーレイが開く。
- ゲームは Canvas + 素のJS で実装。内容は後で決める（候補：鉛筆カーソルで線を描く落書きモード、または短いアクションゲーム）。
- 閉じるボタンとEscキーで閉じる。
- フェーズ1の段階では、ロゴのクリックカウントだけ実装し、5回目に `console.log('easter egg')` を出すところまでで止める。

## 7. フェーズ分け

### フェーズ1（最初にやる）
1. Astro プロジェクト作成、ディレクトリ構成、Content Collections のスキーマ定義。
2. 共通レイアウト（ヘッダー・フッター・グローバルCSS・フォント読み込み・カーソル）。
3. 全ページの雛形。各コレクションにダミーデータを2〜3件入れて表示確認。
4. `README.md` に「作品の追加手順」「グッズの追加手順」「記事の追加手順」を書く。
5. Cloudflare Pages 用の設定（ビルドコマンド `npm run build`、出力 `dist`）。

### フェーズ2
- ギャラリーのタグフィルタ（JS最小限、URLクエリ連動）。
- OGP画像、meta、sitemap、RSS（ブログ用）。
- 画像の最適化確認、Lighthouse でパフォーマンス 90 以上。

### フェーズ3
- ロゴ5回クリックのミニゲーム。
- 必要ならページ遷移の軽い演出。

## 8. やらないこと

- ダークモード対応（白背景固定）。
- ログイン、コメント、いいね等の動的機能。
- 外部の解析タグやSNS埋め込みウィジェット（リンクのみ）。
- 指示にないライブラリの追加。

## 9. 作業の進め方

- 各フェーズの前に、変更するファイル一覧を先に提示してから着手する。
- 迷った場合は「より装飾が少ない方」を選ぶ。
- ダミー画像は単色の薄い青（#E6F1FB）のPNGを生成して使う。
