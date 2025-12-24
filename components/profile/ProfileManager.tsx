/**
 * プロフィール管理メインコンポーネント
 */

'use client';

import React, { useState, useRef } from 'react';
import { IssuerProfile, CreateProfileData } from '@/types';
import { useProfileManager } from '@/hooks/useProfileManager';
import { ProfileCard } from './ProfileCard';
import { ProfileForm } from './ProfileForm';
import { Button } from '@/components/ui/Button';

type ViewMode = 'list' | 'create' | 'edit';

export const ProfileManager: React.FC = () => {
  const {
    profiles,
    defaultProfile,
    isLoading,
    error,
    addProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
    exportData,
    importData,
    clearError,
  } = useProfileManager();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingProfile, setEditingProfile] = useState<IssuerProfile | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // プロフィール作成
  const handleCreate = async (data: any) => {
    const profileData: CreateProfileData = {
      personalInfo: data.personalInfo,
      bankInfo: data.bankInfo,
      taxInfo: data.taxInfo,
      meta: {
        profileName: data.meta.profileName,
      },
    };

    const id = await addProfile(profileData);
    
    if (id) {
      alert('✅ 発行者情報を保存しました！');
      setViewMode('list');
    } else {
      alert('❌ プロフィールの保存に失敗しました');
    }
  };

  // プロフィール更新
  const handleUpdate = async (data: any) => {
    if (!editingProfile) return;

    const success = await updateProfile(editingProfile.id, {
      personalInfo: data.personalInfo,
      bankInfo: data.bankInfo,
      taxInfo: data.taxInfo,
      meta: {
        ...editingProfile.meta,
        profileName: data.meta.profileName,
      },
    });

    if (success) {
      alert('✅ 発行者情報を更新しました！');
      setViewMode('list');
      setEditingProfile(undefined);
    } else {
      alert('❌ プロフィールの更新に失敗しました');
    }
  };

  // プロフィール削除
  const handleDelete = async (id: string, profileName: string) => {
    const success = await deleteProfile(id, profileName);
    
    if (success) {
      alert('✅ 請求元情報を削除しました');
    }
  };

  // デフォルト設定
  const handleSetDefault = async (id: string) => {
    const success = await setDefaultProfile(id);
    
    if (success) {
      alert('✅ デフォルト請求元情報を設定しました');
    }
  };

  // 編集開始
  const handleEdit = (profile: IssuerProfile) => {
    setEditingProfile(profile);
    setViewMode('edit');
  };

  // キャンセル
  const handleCancel = () => {
    setViewMode('list');
    setEditingProfile(undefined);
  };

  // エクスポート
  const handleExport = async () => {
    const success = await exportData();
    
    if (success) {
      alert('✅ データをエクスポートしました！\nダウンロードしたJSONファイルを安全な場所に保管してください。');
    } else {
      alert('❌ エクスポートに失敗しました');
    }
  };

  // インポート
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      '⚠️ インポートすると現在のデータが上書きされます。\n続行しますか？'
    );

    if (!confirmed) {
      event.target.value = '';
      return;
    }

    const success = await importData(file);
    
    if (success) {
      alert('✅ データをインポートしました！');
      window.location.reload();
    } else {
      alert('❌ インポートに失敗しました\nファイルの形式を確認してください');
    }

    event.target.value = '';
  };

  // リスト表示
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">発行者情報</h2>
            <p className="text-gray-600 mt-1">
              発行者情報を保存して、請求書作成を効率化しましょう
            </p>
          </div>
          <Button onClick={() => setViewMode('create')}>
            ➕ 新しい発行者情報
          </Button>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-800 font-medium">エラーが発生しました</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* データ保存に関する重要な注意 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-2xl flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                データ保存に関する重要なお知らせ
              </h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <p className="font-medium">
                  発行者情報は<strong>あなたのブラウザ内にのみ</strong>保存されます。
                </p>
                <p>
                  以下の場合、データが消失します：
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>ブラウザのキャッシュ・ Cookie を削除したとき</li>
                  <li>シークレットモードで使用したとき</li>
                  <li>別のブラウザ・デバイスで使用したとき</li>
                  <li>ブラウザを再インストールしたとき</li>
                </ul>
                <p className="font-medium text-yellow-900 mt-3">
                  💾 <strong>定期的にバックアップを取ることを強く推奨します！</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* バックアップセクション */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💾 データのバックアップ（推奨）
          </h3>
          <p className="text-sm text-gray-600 mb-4">
発行者情報をJSONファイルとしてエクスポート・インポートできます。<br />
            <strong>データ消失防止</strong>のため、定期的にエクスポートして保存しておくことをお勧めします。
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              disabled={profiles.length === 0}
            >
              📥 エクスポート
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              📤 インポート
            </Button>
          </div>
        </div>

        {/* プロフィール一覧 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-2">読み込み中...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              発行者情報がありません
            </h3>
            <p className="text-gray-600 mb-4">
              最初の発行者情報を作成して、請求書作成を始めましょう
            </p>
            <Button onClick={() => setViewMode('create')}>
              ➕ 発行者情報を作成
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isDefault={profile.id === defaultProfile?.id}
                onEdit={() => handleEdit(profile)}
                onDelete={() => handleDelete(profile.id, profile.meta.profileName)}
                onSetDefault={() => handleSetDefault(profile.id)}
              />
            ))}
          </div>
        )}

        {/* 使い方ガイド */}
        {profiles.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 使い方のヒント
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">1.</span>
                <span>デフォルトに設定した請求元情報が請求書作成時に自動選択されます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">2.</span>
                <span>複数の屋号や事業形態がある場合は、それぞれ請求元情報を作成できます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">3.</span>
                <span>定期的にエクスポートして、バックアップを取ることをお勧めします</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  // フォーム表示（作成・編集）
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {viewMode === 'create' ? '新しい発行者情報作成' : '発行者情報編集'}
        </h2>
        <p className="text-gray-600 mt-1">
          請求書に記載する発行者情報を入力してください
        </p>
      </div>

      {/* フォーム */}
      <ProfileForm
        profile={editingProfile}
        onSubmit={viewMode === 'create' ? handleCreate : handleUpdate}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
