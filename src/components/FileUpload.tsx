import React from "react";

export interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function FileUpload({ label, onChange, error }: FileUploadProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="file"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
