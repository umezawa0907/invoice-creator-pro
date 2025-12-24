/**
 * ローカルストレージ管理サービス
 */

import { STORAGE_KEYS } from '@/utils/constants';

export class StorageService {
  /**
   * データの保存
   */
  static save<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }

  /**
   * データの読み込み
   */
  static load<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  }

  /**
   * データの削除
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  /**
   * すべてのデータをクリア
   */
  static clear(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * データの存在確認
   */
  static exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * ストレージサイズの取得（概算）
   */
  static getSize(): number {
    let size = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        size += item.length * 2; // UTF-16で2バイト
      }
    });
    return size;
  }

  /**
   * すべてのデータをエクスポート
   */
  static exportAll(): Record<string, unknown> {
    const exported: Record<string, unknown> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const data = this.load(key);
      if (data) {
        exported[name] = data;
      }
    });
    return exported;
  }

  /**
   * データのインポート
   */
  static importAll(data: Record<string, unknown>): boolean {
    try {
      Object.entries(data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS];
        if (key) {
          this.save(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage import error:', error);
      return false;
    }
  }
}
