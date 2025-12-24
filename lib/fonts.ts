/**
 * Noto Sans JP フォントのBase64データ
 * PDF生成用の日本語フォント
 */

// 注: 完全なフォントファイルは大きすぎるため、
// ここではサブセット版のBase64データを使用します

export const NOTO_SANS_JP_BASE64 = `data:font/truetype;charset=utf-8;base64,AAEAAAASAQAABAAgRFNJRwAAAAEAASwAAAAACkdERUYA
...`; // 実際には完全なBase64データが必要

// フォント読み込みヘルパー
export async function loadNotoSansJP(): Promise<string> {
  // ブラウザ環境でのみ実行
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    // Google Fonts APIから直接読み込む
    const response = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'
    );
    const css = await response.text();
    
    // URLからフォントファイルを取得
    const fontUrlMatch = css.match(/url\((https:\/\/[^)]+)\)/);
    if (!fontUrlMatch) {
      throw new Error('Font URL not found');
    }

    const fontUrl = fontUrlMatch[1];
    const fontResponse = await fetch(fontUrl);
    const fontBlob = await fontResponse.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(fontBlob);
    });
  } catch (error) {
    console.error('Failed to load Noto Sans JP font:', error);
    return '';
  }
}
