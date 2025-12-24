# 🚀 デプロイガイド

## 📋 目次

1. [事前準備](#事前準備)
2. [GitHubへのプッシュ](#githubへのプッシュ)
3. [Vercelへのデプロイ](#vercelへのデプロイ)
4. [カスタムドメイン設定](#カスタムドメイン設定)
5. [デプロイ後の確認](#デプロイ後の確認)

---

## 事前準備

### 必要なアカウント

- ✅ GitHub アカウント
- ✅ Vercel アカウント（GitHubでログイン可能）

### ローカル環境

- ✅ Node.js 18以上
- ✅ Git

---

## GitHubへのプッシュ

### 1. GitHubでリポジトリを作成

1. https://github.com にアクセス
2. 右上の「+」→「New repository」をクリック
3. 以下を設定:
   - **Repository name**: `invoice-creator-pro`
   - **Description**: 請求書作成アプリ - 会員登録不要・完全無料
   - **Public / Private**: Public（Vercel Freeプランで使用する場合）
   - **Add a README**: チェックを外す（既にREADME.mdがあるため）
4. 「Create repository」をクリック

### 2. ローカルでGit初期化

```bash
# プロジェクトディレクトリに移動
cd ~/Downloads/invoice-creator-pro

# Git初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: 請求書さくっと v1.0.0

Features:
- 3ステップで請求書作成
- 源泉徴収税・消費税の自動計算
- プロフィール管理機能
- PDF生成機能
- エクスポート・インポート機能
- Noto Sans JP フォント統一
- レスポンシブ対応"

# リモートリポジトリを追加（YOUR_USERNAMEを自分のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/invoice-creator-pro.git

# メインブランチに変更
git branch -M main

# プッシュ
git push -u origin main
```

### 3. プッシュの確認

GitHubのリポジトリページをリロードして、ファイルが正しくアップロードされたか確認してください。

---

## Vercelへのデプロイ

### 1. Vercelにログイン

1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」でGitHubアカウントでログイン

### 2. プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションから `invoice-creator-pro` を探す
3. 「Import」をクリック

### 3. ビルド設定

以下の設定を確認（通常は自動検出されます）:

```
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: .next
Root Directory: ./
```

**Environment Variables**: 不要（クライアントサイドのみのため）

### 4. デプロイ開始

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（1〜3分）

### 5. デプロイ完了

デプロイが完了すると、以下のようなURLが生成されます:

```
https://invoice-creator-pro-xxxxx.vercel.app
```

🎉 **おめでとうございます！** アプリが公開されました！

---

## カスタムドメイン設定

### 1. ドメインの取得

以下のサービスでドメインを取得（推奨: `seikyusho-sakutto.jp`）:

- [お名前.com](https://www.onamae.com/) - 年間約1,500円
- [ムームードメイン](https://muumuu-domain.com/)
- [Google Domains](https://domains.google/)

### 2. Vercelでドメインを追加

1. Vercelプロジェクトの「Settings」→「Domains」
2. カスタムドメインを入力（例: `seikyusho-sakutto.jp`）
3. 「Add」をクリック

### 3. DNS設定

Vercelが表示する設定に従って、ドメイン管理画面でDNSレコードを追加:

**タイプA（Apex Domain）:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**タイプCNAME（www）:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. SSL証明書

Vercelが自動的にLet's EncryptのSSL証明書を発行します（数分〜数時間）。

---

## デプロイ後の確認

### ✅ 機能チェックリスト

#### ホームページ
- [ ] ページが正しく表示される
- [ ] フォントがNoto Sans JPで表示される
- [ ] レスポンシブデザインが動作する

#### プロフィール管理
- [ ] プロフィールの作成ができる
- [ ] プロフィールの編集・削除ができる
- [ ] エクスポート・インポートができる
- [ ] データ警告が表示される

#### 請求書作成
- [ ] Step 1: 発行者情報が表示される
- [ ] Step 2: 請求内容の入力ができる
- [ ] Step 2: リアルタイム金額計算が動作する
- [ ] Step 3: 確認画面で正しい金額が表示される
- [ ] PDFダウンロードができる
- [ ] PDFの日本語が正しく表示される
- [ ] お支払期限が正しい位置に表示される

#### モバイル対応
- [ ] スマホで正しく表示される
- [ ] タブレットで正しく表示される
- [ ] タッチ操作が正常に動作する

---

## 🔄 更新のデプロイ

コードを更新した後、以下のコマンドでデプロイ:

```bash
# 変更をコミット
git add .
git commit -m "Fix: バグ修正の説明"

# プッシュ（自動的にVercelでデプロイされる）
git push origin main
```

Vercelは `main` ブランチへのプッシュを自動検知して、自動的にデプロイします。

---

## 📊 アナリティクスの設定（推奨）

### Google Analytics 4

1. https://analytics.google.com でGA4プロパティを作成
2. 測定IDを取得（例: `G-XXXXXXXXXX`）
3. `app/layout.tsx` に以下を追加:

```tsx
<head>
  {/* Google Analytics */}
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
      `,
    }}
  />
</head>
```

---

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドを確認
npm run build

# エラーが出た場合、ログを確認
```

### デプロイが失敗する

1. Vercelのデプロイログを確認
2. Node.jsのバージョンを確認（18以上）
3. 依存関係を再インストール: `rm -rf node_modules && npm install`

### ドメインが反映されない

- DNS設定の反映には最大48時間かかる場合があります
- `nslookup seikyusho-sakutto.jp` でDNS設定を確認

---

## 📞 サポート

問題が発生した場合は、以下を確認してください:

1. Vercelのデプロイログ
2. ブラウザのコンソールログ（F12）
3. GitHubのIssue

---

## 🎉 次のステップ

デプロイが完了したら:

1. ✅ SNSで告知（Twitter, Instagram）
2. ✅ ランディングページの最適化
3. ✅ Google Analytics でアクセス解析
4. ✅ ユーザーフィードバックの収集
5. ✅ 継続的な改善

---

**おめでとうございます！あなたの請求書作成アプリが全世界に公開されました！** 🚀
