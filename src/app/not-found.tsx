'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-6 text-center text-gray-500 max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/main">
          <span className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Go Home</span>
        </Link>
      </div>
    </main>
  );
}
