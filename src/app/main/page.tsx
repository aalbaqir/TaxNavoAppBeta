"use client";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function TaxMain() {
  const router = useRouter();
  // Optionally, you can redirect to /main/2024 automatically
  useEffect(() => {
    router.replace('/main/2024');
  }, [router]);
  return null;
}
