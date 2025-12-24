/**
 * プロフィール管理ページ
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProfileManager } from '@/components/profile/ProfileManager';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              請求書さくっと
            </Link>
            <nav className="flex gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  🏠 ホーム
                </Button>
              </Link>
              <Link href="/invoice/create">
                <Button size="sm">
                  📄 請求書作成
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileManager />
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 請求書さくっと. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              個人情報はお使いのブラウザにのみ保存され、サーバーには送信されません
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
