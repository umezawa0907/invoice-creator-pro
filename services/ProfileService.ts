/**
 * プロフィール管理サービス
 */

import { 
  IssuerProfile, 
  CreateProfileData, 
  UpdateProfileData,
  ProfileStorageData 
} from '@/types';
import { StorageService } from './StorageService';
import { EncryptionService } from './EncryptionService';
import { STORAGE_KEYS, DATA_VERSION } from '@/utils/constants';

export class ProfileService {
  private static encryption = EncryptionService.getInstance();

  /**
   * すべてのプロフィールを読み込み
   */
  static async loadAll(): Promise<IssuerProfile[]> {
    try {
      const encrypted = StorageService.load<{ data: string; iv: string }>(
        STORAGE_KEYS.PROFILES
      );

      if (!encrypted) {
        return [];
      }

      // 暗号化データの復号化
      const decrypted = await this.encryption.decrypt(encrypted);
      const storageData: ProfileStorageData = JSON.parse(decrypted);

      return storageData.profiles || [];
    } catch (error) {
      console.error('Profile load error:', error);
      // フォールバック：暗号化されていないデータを試す
      try {
        const fallbackData = StorageService.load<ProfileStorageData>(
          STORAGE_KEYS.PROFILES
        );
        return fallbackData?.profiles || [];
      } catch {
        return [];
      }
    }
  }

  /**
   * すべてのプロフィールを保存
   */
  static async saveAll(profiles: IssuerProfile[]): Promise<boolean> {
    try {
      const storageData: ProfileStorageData = {
        profiles,
        version: DATA_VERSION,
        lastBackup: new Date().toISOString(),
      };

      // データを暗号化
      const encrypted = await this.encryption.encrypt(
        JSON.stringify(storageData)
      );

      return StorageService.save(STORAGE_KEYS.PROFILES, encrypted);
    } catch (error) {
      console.error('Profile save error:', error);
      return false;
    }
  }

  /**
   * プロフィールの作成
   */
  static async create(data: CreateProfileData): Promise<IssuerProfile> {
    const profiles = await this.loadAll();
    
    const newProfile: IssuerProfile = {
      id: this.generateId(),
      personalInfo: data.personalInfo,
      bankInfo: data.bankInfo,
      taxInfo: data.taxInfo,
      meta: {
        profileName: data.meta?.profileName || '新しいプロフィール',
        isDefault: profiles.length === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    profiles.push(newProfile);
    await this.saveAll(profiles);

    return newProfile;
  }

  /**
   * プロフィールの更新
   */
  static async update(
    id: string, 
    updates: UpdateProfileData
  ): Promise<boolean> {
    const profiles = await this.loadAll();
    const index = profiles.findIndex(p => p.id === id);

    if (index === -1) {
      return false;
    }

    profiles[index] = {
      ...profiles[index],
      ...updates,
      id: profiles[index].id, // IDは変更不可
      meta: {
        ...profiles[index].meta,
        ...updates.meta,
        updatedAt: new Date().toISOString(),
      },
    };

    return await this.saveAll(profiles);
  }

  /**
   * プロフィールの削除
   */
  static async delete(id: string): Promise<boolean> {
    const profiles = await this.loadAll();
    const index = profiles.findIndex(p => p.id === id);

    if (index === -1) {
      return false;
    }

    const wasDefault = profiles[index].meta.isDefault;
    profiles.splice(index, 1);

    // デフォルトプロフィールを削除した場合、最初のプロフィールをデフォルトに
    if (wasDefault && profiles.length > 0) {
      profiles[0].meta.isDefault = true;
    }

    return await this.saveAll(profiles);
  }

  /**
   * デフォルトプロフィールの設定
   */
  static async setDefault(id: string): Promise<boolean> {
    const profiles = await this.loadAll();
    
    profiles.forEach(profile => {
      profile.meta.isDefault = profile.id === id;
    });

    return await this.saveAll(profiles);
  }

  /**
   * デフォルトプロフィールの取得
   */
  static async getDefault(): Promise<IssuerProfile | null> {
    const profiles = await this.loadAll();
    return profiles.find(p => p.meta.isDefault) || profiles[0] || null;
  }

  /**
   * IDで検索
   */
  static async findById(id: string): Promise<IssuerProfile | null> {
    const profiles = await this.loadAll();
    return profiles.find(p => p.id === id) || null;
  }

  /**
   * ユニークIDの生成
   */
  private static generateId(): string {
    return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * データのエクスポート
   */
  static async exportData(): Promise<string> {
    const profiles = await this.loadAll();
    const exportData = {
      profiles,
      version: DATA_VERSION,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * データのインポート
   */
  static async importData(jsonString: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonString);
      
      if (!importData.profiles || !Array.isArray(importData.profiles)) {
        throw new Error('Invalid data format');
      }

      return await this.saveAll(importData.profiles);
    } catch (error) {
      console.error('Profile import error:', error);
      return false;
    }
  }
}
