// 日付を YYYY.MM.DD 形式で返す（サイト全体で共通）
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// 価格を「1,000 yen」形式で返す
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ja-JP')} yen`;
}
