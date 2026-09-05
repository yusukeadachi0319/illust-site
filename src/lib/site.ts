// サイト共通の文言。レイアウト・RSS・OGP 画像生成で共有する。
export const siteName = 'nakano';
export const siteDescription = 'nakano のイラスト作品ギャラリー。同人誌・グッズ、パンダ飼育日記。';

// ブログ（/blog）は「イベント告知」と「パンダ飼育日記」の2段。
// tags に event がある記事が告知、それ以外が日記に入る。
export const blogTitle = 'パンダ飼育日記';
export const blogDescription = '古い車（パンダ）の修理記録と日記。';
// RSS は両方をまとめて配信
export const rssTitle = 'nakano blog';
export const rssDescription = `イベント告知と${blogTitle}。`;
