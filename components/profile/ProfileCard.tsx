/**
 * プロフィールカードコンポーネント
 */

'use client';

import React from 'react';
import { IssuerProfile } from '@/types';
import { Button } from '@/components/ui/Button';

interface ProfileCardProps {
  profile: IssuerProfile;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div className={`
      bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow
      ${isDefault ? 'ring-2 ring-primary-500' : ''}
    `}>
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.meta.profileName}
            </h3>
            {isDefault && (
              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                デフォルト
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            更新日: {new Date(profile.meta.updatedAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="space-y-3 mb-4">
        <InfoRow label="氏名" value={profile.personalInfo.name} />
        {profile.personalInfo.businessName && (
          <InfoRow label="事業者名" value={profile.personalInfo.businessName} />
        )}
        <InfoRow label="住所" value={profile.personalInfo.address} />
      </div>

      {/* 銀行口座情報 */}
      <div className="border-t pt-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">💳 銀行口座</p>
        <div className="space-y-2">
          <InfoRow 
            label="口座" 
            value={`${profile.bankInfo.bankName} ${profile.bankInfo.branchName}`} 
            small
          />
          <InfoRow 
            label="番号" 
            value={`${profile.bankInfo.accountType} ${profile.bankInfo.accountNumber}`} 
            small
          />
        </div>
      </div>

      {/* 税務情報 */}
      {profile.taxInfo.invoiceNumber && (
        <div className="border-t pt-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">📄 税務情報</p>
          <InfoRow 
            label="インボイス番号" 
            value={profile.taxInfo.invoiceNumber} 
            small
          />
        </div>
      )}

      {/* アクション */}
      <div className="flex gap-2 mt-4 pt-4 border-t">
        {!isDefault && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onSetDefault}
            className="flex-1"
          >
            デフォルトに設定
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="flex-1"
        >
          ✏️ 編集
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          className="flex-1"
        >
          🗑️ 削除
        </Button>
      </div>
    </div>
  );
};

// 情報行コンポーネント
interface InfoRowProps {
  label: string;
  value: string;
  small?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, small }) => {
  return (
    <div className={`flex ${small ? 'text-xs' : 'text-sm'}`}>
      <span className="text-gray-500 w-24 flex-shrink-0">{label}:</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
};
