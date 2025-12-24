/**
 * ステップインジケーターコンポーネント
 */

'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* ステップ */}
            <div className="flex flex-col items-center flex-1">
              {/* 円 */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  transition-all duration-300
                  ${
                    currentStep === step.number
                      ? 'bg-primary-600 text-white scale-110 ring-4 ring-primary-100'
                      : currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>

              {/* タイトルと説明 */}
              <div className="mt-3 text-center">
                <p
                  className={`
                    text-sm font-semibold
                    ${
                      currentStep === step.number
                        ? 'text-primary-600'
                        : currentStep > step.number
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }
                  `}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* 線（最後以外） */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 mt-[-40px]">
                <div
                  className={`
                    h-full transition-all duration-300
                    ${
                      currentStep > step.number
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
