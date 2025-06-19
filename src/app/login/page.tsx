import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/main",
    });
    if (res && res.error) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <Image src="/taxnavo-logo.png" alt="Taxnavo Logo" width={80} height={80} className="mb-4" />
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Sign in to Taxnavo</h1>
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-blue-800">Email</label>
          <input
            type="email"
            className="w-full mb-4 px-4 py-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label className="block mb-2 font-medium text-blue-800">Password</label>
          <input
            type="password"
            className="w-full mb-4 px-4 py-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
