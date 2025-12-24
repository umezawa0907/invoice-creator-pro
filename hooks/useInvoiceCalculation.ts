/**
 * 請求書計算カスタムフック
 */

'use client';

import { useCallback, useMemo } from 'react';
import { InvoiceItem, TaxCalculationMethod, InvoiceCalculation } from '@/types';
import { calculateInvoice, calculateItemAmount } from '@/utils/calculations';

export function useInvoiceCalculation() {
  /**
   * 項目の金額を計算
   */
  const calculateItem = useCallback((quantity: number, unitPrice: number): number => {
    return calculateItemAmount(quantity, unitPrice);
  }, []);

  /**
   * 請求書全体の計算
   */
  const calculate = useCallback((
    items: InvoiceItem[],
    hasWithholding: boolean,
    taxMethod: TaxCalculationMethod
  ): InvoiceCalculation => {
    return calculateInvoice(items, hasWithholding, taxMethod);
  }, []);

  /**
   * リアルタイム計算（useMemoでキャッシュ）
   */
  const useRealTimeCalculation = (
    items: InvoiceItem[],
    hasWithholding: boolean,
    taxMethod: TaxCalculationMethod
  ) => {
    // items配列の内容変化を検知するために、各項目の金額を文字列化
    const itemsKey = items?.map(item => `${item.quantity}-${item.unitPrice}-${item.amount}`).join(',') || '';
    
    return useMemo(() => {
      if (!items || items.length === 0) {
        return {
          subtotal: 0,
          consumptionTax: 0,
          withholdingTax: 0,
          finalAmount: 0,
          taxMethod,
        };
      }
      return calculateInvoice(items, hasWithholding, taxMethod);
    }, [itemsKey, hasWithholding, taxMethod]);
  };

  return {
    calculateItem,
    calculate,
    useRealTimeCalculation,
  };
}
