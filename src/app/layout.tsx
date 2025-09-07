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
      <body className="font-sans bg-white min-h-screen antialiased">
        <div className="animated-bg">
          <div className="animated-bg-blob animated-bg-blob1" />
          <div className="animated-bg-blob animated-bg-blob2" />
          <div className="animated-bg-blob animated-bg-blob3" />
        </div>
        <SessionWrapper>
          <header className="w-full flex items-center justify-between py-6 bg-gray-900 shadow-lg sticky top-0 z-30 backdrop-blur-md px-4">
            <div className="flex items-center">
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
              <span className="ml-4 text-2xl font-bold text-white tracking-tight font-poppins hidden md:inline-block">
                TaxNavo
              </span>
            </div>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center w-full">
            {children}
          </main>
          <footer className="w-full bg-gray-900 py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner mt-12 border-t border-blue-100 dark:border-cyan-900">
            <div className="flex items-center gap-3">
              <Image
                src="/taxnavo-logo.png"
                alt="TaxNavo Logo"
                width={36}
                height={36}
                className="drop-shadow"
              />
              <span className="font-semibold text-white font-poppins">
                TaxNavo © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-6 text-white text-lg">
              <a
                href="https://github.com/taxnavo"
                target="_blank"
                rel="noopener"
                className="hover:underline hover:text-blue-300 transition"
              >
                GitHub
              </a>
              <a
                href="mailto:support@taxnavo.com"
                className="hover:underline hover:text-blue-300 transition"
              >
                Contact
              </a>
            </div>
            <span className="text-xs text-blue-200 font-mono">
              Powered by Next.js & Tailwind CSS
            </span>
          </footer>
        </SessionWrapper>
        {/* Removed <style jsx global> in favor of Tailwind and global CSS */}
      </body>
    </html>
  );
}
