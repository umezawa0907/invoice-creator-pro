# 請求書さくっと

会員登録不要で請求書を無料で作れるWebアプリケーション

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 特徴

- **3ステップで簡単作成**: 発行者情報 → 請求内容 → 確認・生成
- **自動計算**: 源泉徴収税10.21%と消費税10%を自動計算（国税庁準拠）
- **完全無料**: 会員登録不要、完全無料で利用可能
- **プライバシー保護**: 個人情報はブラウザにのみ暗号化保存、サーバー送信なし
- **適格請求書対応**: インボイス制度に完全対応
- **バックアップ機能**: データのエクスポート・インポートが可能
- **レスポンシブ対応**: PC・タブレット・スマホで利用可能

## 🚀 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **PDF Generation**: jsPDF + html2canvas
- **Storage**: Browser LocalStorage (暗号化)

## 📦 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで開く
# http://localhost:3000
```

## 🏗️ ビルド

```bash
# プロダクションビルド
npm run build

# ビルドの確認
npm start
```

## 📂 プロジェクト構造

```
invoice-creator-pro/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── globals.css        # グローバルスタイル
│   ├── profile/           # プロフィール管理
│   └── invoice/           # 請求書作成
├── components/            # Reactコンポーネント
│   ├── ui/               # 共通UIコンポーネント
│   ├── profile/          # プロフィール関連
│   └── invoice/          # 請求書関連
├── services/             # ビジネスロジック
│   ├── StorageService.ts
│   ├── EncryptionService.ts
│   ├── ProfileService.ts
│   └── PDFService.ts
├── hooks/                # カスタムフック
├── types/                # TypeScript型定義
├── utils/                # ユーティリティ関数
└── lib/                  # ライブラリ設定
```

## 💾 データ保存について

- データはブラウザのlocalStorageに暗号化して保存されます
- サーバーには一切送信されません
- ブラウザのキャッシュを削除するとデータが消失します
- 定期的なバックアップ（エクスポート）を推奨します

## 🔒 セキュリティ

- Web Crypto API による暗号化
- サーバーサイドでのデータ保存なし
- HTTPS通信（Vercelの自動SSL）

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

バグ報告や機能提案は Issue でお願いします。

## 📧 お問い合わせ

質問や要望がある場合は、Issue を作成してください。

---

**Made with ❤️ for freelancers and creators**
