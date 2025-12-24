/**
 * 請求書関連の型定義
 */

import { IssuerProfile, TaxCalculationMethod } from './profile';

// 請求書項目
export interface InvoiceItem {
  id: string;                      // 項目ID
  description: string;             // 作業内容・品名
  quantity: number;                // 数量
  unitPrice: number;               // 単価
  amount: number;                  // 金額（quantity × unitPrice）
}

// クライアント情報
export interface ClientInfo {
  name: string;                    // クライアント名
  companyName?: string;            // 会社名（任意）
  department?: string;             // 部署名（任意）
  address?: string;                // 住所（任意）
  email?: string;                  // メールアドレス（任意）
}

// 請求書計算結果
export interface InvoiceCalculation {
  subtotal: number;                // 小計
  consumptionTax: number;          // 消費税
  withholdingTax: number;          // 源泉徴収税
  finalAmount: number;             // 最終請求額
  taxMethod: TaxCalculationMethod; // 計算方法
}

// 請求書データ
export interface InvoiceData {
  id: string;                      // 請求書ID
  invoiceNumber: string;           // 請求書番号
  issueDate: string;               // 発行日（ISO 8601）
  dueDate: string;                 // 支払期限（ISO 8601）
  issuer: IssuerProfile;           // 発行者情報
  client: ClientInfo;              // クライアント情報
  items: InvoiceItem[];            // 請求項目
  calculation: InvoiceCalculation; // 計算結果
  hasWithholding: boolean;         // 源泉徴収あり
  notes?: string;                  // 備考
  createdAt: string;               // 作成日時（ISO 8601）
  updatedAt: string;               // 更新日時（ISO 8601）
}

// 請求書作成用データ
export interface CreateInvoiceData {
  client: ClientInfo;              // クライアント情報
  items: InvoiceItem[];            // 請求項目
  hasWithholding: boolean;         // 源泉徴収あり
  taxMethod: TaxCalculationMethod; // 計算方法
  issueDate: string;               // 発行日
  dueDate: string;                 // 支払期限
  notes?: string;                  // 備考
}

// 請求書一覧用データ
export interface InvoiceListItem {
  id: string;                      // 請求書ID
  invoiceNumber: string;           // 請求書番号
  clientName: string;              // クライアント名
  finalAmount: number;             // 最終請求額
  issueDate: string;               // 発行日
  status: InvoiceStatus;           // ステータス
}

// 請求書ステータス
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';

// 請求書フィルター
export interface InvoiceFilter {
  status?: InvoiceStatus;          // ステータス
  clientName?: string;             // クライアント名
  dateFrom?: string;               // 開始日
  dateTo?: string;                 // 終了日
}

// 請求書番号カウンター
export interface InvoiceCounter {
  year: number;                    // 年
  number: number;                  // 連番
}
