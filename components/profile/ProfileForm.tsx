/**
 * プロフィール入力フォームコンポーネント
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IssuerProfileSchema, IssuerProfileFormData } from '@/utils/validation';
import { IssuerProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface ProfileFormProps {
  profile?: IssuerProfile;
  onSubmit: (data: IssuerProfileFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IssuerProfileFormData>({
    resolver: zodResolver(IssuerProfileSchema),
    defaultValues: profile || {
      personalInfo: {
        name: '',
        businessName: '',
        postalCode: '',
        address: '',
        phone: '',
        email: '',
      },
      bankInfo: {
        bankName: '',
        branchName: '',
        accountType: '普通',
        accountNumber: '',
        accountHolder: '',
      },
      taxInfo: {
        invoiceNumber: '',
        taxMethod: 'included',
      },
      meta: {
        profileName: '',
        isDefault: false,
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* プロフィール名 */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">📝 プロフィール名</h3>
        <Input
          label="プロフィール名"
          placeholder="例: メインプロフィール、屋号A、個人事業主用"
          required
          error={errors.meta?.profileName?.message}
          {...register('meta.profileName')}
        />
        <p className="text-sm text-gray-500 mt-2">
          複数のプロフィールを使い分ける場合の識別名です
        </p>
      </section>

      {/* 基本情報 */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">👤 基本情報</h3>
        <div className="space-y-4">
          <Input
            label="氏名・屋号"
            placeholder="例: 山田太郎"
            required
            error={errors.personalInfo?.name?.message}
            {...register('personalInfo.name')}
          />
          
          <Input
            label="事業者名"
            placeholder="例: 山田デザイン事務所（任意）"
            error={errors.personalInfo?.businessName?.message}
            {...register('personalInfo.businessName')}
          />

          <Input
            label="郵便番号"
            placeholder="例: 123-4567"
            required
            error={errors.personalInfo?.postalCode?.message}
            {...register('personalInfo.postalCode')}
            helperText="ハイフン付きで入力してください"
          />

          <Textarea
            label="住所"
            placeholder="例: 東京都渋谷区..."
            required
            rows={2}
            error={errors.personalInfo?.address?.message}
            {...register('personalInfo.address')}
          />

          <Input
            label="電話番号"
            placeholder="例: 090-1234-5678（任意）"
            error={errors.personalInfo?.phone?.message}
            {...register('personalInfo.phone')}
          />

          <Input
            label="メールアドレス"
            type="email"
            placeholder="例: yamada@example.com（任意）"
            error={errors.personalInfo?.email?.message}
            {...register('personalInfo.email')}
          />
        </div>
      </section>

      {/* 銀行口座情報 */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">💳 銀行口座情報</h3>
        <div className="space-y-4">
          <Input
            label="銀行名"
            placeholder="例: みずほ銀行"
            required
            error={errors.bankInfo?.bankName?.message}
            {...register('bankInfo.bankName')}
          />

          <Input
            label="支店名"
            placeholder="例: 渋谷支店"
            required
            error={errors.bankInfo?.branchName?.message}
            {...register('bankInfo.branchName')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              口座種別 <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('bankInfo.accountType')}
            >
              <option value="普通">普通</option>
              <option value="当座">当座</option>
            </select>
            {errors.bankInfo?.accountType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bankInfo.accountType.message}
              </p>
            )}
          </div>

          <Input
            label="口座番号"
            placeholder="例: 1234567"
            required
            error={errors.bankInfo?.accountNumber?.message}
            {...register('bankInfo.accountNumber')}
            helperText="数字のみ入力してください"
          />

          <Input
            label="口座名義"
            placeholder="例: ヤマダ タロウ"
            required
            error={errors.bankInfo?.accountHolder?.message}
            {...register('bankInfo.accountHolder')}
            helperText="カタカナで入力してください"
          />
        </div>
      </section>

      {/* 税務情報 */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">📄 税務情報</h3>
        <div className="space-y-4">
          <Input
            label="適格請求書発行事業者番号"
            placeholder="例: T1234567890123（任意）"
            error={errors.taxInfo?.invoiceNumber?.message}
            {...register('taxInfo.invoiceNumber')}
            helperText="T + 13桁の数字（インボイス制度対応）"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              源泉徴収税の計算方法（デフォルト） <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="included"
                  className="mt-1"
                  {...register('taxInfo.taxMethod')}
                />
                <div>
                  <div className="font-medium">消費税込みで計算（原則）</div>
                  <div className="text-sm text-gray-600">
                    (税抜金額 + 消費税) × 10.21% を源泉徴収
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="separate"
                  className="mt-1"
                  {...register('taxInfo.taxMethod')}
                />
                <div>
                  <div className="font-medium">消費税を区分して計算（例外）</div>
                  <div className="text-sm text-gray-600">
                    税抜金額 × 10.21% を源泉徴収（請求書に明記が必要）
                  </div>
                </div>
              </label>
            </div>
            {errors.taxInfo?.taxMethod && (
              <p className="mt-1 text-sm text-red-600">
                {errors.taxInfo.taxMethod.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              ℹ️ 国税庁「No.6929」に準拠した計算方法です。請求書作成時に変更も可能です。
            </p>
          </div>
        </div>
      </section>

      {/* アクションボタン */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          💾 保存する
        </Button>
      </div>
    </form>
  );
};
