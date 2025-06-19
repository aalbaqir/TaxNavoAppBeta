import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TaxNavo | Modern Tax Intake",
  description: "A beautiful, modern, and engaging tax intake app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-gradient-to-br from-blue-100 via-cyan-50 to-white min-h-screen antialiased">
        <SessionWrapper>
          <header className="w-full flex items-center justify-center py-6 bg-white/80 shadow-lg sticky top-0 z-30 backdrop-blur-md">
            <Link href="/">
              <Image
                src="/taxnavo-logo.png"
                alt="taxnavo logo"
                width={56}
                height={56}
                className="drop-shadow-xl hover:scale-110 transition-transform duration-200"
                priority
              />
            </Link>
            <span className="ml-4 text-2xl font-bold text-blue-700 tracking-tight font-poppins hidden md:inline-block">
              TaxNavo
            </span>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center w-full">
            {children}
          </main>
          <footer className="w-full bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-cyan-900 py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner mt-12 border-t border-blue-100 dark:border-cyan-900">
            <div className="flex items-center gap-3">
              <Image
                src="/taxnavo-logo.png"
                alt="TaxNavo Logo"
                width={36}
                height={36}
                className="drop-shadow"
              />
              <span className="font-semibold text-blue-700 dark:text-cyan-200 font-poppins">
                TaxNavo © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-6 text-blue-600 dark:text-cyan-200 text-lg">
              <a
                href="https://github.com/taxnavo"
                target="_blank"
                rel="noopener"
                className="hover:underline hover:text-blue-800 dark:hover:text-cyan-300 transition"
              >
                GitHub
              </a>
              <a
                href="mailto:support@taxnavo.com"
                className="hover:underline hover:text-blue-800 dark:hover:text-cyan-300 transition"
              >
                Contact
              </a>
            </div>
            <span className="text-xs text-blue-400 dark:text-cyan-400 font-mono">
              Powered by Next.js & Tailwind CSS
            </span>
          </footer>
        </SessionWrapper>
        {/* Removed <style jsx global> in favor of Tailwind and global CSS */}
      </body>
    </html>
  );
}
