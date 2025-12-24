/**
 * プロフィール管理カスタムフック
 */

'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { CreateProfileData, UpdateProfileData } from '@/types';
import { ProfileService } from '@/services/ProfileService';
import { downloadFile } from '@/lib/utils';

export function useProfileManager() {
  const {
    profiles,
    defaultProfile,
    isLoading,
    error,
    loadProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
    clearError,
  } = useProfileStore();

  // 初期読み込み
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // プロフィールの追加
  const handleAddProfile = async (data: CreateProfileData) => {
    const id = await addProfile(data);
    return id;
  };

  // プロフィールの更新
  const handleUpdateProfile = async (id: string, data: UpdateProfileData) => {
    const success = await updateProfile(id, data);
    return success;
  };

  // プロフィールの削除（確認付き）
  const handleDeleteProfile = async (id: string, profileName: string) => {
    const confirmed = window.confirm(
      `「${profileName}」を削除してもよろしいですか？\nこの操作は取り消せません。`
    );
    
    if (!confirmed) {
      return false;
    }

    const success = await deleteProfile(id);
    return success;
  };

  // デフォルトプロフィールの設定
  const handleSetDefaultProfile = async (id: string) => {
    const success = await setDefaultProfile(id);
    return success;
  };

  // データのエクスポート
  const handleExportData = async () => {
    try {
      const jsonString = await ProfileService.exportData();
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `invoice-backup-${timestamp}.json`;
      
      downloadFile(jsonString, filename, 'application/json');
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      return false;
    }
  };

  // データのインポート
  const handleImportData = async (file: File) => {
    try {
      const jsonString = await file.text();
      const success = await ProfileService.importData(jsonString);
      
      if (success) {
        // データを再読み込み
        await loadProfiles();
      }
      
      return success;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  };

  return {
    // 状態
    profiles,
    defaultProfile,
    isLoading,
    error,
    
    // アクション
    addProfile: handleAddProfile,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
    setDefaultProfile: handleSetDefaultProfile,
    exportData: handleExportData,
    importData: handleImportData,
    clearError,
  };
}
