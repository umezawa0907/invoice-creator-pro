/**
 * 請求書管理サービス
 */

import { InvoiceData, InvoiceCounter, CreateInvoiceData } from '@/types';
import { StorageService } from './StorageService';
import { STORAGE_KEYS, DEFAULTS } from '@/utils/constants';

export class InvoiceService {
  /**
   * すべての請求書を読み込み
   */
  static loadAll(): InvoiceData[] {
    try {
      const invoices = StorageService.load<InvoiceData[]>(STORAGE_KEYS.INVOICES);
      return invoices || [];
    } catch (error) {
      console.error('Invoice load error:', error);
      return [];
    }
  }

  /**
   * すべての請求書を保存
   */
  static saveAll(invoices: InvoiceData[]): boolean {
    return StorageService.save(STORAGE_KEYS.INVOICES, invoices);
  }

  /**
   * 請求書の作成
   */
  static create(data: CreateInvoiceData, issuerProfile: any): InvoiceData {
    const invoices = this.loadAll();
    const invoiceNumber = this.generateInvoiceNumber();
    
    const newInvoice: InvoiceData = {
      id: this.generateId(),
      invoiceNumber,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      issuer: issuerProfile,
      client: data.client,
      items: data.items,
      calculation: {
        subtotal: 0,
        consumptionTax: 0,
        withholdingTax: 0,
        finalAmount: 0,
        taxMethod: data.taxMethod,
      },
      hasWithholding: data.hasWithholding,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    invoices.push(newInvoice);
    this.saveAll(invoices);

    return newInvoice;
  }

  /**
   * 請求書番号の生成
   */
  static generateInvoiceNumber(): string {
    const counter = StorageService.load<InvoiceCounter>(STORAGE_KEYS.INVOICE_COUNTER) || {
      year: new Date().getFullYear(),
      number: 1,
    };

    const currentYear = new Date().getFullYear();
    
    if (counter.year !== currentYear) {
      counter.year = currentYear;
      counter.number = 1;
    }

    const invoiceNumber = `${DEFAULTS.INVOICE_NUMBER_PREFIX}${currentYear}-${String(counter.number).padStart(DEFAULTS.INVOICE_NUMBER_PADDING, '0')}`;
    
    counter.number++;
    StorageService.save(STORAGE_KEYS.INVOICE_COUNTER, counter);

    return invoiceNumber;
  }

  /**
   * IDで検索
   */
  static findById(id: string): InvoiceData | null {
    const invoices = this.loadAll();
    return invoices.find(inv => inv.id === id) || null;
  }

  /**
   * 請求書の削除
   */
  static delete(id: string): boolean {
    const invoices = this.loadAll();
    const filtered = invoices.filter(inv => inv.id !== id);
    return this.saveAll(filtered);
  }

  /**
   * ユニークIDの生成
   */
  private static generateId(): string {
    return `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
