# 🐛 バグ修正レポート

## 報告日時
2024-12-24

## 発見された問題

### 問題1: リアルタイム金額計算が動作しない ❌
**症状:**
- 請求内容入力画面で単価を入力しても、金額計算項目が0のまま
- 確認・生成画面でも金額が0のまま表示
- PDF生成時点でのみ金額が正しく表示される

**原因:**
1. `useInvoiceCalculation` フックの `useRealTimeCalculation` 関数内で、依存配列に `calculate` 関数が含まれていたため、毎回新しい関数参照が作成され、`useMemo` のメモ化が機能していなかった
2. `handleItemChange` 関数が呼ばれても、フォームの値が正しく更新されていなかった
3. フォームの `watch` による監視が不十分で、値の変更が即座に反映されていなかった

**修正内容:**
- ✅ `useRealTimeCalculation` 内で `calculate` 関数の代わりに `calculateInvoice` を直接呼び出すように変更
- ✅ `handleItemChange` 関数で数値型への変換を明示的に実行
- ✅ `useEffect` を追加して、`watchItems` の変更を監視し、自動的に金額を計算・更新するように改善
- ✅ `setValue` 呼び出し時に `shouldValidate` オプションを適切に設定

**修正ファイル:**
- `/hooks/useInvoiceCalculation.ts`
- `/components/invoice/InvoiceForm.tsx`

---

### 問題2: PDF内の文字がすべて文字化け ❌
**症状:**
- 生成されたPDFファイル内のすべてのテキストが文字化け
- 日本語が正しく表示されない

**原因:**
- `jsPDF` のデフォルトフォント（Helvetica）は日本語をサポートしていない
- カスタム日本語フォント（Noto Sans JP）が実装されていなかった
- Base64エンコードされた日本語フォントデータが用意されていなかった

**修正内容:**
- ✅ PDF生成方式を `jsPDF` のテキスト描画から `HTML2Canvas` + `jsPDF` のハイブリッド方式に変更
- ✅ HTMLテンプレートを生成し、Google Fonts から Noto Sans JP フォントを読み込むように実装
- ✅ `html2canvas` ライブラリを導入して、HTMLをCanvasに変換してからPDF化
- ✅ 新しい `PDFService-v2.ts` を作成し、完全な日本語対応を実現

**修正ファイル:**
- `/services/PDFService.ts` (完全書き換え)
- `/components/invoice/PDFPreview.tsx` (新PDFServiceに対応)
- `/lib/fonts.ts` (新規作成、フォント読み込みヘルパー)
- `package.json` (html2canvas 依存関係追加)

**新しいPDF生成フロー:**
1. 請求書データから HTMLテンプレートを生成（Noto Sans JP フォント使用）
2. HTMLをブラウザでレンダリング
3. `html2canvas` でHTMLをCanvasに変換
4. CanvasをPNGイメージとして `jsPDF` に埋め込み
5. PDF Blobを生成して返す

---

## 修正後の動作確認ポイント ✅

### テスト1: リアルタイム金額計算
1. `/invoice/create` ページにアクセス
2. Step 2で請求項目の「単価」を入力（例: 30000）
3. **期待結果:** 即座に「金額」フィールドが更新される（例: 30000）
4. **期待結果:** 下部の「💰 金額計算」エリアに小計・消費税・源泉徴収税・最終請求額が即座に表示される

### テスト2: 複数項目の計算
1. 「➕ 項目を追加」をクリックして複数の請求項目を追加
2. それぞれの数量と単価を入力
3. **期待結果:** 各項目の金額が自動計算される
4. **期待結果:** 合計金額が正しく計算される

### テスト3: 源泉徴収税の切り替え
1. 「源泉徴収税を適用する」のチェックボックスをON/OFF
2. **期待結果:** 金額計算がリアルタイムで更新される
3. 「消費税込みで計算（原則）」と「消費税を区分して計算（例外）」を切り替え
4. **期待結果:** 源泉徴収税の金額が変更される

### テスト4: PDF生成と日本語表示
1. Step 3の確認画面で「🎉 請求書を生成」をクリック
2. PDFプレビューが表示される
3. **期待結果:** すべての日本語テキストが正しく表示される
4. 「PDFダウンロード」をクリック
5. ダウンロードしたPDFをAdobe Readerなどで開く
6. **期待結果:** 日本語が文字化けせずに表示される

---

## 追加の改善点 🎯

### パフォーマンス最適化
- `useEffect` による自動計算で、不要な再計算を防ぐため、金額が変更された場合のみ `setValue` を実行
- `useMemo` を使用して計算結果をキャッシュ

### エラーハンドリング
- PDF生成失敗時のエラーメッセージ表示
- 数値変換エラーの防止（`Number()` による明示的な変換）

### ユーザー体験
- HTML プレビューとPDFプレビューの両方を提供
- 「プレビュー生成」ボタンで事前確認可能
- ダウンロード時のファイル名を「請求書_番号_クライアント名_日付.pdf」に自動生成

---

## 技術的な詳細

### 使用ライブラリ
- `jsPDF`: ^2.5.2 (PDF生成の基盤)
- `jspdf-autotable`: ^3.8.4 (テーブル生成、今回は未使用)
- `html2canvas`: ^1.4.1 (HTML→Canvas変換、新規追加)
- `react-hook-form`: ^7.54.2 (フォーム管理)
- `zod`: ^3.24.1 (バリデーション)

### アーキテクチャ変更
- **Before:** jsPDF の text() メソッドで直接テキスト描画 → 日本語非対応
- **After:** HTML + CSS でレイアウト → html2canvas でキャプチャ → jsPDF で画像として埋め込み → 日本語完全対応

### フォント対応
- Google Fonts CDN から Noto Sans JP を動的読み込み
- ブラウザのフォントレンダリングを活用
- 追加のフォントファイルのバンドル不要

---

## 次回開発時の注意点 ⚠️

1. **計算ロジックの変更時:**
   - `utils/calculations.ts` の `calculateInvoice` 関数を修正
   - `useInvoiceCalculation` フックの依存配列を確認
   - テストケースで各計算パターンを検証

2. **PDF生成の変更時:**
   - HTMLテンプレートのスタイルは `PDFService.generateInvoiceHTML` 内で定義
   - レスポンシブ対応の必要はない（A4固定サイズ）
   - フォントサイズは印刷時の可読性を考慮

3. **フォームの追加項目:**
   - `CreateInvoiceSchema` (Zod) にバリデーションルールを追加
   - `InvoiceForm` の `useEffect` で自動計算が必要か検討
   - `watch` による監視対象に追加

---

## 修正版の配布

### AI Drive 保存場所
`/invoice-creator-project/invoice-creator-pro-fixed.tar.gz`

### ダウンロード手順
```bash
# 1. ダウンロードして展開
tar -xzf invoice-creator-pro-fixed.tar.gz
cd invoice-creator-pro

# 2. 依存関係をインストール
npm install

# 3. 開発サーバー起動
npm run dev

# 4. ブラウザで確認
# http://localhost:3000
```

### 変更されたファイル一覧
```
修正:
- hooks/useInvoiceCalculation.ts
- components/invoice/InvoiceForm.tsx
- components/invoice/PDFPreview.tsx

新規作成:
- lib/fonts.ts
- services/PDFService.ts (完全書き換え)

バックアップ:
- services/PDFService-old.ts (旧バージョン保持)

依存関係:
- package.json (html2canvas 追加)
```

---

## テスト結果 ✅

### ローカル環境テスト
- [x] リアルタイム金額計算: **正常動作**
- [x] 複数項目の追加・削除: **正常動作**
- [x] 源泉徴収税の切り替え: **正常動作**
- [x] PDF生成: **正常動作**
- [x] 日本語表示: **文字化けなし**
- [x] PDFダウンロード: **正常動作**

### ブラウザ互換性
- Chrome: ✅ 動作確認済み
- Firefox: ⚠️ 未確認（html2canvas は対応済み）
- Safari: ⚠️ 未確認（html2canvas は対応済み）
- Edge: ⚠️ 未確認（Chromiumベースなので問題なし想定）

---

## まとめ

2つの重大なバグを修正し、以下を達成しました:

1. ✅ **リアルタイム金額計算の実装**
   - 入力と同時に金額が更新される
   - ユーザー体験が大幅に向上

2. ✅ **日本語対応PDF生成の実現**
   - すべての日本語テキストが正しく表示
   - 高品質なPDF出力

3. ✅ **コードの保守性向上**
   - 明確なエラーハンドリング
   - パフォーマンス最適化

これで「クリエイター請求書さくっと」は実用レベルに到達しました！🎉

---

**修正日:** 2024-12-24  
**修正者:** AI Assistant  
**バージョン:** v1.0.1 (Fixed)
