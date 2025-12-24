/**
 * 発行者プロフィール関連の型定義
 */

// 税計算方法
export type TaxCalculationMethod = 'included' | 'separate';

// 口座種別
export type AccountType = '普通' | '当座';

// 基本情報
export interface PersonalInfo {
  name: string;                    // 氏名・屋号
  businessName?: string;           // 事業者名（任意）
  postalCode: string;              // 郵便番号
  address: string;                 // 住所
  phone?: string;                  // 電話番号
  email?: string;                  // メールアドレス
}

// 銀行口座情報
export interface BankInfo {
  bankName: string;                // 銀行名
  branchName: string;              // 支店名
  accountType: AccountType;        // 口座種別
  accountNumber: string;           // 口座番号
  accountHolder: string;           // 口座名義
}

// 税務情報
export interface TaxInfo {
  invoiceNumber?: string;          // 適格請求書発行事業者番号
  taxMethod: TaxCalculationMethod; // 消費税計算方法のデフォルト
}

// プロフィールメタ情報
export interface ProfileMeta {
  profileName: string;             // プロフィール名
  isDefault: boolean;              // デフォルトプロフィール
  createdAt: string;               // 作成日時（ISO 8601）
  updatedAt: string;               // 更新日時（ISO 8601）
}

// 発行者プロフィール
export interface IssuerProfile {
  readonly id: string;             // プロフィールID
  personalInfo: PersonalInfo;      // 基本情報
  bankInfo: BankInfo;              // 銀行口座情報
  taxInfo: TaxInfo;                // 税務情報
  meta: ProfileMeta;               // メタ情報
}

// プロフィール作成用データ（IDとメタ情報を除く）
export type CreateProfileData = Omit<IssuerProfile, 'id' | 'meta'> & {
  meta?: Partial<ProfileMeta>;
};

// プロフィール更新用データ
export type UpdateProfileData = Partial<Omit<IssuerProfile, 'id'>>;

// 暗号化されたデータ
export interface EncryptedData {
  data: number[];                  // 暗号化されたデータ
  iv: number[];                    // 初期化ベクトル
}

// ストレージデータ構造
export interface ProfileStorageData {
  profiles: IssuerProfile[];       // プロフィール配列
  version: string;                 // データバージョン
  lastBackup?: string;             // 最後のバックアップ日時
}
