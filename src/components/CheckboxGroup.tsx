import React from "react";

export interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export default function CheckboxGroup({ label, options, values, onChange, error }: CheckboxGroupProps) {
  function handleChange(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }
  return (
    <div className="mb-4">
      <div className="block text-sm font-medium mb-1">{label}</div>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={values.includes(opt.value)}
              onChange={() => handleChange(opt.value)}
              className="accent-blue-600 rounded"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
