"use client";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session) {
    router.replace("/main/profile");
    return <div className="p-8">Redirecting to your profile...</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.replace("/main/profile");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <label className="block mb-4">
          <span className="block mb-1">Email</span>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label className="block mb-6">
          <span className="block mb-1">Password</span>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Sign In</button>
      </form>
    </div>
  );
}
