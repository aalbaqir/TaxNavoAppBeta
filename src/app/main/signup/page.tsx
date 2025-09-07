"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validateEmail(email: string) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password: string) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include uppercase, lowercase, and a number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Call API to register user
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.replace("/main/signin"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Sign Up</h1>
        <label className="block mb-4">
          <span className="block mb-1">Email</span>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label className="block mb-4">
          <span className="block mb-1">Password</span>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          <span className="text-xs text-gray-500">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</span>
        </label>
        <label className="block mb-6">
          <span className="block mb-1">Confirm Password</span>
          <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </label>
        {error && <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>}
        {success && <div className="mb-4 text-green-700 text-sm font-semibold">Account created! Redirecting...</div>}
        <button type="submit" className="w-full px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200">
          Sign Up
        </button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/main/signin" className="text-blue-700 underline">Log In</a>
        </div>
      </form>
    </div>
  );
}
