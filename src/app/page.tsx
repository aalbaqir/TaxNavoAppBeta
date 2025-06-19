"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10 animate-bg-blobs pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-300 opacity-40 rounded-full mix-blend-multiply filter blur-3xl top-1/4 left-1/4 animate-blob1" />
        <div className="absolute w-96 h-96 bg-purple-300 opacity-40 rounded-full mix-blend-multiply filter blur-3xl top-1/3 left-1/2 animate-blob2" />
        <div className="absolute w-96 h-96 bg-pink-300 opacity-40 rounded-full mix-blend-multiply filter blur-3xl top-1/2 left-1/3 animate-blob3" />
      </div>
      <div className="z-10 flex flex-col items-center justify-center text-center w-full max-w-md mx-auto p-6 bg-white/80 rounded-2xl shadow-xl backdrop-blur-md">
        <Image
          src="/taxnavo-logo.png"
          alt="taxnavo logo"
          width={80}
          height={80}
          priority
          className="mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 drop-shadow-lg mb-4 select-none">
          Welcome to taxnavo
        </h1>
        <p className="text-lg md:text-xl text-blue-900/80 mb-8 select-none">
          Your modern tax navigation companion
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="w-full px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
            onClick={() => router.push("/main/signin")}
          >
            Log In
          </button>
          <button
            className="w-full px-6 py-3 rounded-full bg-white text-blue-600 font-bold text-lg shadow-lg border border-blue-600 hover:bg-blue-50 transition-all duration-200"
            onClick={() => router.push("/main/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
