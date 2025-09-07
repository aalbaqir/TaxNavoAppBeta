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

// TurboTax-style card example
// <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-auto">
//   <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center font-heading">Sign In</h1>
//   <form className="space-y-6">
//     <label className="block">
//       <span className="block text-gray-800 font-semibold mb-2">Email</span>
//       <input className="w-full border border-blue-200 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition" type="email" required />
//     </label>
//     <label className="block">
//       <span className="block text-gray-800 font-semibold mb-2">Password</span>
//       <input className="w-full border border-blue-200 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition" type="password" required />
//     </label>
//     <button type="submit" className="w-full bg-gray-900 text-white rounded-full px-6 py-3 font-bold text-lg shadow-md hover:bg-gray-800 transition">Sign In</button>
//   </form>
// </div>
