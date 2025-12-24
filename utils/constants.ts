/**
 * 定数定義
 */

// ストレージキー
export const STORAGE_KEYS = {
  PROFILES: 'invoice_creator_profiles',
  INVOICES: 'invoice_creator_invoices',
  INVOICE_COUNTER: 'invoice_creator_counter',
  SETTINGS: 'invoice_creator_settings',
} as const;

// データバージョン
export const DATA_VERSION = '1.0.0';

// デフォルト値
export const DEFAULTS = {
  TAX_METHOD: 'included' as const,
  ACCOUNT_TYPE: '普通' as const,
  PAYMENT_TERMS_DAYS: 30,
  INVOICE_NUMBER_PREFIX: '',
  INVOICE_NUMBER_PADDING: 3,
} as const;

// バリデーションルール
export const VALIDATION = {
  POSTAL_CODE_PATTERN: /^\d{3}-\d{4}$/,
  INVOICE_NUMBER_PATTERN: /^T\d{13}$/,
  ACCOUNT_NUMBER_PATTERN: /^\d+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[\d-+() ]+$/,
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: '必須項目です',
  INVALID_EMAIL: 'メールアドレスの形式が正しくありません',
  INVALID_POSTAL_CODE: '郵便番号の形式が正しくありません（例：123-4567）',
  INVALID_INVOICE_NUMBER: '適格請求書発行事業者番号はT+13桁の数字です',
  INVALID_ACCOUNT_NUMBER: '口座番号は数字のみです',
  INVALID_PHONE: '電話番号の形式が正しくありません',
  MIN_AMOUNT: '金額は0より大きい値を入力してください',
  STORAGE_ERROR: 'データの保存に失敗しました',
  LOAD_ERROR: 'データの読み込みに失敗しました',
} as const;

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  PROFILE_SAVED: 'プロフィールを保存しました',
  PROFILE_UPDATED: 'プロフィールを更新しました',
  PROFILE_DELETED: 'プロフィールを削除しました',
  INVOICE_CREATED: '請求書を作成しました',
  INVOICE_UPDATED: '請求書を更新しました',
  DATA_EXPORTED: 'データをエクスポートしました',
  DATA_IMPORTED: 'データをインポートしました',
} as const;

// 税率
export const TAX_RATES = {
  CONSUMPTION_TAX: 0.10,
  WITHHOLDING_TAX: 0.1021,
} as const;
