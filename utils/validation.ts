/**
 * バリデーションユーティリティ
 */

import { z } from 'zod';
import { ERROR_MESSAGES, VALIDATION } from './constants';

// 基本情報のスキーマ
export const PersonalInfoSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  businessName: z.string().optional(),
  postalCode: z.string()
    .regex(VALIDATION.POSTAL_CODE_PATTERN, ERROR_MESSAGES.INVALID_POSTAL_CODE),
  address: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  phone: z.string()
    .regex(VALIDATION.PHONE_PATTERN, ERROR_MESSAGES.INVALID_PHONE)
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .optional()
    .or(z.literal('')),
});

// 銀行口座情報のスキーマ
export const BankInfoSchema = z.object({
  bankName: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  branchName: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  accountType: z.enum(['普通', '当座']),
  accountNumber: z.string()
    .regex(VALIDATION.ACCOUNT_NUMBER_PATTERN, ERROR_MESSAGES.INVALID_ACCOUNT_NUMBER),
  accountHolder: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
});

// 税務情報のスキーマ
export const TaxInfoSchema = z.object({
  invoiceNumber: z.string()
    .regex(VALIDATION.INVOICE_NUMBER_PATTERN, ERROR_MESSAGES.INVALID_INVOICE_NUMBER)
    .optional()
    .or(z.literal('')),
  taxMethod: z.enum(['included', 'separate']),
});

// プロフィールメタ情報のスキーマ
export const ProfileMetaSchema = z.object({
  profileName: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  isDefault: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// 発行者プロフィールのスキーマ
export const IssuerProfileSchema = z.object({
  id: z.string().optional(),
  personalInfo: PersonalInfoSchema,
  bankInfo: BankInfoSchema,
  taxInfo: TaxInfoSchema,
  meta: ProfileMetaSchema,
});

// クライアント情報のスキーマ
export const ClientInfoSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  companyName: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  email: z.string()
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .optional()
    .or(z.literal('')),
});

// 請求書項目のスキーマ
export const InvoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  quantity: z.number().min(1, ERROR_MESSAGES.MIN_AMOUNT),
  unitPrice: z.number().min(1, ERROR_MESSAGES.MIN_AMOUNT),
  amount: z.number(),
});

// 請求書作成データのスキーマ
export const CreateInvoiceSchema = z.object({
  client: ClientInfoSchema,
  items: z.array(InvoiceItemSchema).min(1, '請求項目を1つ以上追加してください'),
  hasWithholding: z.boolean(),
  taxMethod: z.enum(['included', 'separate']),
  issueDate: z.string(),
  dueDate: z.string(),
  notes: z.string().optional(),
});

/**
 * 型推論用のユーティリティ型
 */
export type IssuerProfileFormData = z.infer<typeof IssuerProfileSchema>;
export type ClientInfoFormData = z.infer<typeof ClientInfoSchema>;
export type InvoiceItemFormData = z.infer<typeof InvoiceItemSchema>;
export type CreateInvoiceFormData = z.infer<typeof CreateInvoiceSchema>;
