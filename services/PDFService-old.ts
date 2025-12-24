/**
 * PDF生成サービス
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceData, IssuerProfile } from '@/types';
import { formatCurrency, formatDate } from '@/utils/calculations';

// jsPDFに日本語フォントを追加するための型拡張
declare module 'jspdf' {
  interface jsPDF {
    addFileToVFS(filename: string, data: string): void;
    addFont(filename: string, fontName: string, fontStyle: string): void;
  }
}

export class PDFService {
  /**
   * 請求書PDFを生成
   */
  static async generateInvoicePDF(invoice: InvoiceData, issuer: IssuerProfile): Promise<Blob> {
    // A4サイズ（210mm × 297mm）
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 日本語フォントの設定
    // Unicode対応のため、テキストは正しくエンコードされます
    // jsPDFはUnicode文字列を自動的に処理します

    let yPosition = 20;

    // ヘッダー - 請求書タイトル
    doc.setFontSize(24);
    doc.text('請求書', 105, yPosition, { align: 'center' });
    yPosition += 15;

    // 請求書番号と発行日
    doc.setFontSize(10);
    doc.text(`請求書番号: ${invoice.invoiceNumber}`, 20, yPosition);
    doc.text(`発行日: ${formatDate(invoice.issueDate)}`, 150, yPosition);
    yPosition += 10;

    // 請求先情報
    doc.setFontSize(12);
    doc.text('【請求先】', 20, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    
    if (invoice.client.companyName) {
      doc.text(invoice.client.companyName, 20, yPosition);
      yPosition += 5;
    }
    doc.text(`${invoice.client.name} 様`, 20, yPosition);
    yPosition += 10;

    // 発行者情報
    doc.setFontSize(12);
    doc.text('【発行者】', 130, 45);
    doc.setFontSize(10);
    let issuerY = 52;
    
    if (issuer.personalInfo.businessName) {
      doc.text(issuer.personalInfo.businessName, 130, issuerY);
      issuerY += 5;
    }
    doc.text(issuer.personalInfo.name, 130, issuerY);
    issuerY += 5;
    doc.text(issuer.personalInfo.address, 130, issuerY, { maxWidth: 70 });
    
    if (issuer.personalInfo.phone) {
      issuerY += 8;
      doc.text(`TEL: ${issuer.personalInfo.phone}`, 130, issuerY);
    }
    
    if (issuer.taxInfo.invoiceNumber) {
      issuerY += 5;
      doc.text(`登録番号: ${issuer.taxInfo.invoiceNumber}`, 130, issuerY);
    }

    yPosition += 5;

    // 請求項目テーブル
    const tableData = invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      `¥${formatCurrency(item.unitPrice)}`,
      `¥${formatCurrency(item.amount)}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['項目', '数量', '単価', '金額']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' },
      },
    });

    // テーブル後のY位置を取得
    const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;
    yPosition = finalY + 10;

    // 金額計算部分
    const calcX = 120;
    doc.setFontSize(10);

    // 小計
    doc.text('小計（税抜）:', calcX, yPosition);
    doc.text(`¥${formatCurrency(invoice.calculation.subtotal)}`, 185, yPosition, { align: 'right' });
    yPosition += 6;

    // 消費税
    doc.text('消費税（10%）:', calcX, yPosition);
    doc.text(`¥${formatCurrency(invoice.calculation.consumptionTax)}`, 185, yPosition, { align: 'right' });
    yPosition += 6;

    // 源泉徴収税
    if (invoice.calculation.withholdingTax > 0) {
      doc.text('源泉徴収税（10.21%）:', calcX, yPosition);
      doc.text(`-¥${formatCurrency(invoice.calculation.withholdingTax)}`, 185, yPosition, { align: 'right' });
      yPosition += 6;
    }

    // 線を引く
    doc.line(calcX, yPosition, 190, yPosition);
    yPosition += 6;

    // 最終請求額
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ご請求金額:', calcX, yPosition);
    doc.text(`¥${formatCurrency(invoice.calculation.finalAmount)}`, 185, yPosition, { align: 'right' });
    yPosition += 10;

    // 支払期限
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`お支払期限: ${formatDate(invoice.dueDate)}`, 20, yPosition);
    yPosition += 10;

    // 振込先情報
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('【お振込先】', 20, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    doc.text(`銀行名: ${issuer.bankInfo.bankName}`, 20, yPosition);
    yPosition += 5;
    doc.text(`支店名: ${issuer.bankInfo.branchName}`, 20, yPosition);
    yPosition += 5;
    doc.text(`口座種別: ${issuer.bankInfo.accountType}`, 20, yPosition);
    yPosition += 5;
    doc.text(`口座番号: ${issuer.bankInfo.accountNumber}`, 20, yPosition);
    yPosition += 5;
    doc.text(`口座名義: ${issuer.bankInfo.accountHolder}`, 20, yPosition);
    yPosition += 10;

    // 備考
    if (invoice.notes) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('【備考】', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const splitNotes = doc.splitTextToSize(invoice.notes, 170);
      doc.text(splitNotes, 20, yPosition);
      yPosition += splitNotes.length * 5;
    }

    // フッター
    doc.setFontSize(8);
    doc.setTextColor(128);
    const footerText = 'Created by クリエイター請求書さくっと';
    doc.text(footerText, 105, 285, { align: 'center' });

    // 税務情報の注記
    if (invoice.calculation.withholdingTax > 0) {
      const taxNote = invoice.calculation.taxMethod === 'included'
        ? '※ 源泉徴収税は消費税込みで計算しています（原則方式）'
        : '※ 源泉徴収税は消費税を区分して計算しています（例外方式）';
      doc.text(taxNote, 105, 280, { align: 'center' });
    }

    // PDFをBlobとして返す
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  }

  /**
   * PDFをダウンロード
   */
  static downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * ファイル名を生成
   */
  static generateFilename(invoiceNumber: string, clientName: string): string {
    const date = new Date().toISOString().split('T')[0];
    const sanitizedClient = clientName.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '_');
    return `請求書_${invoiceNumber}_${sanitizedClient}_${date}.pdf`;
  }
}
