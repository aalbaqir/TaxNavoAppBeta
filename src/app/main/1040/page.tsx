import React from "react";
import { useRouter } from "next/navigation";

// Dummy 1040 fields for demonstration
const fields = [
  { label: "First Name and Initial", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Social Security Number", key: "ssn" },
  { label: "Address", key: "address" },
  { label: "Filing Status", key: "filingStatus" },
  { label: "Total Income", key: "totalIncome" },
  { label: "Taxable Income", key: "taxableIncome" },
  { label: "Tax Owed", key: "taxOwed" },
  { label: "Refund", key: "refund" },
];

// TODO: Replace with real data fetching from user's profile/intake
const getPrefilledData = () => ({
  firstName: "John",
  lastName: "Doe",
  ssn: "123-45-6789",
  address: "123 Main St, City, ST 12345",
  filingStatus: "Single",
  totalIncome: "55000",
  taxableIncome: "50000",
  taxOwed: "2000",
  refund: "500",
});

export default function Fillable1040Page() {
  const router = useRouter();
  const [form, setForm] = React.useState(getPrefilledData());

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">IRS Form 1040 (Preview)</h1>
        <form className="space-y-4 bg-blue-50 rounded-xl p-6 shadow">
          {fields.map(field => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="font-medium text-blue-800">{field.label}</label>
              <input
                className="rounded border border-blue-200 px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                name={field.key}
                autoComplete="off"
              />
            </div>
          ))}
        </form>
        <div className="mt-8 text-xs text-gray-500">This is a preview. Your data is automatically filled from your intake. Please review and update as needed before submission.</div>
      </div>
      <button
        className="mt-4 w-full max-w-xs px-6 py-2 rounded bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 transition"
        onClick={() => router.back()}
      >
        ← Back
      </button>
    </div>
  );
}
