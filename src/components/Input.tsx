import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        {...props}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
