/**
 * 請求書作成ページ
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { PDFPreview } from '@/components/invoice/PDFPreview';
import { useProfileStore } from '@/store/profileStore';
import { CreateInvoiceFormData } from '@/utils/validation';
import { InvoiceService } from '@/services/InvoiceService';
import { calculateInvoice } from '@/utils/calculations';
import { InvoiceData } from '@/types';

export default function InvoiceCreatePage() {
  const { defaultProfile, loadProfiles } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleSubmit = async (data: CreateInvoiceFormData) => {
    if (!defaultProfile) {
      alert('❌ 請求元情報が設定されていません');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 計算を実行
      const calculation = calculateInvoice(
        data.items,
        data.hasWithholding,
        data.taxMethod
      );

      // 請求書番号を生成
      const invoiceNumber = InvoiceService.generateInvoiceNumber();

      // 請求書データを作成
      const invoice: InvoiceData = {
        id: `invoice_${Date.now()}`,
        invoiceNumber,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        issuer: defaultProfile,
        client: data.client,
        items: data.items,
        calculation,
        hasWithholding: data.hasWithholding,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 請求書を保存
      const invoices = InvoiceService.loadAll();
      invoices.push(invoice);
      InvoiceService.saveAll(invoices);

      // 生成された請求書をセット
      setGeneratedInvoice(invoice);
      setShowPDFPreview(true);

    } catch (error) {
      console.error('Submit error:', error);
      alert('❌ 請求書の生成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePDFPreview = () => {
    setShowPDFPreview(false);
    
    // 成功メッセージを表示して、新しい請求書作成へ
    const shouldCreateNew = window.confirm(
      '✅ 請求書を生成しました！\n\n新しい請求書を作成しますか？'
    );
    
    if (shouldCreateNew) {
      window.location.reload();
    }
  };

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
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  ⚙️ 請求元情報管理
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📄 請求書作成</h1>
          <p className="text-gray-600 mt-2">
            3ステップで簡単に請求書を作成できます
          </p>
        </div>

        <InvoiceForm
          defaultProfile={defaultProfile}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </main>

      {/* PDFプレビューモーダル */}
      {showPDFPreview && generatedInvoice && defaultProfile && (
        <PDFPreview
          invoice={generatedInvoice}
          issuer={defaultProfile}
          onClose={handleClosePDFPreview}
        />
      )}

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
