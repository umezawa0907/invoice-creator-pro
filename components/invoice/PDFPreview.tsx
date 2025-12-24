/**
 * PDF プレビューコンポーネント
 */

'use client';

import React, { useState, useRef } from 'react';
import { InvoiceData, IssuerProfile } from '@/types';
import { PDFService } from '@/services/PDFService';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface PDFPreviewProps {
  invoice: InvoiceData;
  issuer: IssuerProfile;
  onGenerate?: () => void;
  onClose?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  invoice,
  issuer,
  onGenerate,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // HTMLプレビューを生成
  const htmlContent = PDFService.generateInvoiceHTML(invoice, issuer);

  // PDFダウンロード
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    try {
      const blob = await PDFService.generateInvoicePDFFromHTML(
        previewRef.current,
        'invoice.pdf'
      );
      const filename = PDFService.generateFilename(
        invoice.invoiceNumber,
        invoice.client.name
      );
      PDFService.downloadPDF(blob, filename);

      // GTM用カスタムイベント送信
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'pdf_generated',
        });
      }
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('PDFダウンロードに失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* アクションボタン */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? 'ダウンロード中...' : '📥 PDFダウンロード'}
        </Button>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="lg"
          >
            閉じる
          </Button>
        )}
      </div>

      {/* HTMLプレビュー */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b">
          <h3 className="text-sm font-medium text-gray-700">請求書プレビュー</h3>
        </div>
        <div
          ref={previewRef}
          className="p-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>



      {/* 説明 */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">💡 使い方</p>
        <ul className="list-disc list-inside space-y-1">
          <li>上記のプレビューで内容を確認してください</li>
          <li>「PDFダウンロード」で請求書をPDFファイルとして保存できます</li>
          <li>PDFファイル名は自動的に「請求書_番号_クライアント名_日付.pdf」となります</li>
        </ul>
      </div>
    </div>
  );
};
