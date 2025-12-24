/**
 * ホームページ
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">
              請求書さくっと
            </h1>
            <nav className="flex gap-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  請求元情報管理
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              請求書作成が<br className="md:hidden" />
              <span className="text-primary-600">たった3ステップで作れる</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              会員登録不要で請求書を無料で作れます<br />
              源泉徴収税の自動計算・適格請求書対応<br />
              個人情報はあなたのPC・スマホにのみ暗号化して保存する仕様だから安心
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/invoice/create">
                <Button size="lg" className="w-full sm:w-auto">
                  🚀 請求書を作成する
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">主な特徴</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="3ステップで完成"
              description="発行者情報 → 請求内容 → 確認・生成の簡単3ステップ"
            />
            <FeatureCard
              icon="🧮"
              title="自動計算"
              description="源泉徴収税10.21%と消費税10%を自動計算。国税庁準拠"
            />
            <FeatureCard
              icon="🔒"
              title="安全な保存"
              description="個人情報はブラウザにのみ暗号化保存。サーバー送信なし。バックアップ機能あり"
            />
            <FeatureCard
              icon="📄"
              title="インボイス対応"
              description="適格請求書発行事業者番号に完全対応"
            />
            <FeatureCard
              icon="💾"
              title="自動保存"
              description="入力内容を自動保存。次回から入力不要"
            />
            <FeatureCard
              icon="📱"
              title="PDFをすぐに生成"
              description="作った請求書をPDFですぐにダウンロードできます"
            />
          </div>
        </div>
      </section>

      {/* 計算例セクション */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">計算例</h3>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <CalculationRow label="作業金額（税抜）" value="30,000円" />
              <CalculationRow label="消費税（10%）" value="3,000円" />
              <CalculationRow label="源泉徴収税（10.21%）" value="-3,369円" highlight />
              <div className="border-t-2 border-gray-300 pt-4">
                <CalculationRow 
                  label="最終請求額" 
                  value="29,631円" 
                  bold 
                  large 
                />
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-600 text-center">
              ※ 消費税込みで源泉徴収税を計算（原則方式）
            </p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">今すぐ始めましょう</h3>
          <p className="text-xl text-gray-600 mb-8">
            完全無料・登録不要で、すぐに請求書を作成できます
          </p>
          <Link href="/invoice/create">
            <Button size="lg">
              請求書を作成する →
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 請求書さくっと. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              個人情報はお使いのブラウザにのみ保存され、サーバーには送信されません。<br />
              ブラウザのキャッシュ削除でデータが消えるため、定期的なバックアップを推奨します。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 特徴カードコンポーネント
function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// 計算行コンポーネント
function CalculationRow({ 
  label, 
  value, 
  bold, 
  large, 
  highlight 
}: { 
  label: string; 
  value: string; 
  bold?: boolean; 
  large?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold' : ''} ${large ? 'text-2xl' : 'text-lg'}`}>
      <span className={highlight ? 'text-red-600' : ''}>{label}</span>
      <span className={highlight ? 'text-red-600' : ''}>{value}</span>
    </div>
  );
}
