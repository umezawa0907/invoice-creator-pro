/**
 * PDF生成サービス (HTML2Canvas版)
 * 日本語フォント対応
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData, IssuerProfile } from '@/types';
import { formatCurrency, formatDate } from '@/utils/calculations';

export class PDFService {
  /**
   * HTMLから請求書PDFを生成
   */
  static async generateInvoicePDFFromHTML(
    htmlElement: HTMLElement,
    filename: string
  ): Promise<Blob> {
    try {
      // HTMLをCanvasに変換
      const canvas = await html2canvas(htmlElement, {
        scale: 2, // 高解像度
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // CanvasをPDFに変換
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      return pdf.output('blob');
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  /**
   * 請求書HTMLテンプレートを生成
   */
  static generateInvoiceHTML(invoice: InvoiceData, issuer: IssuerProfile): string {
    const itemsHTML = invoice.items
      .map(
        (item) => `
        <tr>
          <td class="border px-4 py-2">${item.description}</td>
          <td class="border px-4 py-2 text-center">${item.quantity}</td>
          <td class="border px-4 py-2 text-right">¥${formatCurrency(item.unitPrice)}</td>
          <td class="border px-4 py-2 text-right">¥${formatCurrency(item.amount)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
          
          body {
            font-family: 'Noto Sans JP', sans-serif;
            padding: 40px;
            background: white;
            color: #1a202c;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 12px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 2px solid #2d3748;
            padding-bottom: 5px;
          }
          
          .client-section, .issuer-section {
            margin-bottom: 20px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th {
            background-color: #2b6cb0;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
          }
          
          td {
            padding: 10px 8px;
            border: 1px solid #cbd5e0;
          }
          
          .calculation {
            margin-left: auto;
            width: 400px;
            margin-bottom: 30px;
          }
          
          .calc-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .calc-total {
            font-size: 18px;
            font-weight: bold;
            padding-top: 12px;
            border-top: 2px solid #2d3748;
          }
          
          .bank-info {
            background-color: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          
          .notes {
            background-color: #fffaf0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ed8936;
          }
          
          .footer {
            text-align: center;
            font-size: 10px;
            color: #718096;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">請求書</div>
        </div>
        
        <div class="invoice-info">
          <div>
            <strong>請求書番号:</strong> ${invoice.invoiceNumber}<br>
            <strong>発行日:</strong> ${formatDate(invoice.issueDate)}
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div class="client-section" style="flex: 1;">
            <div class="section-title">【請求先】</div>
            ${invoice.client.companyName ? `<div>${invoice.client.companyName}</div>` : ''}
            <div><strong>${invoice.client.name} 様</strong></div>
            ${invoice.client.department ? `<div>${invoice.client.department}</div>` : ''}
          </div>
          
          <div class="issuer-section" style="flex: 1; text-align: right;">
            <div class="section-title" style="text-align: right;">【発行者】</div>
            ${issuer.personalInfo.businessName ? `<div>${issuer.personalInfo.businessName}</div>` : ''}
            <div><strong>${issuer.personalInfo.name}</strong></div>
            <div>${issuer.personalInfo.address}</div>
            ${issuer.personalInfo.phone ? `<div>TEL: ${issuer.personalInfo.phone}</div>` : ''}
            ${issuer.taxInfo.invoiceNumber ? `<div>登録番号: ${issuer.taxInfo.invoiceNumber}</div>` : ''}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">項目</th>
              <th style="width: 15%; text-align: center;">数量</th>
              <th style="width: 17.5%; text-align: right;">単価</th>
              <th style="width: 17.5%; text-align: right;">金額</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="calculation">
          <div class="calc-row">
            <span>小計（税抜）</span>
            <span>¥${formatCurrency(invoice.calculation.subtotal)}</span>
          </div>
          <div class="calc-row">
            <span>消費税（10%）</span>
            <span>¥${formatCurrency(invoice.calculation.consumptionTax)}</span>
          </div>
          ${
            invoice.calculation.withholdingTax > 0
              ? `
          <div class="calc-row" style="color: #e53e3e;">
            <span>源泉徴収税（10.21%）</span>
            <span>-¥${formatCurrency(invoice.calculation.withholdingTax)}</span>
          </div>
          `
              : ''
          }
          <div class="calc-row calc-total">
            <span>ご請求金額</span>
            <span>¥${formatCurrency(invoice.calculation.finalAmount)}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">
            <strong>お支払期限:</strong> ${formatDate(invoice.dueDate)}
          </div>
        </div>
        
        <div class="bank-info">
          <div class="section-title">【お振込先】</div>
          <div><strong>銀行名:</strong> ${issuer.bankInfo.bankName}</div>
          <div><strong>支店名:</strong> ${issuer.bankInfo.branchName}</div>
          <div><strong>口座種別:</strong> ${issuer.bankInfo.accountType}</div>
          <div><strong>口座番号:</strong> ${issuer.bankInfo.accountNumber}</div>
          <div><strong>口座名義:</strong> ${issuer.bankInfo.accountHolder}</div>
        </div>
        
        ${
          invoice.notes
            ? `
        <div class="notes">
          <div class="section-title">【備考】</div>
          <div>${invoice.notes.replace(/\n/g, '<br>')}</div>
        </div>
        `
            : ''
        }
        
        ${
          invoice.calculation.withholdingTax > 0
            ? `
        <div class="footer">
          <div>
            ${
              invoice.calculation.taxMethod === 'included'
                ? '※ 源泉徴収税は消費税込みで計算しています（原則方式）'
                : '※ 源泉徴収税は消費税を区分して計算しています（例外方式）'
            }
          </div>
        </div>
        `
            : ''
        }
      </body>
      </html>
    `;
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
