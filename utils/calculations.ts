/**
 * 請求書計算ロジック
 * 国税庁の源泉徴収税計算ルールに準拠
 */

import { InvoiceCalculation, InvoiceItem, TaxCalculationMethod } from '@/types';

// 消費税率
const CONSUMPTION_TAX_RATE = 0.10;

// 源泉徴収税率（所得税10% + 復興特別所得税0.21%）
const WITHHOLDING_TAX_RATE = 0.1021;

/**
 * 請求書金額の計算
 * @param items 請求項目
 * @param hasWithholding 源泉徴収あり
 * @param taxMethod 計算方法
 * @returns 計算結果
 */
export function calculateInvoice(
  items: InvoiceItem[],
  hasWithholding: boolean,
  taxMethod: TaxCalculationMethod
): InvoiceCalculation {
  // 小計の計算
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  // 消費税の計算（切り捨て）
  const consumptionTax = Math.floor(subtotal * CONSUMPTION_TAX_RATE);

  // 源泉徴収税の計算
  let withholdingTax = 0;
  if (hasWithholding) {
    if (taxMethod === 'separate') {
      // 例外：消費税を区分して計算
      // 源泉徴収税 = 税抜金額 × 10.21%（切り捨て）
      withholdingTax = Math.floor(subtotal * WITHHOLDING_TAX_RATE);
    } else {
      // 原則：消費税込みで計算
      // 源泉徴収税 = (税抜金額 + 消費税) × 10.21%（切り捨て）
      const totalWithTax = subtotal + consumptionTax;
      withholdingTax = Math.floor(totalWithTax * WITHHOLDING_TAX_RATE);
    }
  }

  // 最終請求額 = 税抜金額 + 消費税 - 源泉徴収税
  const finalAmount = subtotal + consumptionTax - withholdingTax;

  return {
    subtotal,
    consumptionTax,
    withholdingTax,
    finalAmount,
    taxMethod,
  };
}

/**
 * 項目の金額計算
 * @param quantity 数量
 * @param unitPrice 単価
 * @returns 金額
 */
export function calculateItemAmount(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

/**
 * 金額のフォーマット（3桁区切り）
 * @param amount 金額
 * @returns フォーマットされた文字列
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/**
 * 金額のフォーマット（円記号付き）
 * @param amount 金額
 * @returns フォーマットされた文字列
 */
export function formatCurrencyWithSymbol(amount: number): string {
  return `¥${formatCurrency(amount)}`;
}

/**
 * 日付のフォーマット
 * @param date 日付文字列またはDateオブジェクト
 * @returns フォーマットされた文字列
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

/**
 * 計算サンプルデータの取得
 * @param amount サンプル金額
 * @param hasWithholding 源泉徴収あり
 * @param taxMethod 計算方法
 * @returns 計算結果
 */
export function getCalculationExample(
  amount: number,
  hasWithholding: boolean,
  taxMethod: TaxCalculationMethod
): InvoiceCalculation {
  const sampleItem: InvoiceItem = {
    id: 'sample',
    description: 'サンプル',
    quantity: 1,
    unitPrice: amount,
    amount: amount,
  };

  return calculateInvoice([sampleItem], hasWithholding, taxMethod);
}
