/**
 * 請求書作成フォームコンポーネント
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInvoiceSchema, CreateInvoiceFormData } from '@/utils/validation';
import { IssuerProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useInvoiceCalculation } from '@/hooks/useInvoiceCalculation';
import { CalculationDisplay } from './CalculationDisplay';
import { StepIndicator } from './StepIndicator';
import { formatCurrency } from '@/utils/calculations';

interface InvoiceFormProps {
  defaultProfile: IssuerProfile | null;
  onSubmit: (data: CreateInvoiceFormData) => void;
  isLoading?: boolean;
}

const STEPS = [
  { number: 1, title: '発行者情報', description: 'プロフィール選択' },
  { number: 2, title: '請求内容', description: 'クライアント・項目入力' },
  { number: 3, title: '確認・生成', description: 'PDF生成' },
];

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  defaultProfile,
  onSubmit,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { calculateItem, useRealTimeCalculation } = useInvoiceCalculation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      client: {
        name: '',
        companyName: '',
        department: '',
        address: '',
        email: '',
      },
      items: [
        {
          id: '1',
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        },
      ],
      hasWithholding: true,
      taxMethod: defaultProfile?.taxInfo.taxMethod || 'included',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // フォームの監視
  const watchItems = watch('items');
  const watchHasWithholding = watch('hasWithholding');
  const watchTaxMethod = watch('taxMethod');

  // watchItems の変更を検知するための文字列化
  const watchItemsStr = JSON.stringify(watchItems?.map(item => ({
    quantity: item?.quantity,
    unitPrice: item?.unitPrice,
    amount: item?.amount
  })));

  // リアルタイム計算
  const calculation = useRealTimeCalculation(
    watchItems,
    watchHasWithholding,
    watchTaxMethod
  );

  // 項目の金額を自動計算
  const handleItemChange = (index: number) => {
    const item = watchItems[index];
    if (!item) return;
    
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const amount = calculateItem(quantity, unitPrice);
    
    setValue(`items.${index}.amount`, amount, { shouldValidate: true });
  };

  // 項目が変更されたら自動的に金額を更新
  useEffect(() => {
    if (!watchItems || watchItems.length === 0) return;
    
    let hasChanges = false;
    watchItems.forEach((item, index) => {
      if (!item) return;
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const newAmount = quantity * unitPrice;
      
      // 現在の金額と異なる場合のみ更新
      if (item.amount !== newAmount) {
        setValue(`items.${index}.amount`, newAmount, { shouldValidate: false });
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      console.log('金額を自動計算しました', watchItems);
    }
  }, [watchItemsStr, setValue]);

  // 項目追加
  const handleAddItem = () => {
    append({
      id: String(Date.now()),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  };

  // 次のステップ
  const handleNext = async () => {
    if (currentStep === 2) {
      // Step 2 の場合はバリデーションを実行
      const isValid = await trigger();
      
      if (!isValid) {
        // バリデーションエラーがある場合はアラートを表示
        let errorMessage = '❌ 以下の項目を確認してください：\n';
        
        if (errors.client?.name) {
          errorMessage += '\n・ クライアント名が未入力です';
        }
        
        if (errors.items && Array.isArray(errors.items)) {
          errors.items.forEach((item, index) => {
            if (item?.description) {
              errorMessage += `\n・ 項目${index + 1}の作業内容が未入力です`;
            }
            if (item?.quantity) {
              errorMessage += `\n・ 項目${index + 1}の数量は1以上にしてください`;
            }
            if (item?.unitPrice) {
              errorMessage += `\n・ 項目${index + 1}の単価は1以上にしてください`;
            }
          });
        }
        
        alert(errorMessage);
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 前のステップ
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ステップインジケーター */}
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step 1: 発行者情報 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">👤 発行者情報</h3>
            {defaultProfile ? (
              <div className="space-y-3">
                <InfoDisplay label="氏名" value={defaultProfile.personalInfo.name} />
                <InfoDisplay label="住所" value={defaultProfile.personalInfo.address} />
                <InfoDisplay
                  label="銀行口座"
                  value={`${defaultProfile.bankInfo.bankName} ${defaultProfile.bankInfo.branchName}`}
                />
                {defaultProfile.taxInfo.invoiceNumber && (
                  <InfoDisplay
                    label="適格請求書番号"
                    value={defaultProfile.taxInfo.invoiceNumber}
                  />
                )}
                <div className="mt-4 p-3 bg-green-50 rounded text-sm text-green-800">
                  ✅ デフォルト発行者情報が選択されています
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded text-yellow-800">
                ⚠️ 発行者情報が設定されていません。
                <a href="/profile" className="underline ml-2">
                  発行者情報
                </a>
                から設定してください。
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleNext}
              disabled={!defaultProfile}
            >
              次へ →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: 請求内容 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* クライアント情報 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">🏢 クライアント情報</h3>
            <div className="space-y-4">
              <Input
                label="クライアント名"
                placeholder="例: 山田太郎 様"
                required
                error={errors.client?.name?.message}
                {...register('client.name')}
              />
              <Input
                label="会社名"
                placeholder="例: 株式会社ABC（任意）"
                error={errors.client?.companyName?.message}
                {...register('client.companyName')}
              />
            </div>
          </div>

          {/* 請求項目 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">📋 請求項目</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <Input
                        label="作業内容"
                        placeholder="例: Webサイトデザイン"
                        required
                        error={errors.items?.[index]?.description?.message}
                        {...register(`items.${index}.description`)}
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          label="数量"
                          type="number"
                          min="1"
                          required
                          error={errors.items?.[index]?.quantity?.message}
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                            onChange: () => handleItemChange(index),
                          })}
                        />
                        <Input
                          label="単価"
                          type="number"
                          min="1"
                          required
                          error={errors.items?.[index]?.unitPrice?.message}
                          {...register(`items.${index}.unitPrice`, {
                            valueAsNumber: true,
                            onChange: () => handleItemChange(index),
                          })}
                        />
                        <Input
                          label="金額"
                          type="number"
                          readOnly
                          value={watchItems[index]?.amount || 0}
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => remove(index)}
                        className="mt-8"
                      >
                        削除
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddItem}
                className="w-full"
              >
                ➕ 項目を追加
              </Button>
            </div>
          </div>

          {/* 源泉徴収設定 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">⚙️ 設定</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    {...register('hasWithholding')}
                  />
                  <span className="font-medium">源泉徴収税を適用する</span>
                </label>
              </div>

              {watchHasWithholding && (
                <div className="pl-7 space-y-2">
                  <label className="flex items-start gap-2">
                    <input
                      type="radio"
                      value="included"
                      {...register('taxMethod')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">消費税込みで計算（原則）</div>
                      <div className="text-sm text-gray-600">
                        (税抜金額 + 消費税) × 10.21%
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-2">
                    <input
                      type="radio"
                      value="separate"
                      {...register('taxMethod')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">消費税を区分して計算（例外）</div>
                      <div className="text-sm text-gray-600">
                        税抜金額 × 10.21%
                      </div>
                    </div>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="発行日"
                  type="date"
                  required
                  {...register('issueDate')}
                />
                <Input
                  label="支払期限"
                  type="date"
                  required
                  {...register('dueDate')}
                />
              </div>

              <Textarea
                label="備考"
                placeholder="その他の特記事項（任意）"
                rows={3}
                {...register('notes')}
              />
            </div>
          </div>

          {/* 計算結果 */}
          <CalculationDisplay calculation={calculation} />

          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={handlePrev}>
              ← 戻る
            </Button>
            <Button type="button" onClick={handleNext}>
              確認へ →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: 確認・生成 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">✅ 請求書の確認</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                以下の内容で請求書を生成します。内容を確認してください。
              </p>

              {/* クライアント情報の確認 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🏢 請求先</h4>
                <p className="text-sm text-gray-700">
                  {watchItems[0] && (
                    <>
                      {watch('client.companyName') && (
                        <span>{watch('client.companyName')}<br /></span>
                      )}
                      {watch('client.name')} 様
                    </>
                  )}
                </p>
              </div>

              {/* 請求項目の確認 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 請求項目</h4>
                <div className="space-y-2">
                  {watchItems.map((item, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {item.description} × {item.quantity} = ¥{formatCurrency(item.amount)}
                    </div>
                  ))}
                </div>
              </div>

              {/* 計算結果 */}
              <CalculationDisplay calculation={calculation} />

              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-gray-700">
                  ✅ 「請求書を生成」をクリックすると、PDFプレビューが表示されます。
                  プレビューで内容を確認後、ダウンロードできます。
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={handlePrev}>
              ← 戻る
            </Button>
            <Button type="submit" isLoading={isLoading}>
              🎉 請求書を生成
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

// 情報表示コンポーネント
const InfoDisplay: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex text-sm">
    <span className="text-gray-500 w-32">{label}:</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);
