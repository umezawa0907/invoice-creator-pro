/**
 * 計算結果表示コンポーネント
 */

'use client';

import React from 'react';
import { InvoiceCalculation } from '@/types';
import { formatCurrencyWithSymbol } from '@/utils/calculations';

interface CalculationDisplayProps {
  calculation: InvoiceCalculation;
  className?: string;
}

export const CalculationDisplay: React.FC<CalculationDisplayProps> = ({
  calculation,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 金額計算</h3>
      
      <div className="space-y-3">
        {/* 小計 */}
        <CalcRow
          label="小計（税抜）"
          value={formatCurrencyWithSymbol(calculation.subtotal)}
        />

        {/* 消費税 */}
        <CalcRow
          label="消費税（10%）"
          value={formatCurrencyWithSymbol(calculation.consumptionTax)}
        />

        {/* 源泉徴収税 */}
        {calculation.withholdingTax > 0 && (
          <CalcRow
            label="源泉徴収税（10.21%）"
            value={`-${formatCurrencyWithSymbol(calculation.withholdingTax)}`}
            highlight
          />
        )}

        {/* 最終請求額 */}
        <div className="border-t-2 pt-3 mt-3">
          <CalcRow
            label="最終請求額"
            value={formatCurrencyWithSymbol(calculation.finalAmount)}
            large
            bold
          />
        </div>
      </div>

      {/* 計算方法の説明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-700">
        <p className="font-medium mb-1">📝 計算方法</p>
        {calculation.taxMethod === 'included' ? (
          <p>
            消費税込みで源泉徴収税を計算（原則方式）
            <br />
            <span className="text-xs text-gray-600">
              源泉徴収税 = (税抜金額 + 消費税) × 10.21%
            </span>
          </p>
        ) : (
          <p>
            消費税を区分して源泉徴収税を計算（例外方式）
            <br />
            <span className="text-xs text-gray-600">
              源泉徴収税 = 税抜金額 × 10.21%
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

// 計算行コンポーネント
interface CalcRowProps {
  label: string;
  value: string;
  large?: boolean;
  bold?: boolean;
  highlight?: boolean;
}

const CalcRow: React.FC<CalcRowProps> = ({
  label,
  value,
  large,
  bold,
  highlight,
}) => {
  return (
    <div
      className={`flex justify-between items-center ${
        large ? 'text-xl' : 'text-base'
      } ${bold ? 'font-bold' : ''} ${
        highlight ? 'text-red-600' : 'text-gray-900'
      }`}
    >
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
};
