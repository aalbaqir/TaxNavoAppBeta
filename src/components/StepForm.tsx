import React from "react";

export interface StepFormProps {
  title: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showNext?: boolean;
  showBack?: boolean;
  disabled?: boolean;
}

export default function StepForm({
  title,
  children,
  onNext,
  onBack,
  nextLabel = "Next",
  backLabel = "Back",
  showNext = true,
  showBack = true,
  disabled = false,
}: StepFormProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-2xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">{title}</h2>
      <div>{children}</div>
      <div className="flex justify-between mt-8">
        {showBack ? (
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-gray-100 text-blue-700 font-semibold hover:bg-gray-200 transition"
            onClick={onBack}
          >
            {backLabel}
          </button>
        ) : <div />}
        {showNext && (
          <button
            type="button"
            className="px-8 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            onClick={onNext}
            disabled={disabled}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
