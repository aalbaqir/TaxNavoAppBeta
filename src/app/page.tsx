"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="navbar flex justify-between items-center px-6 py-4 bg-white/90 border-b border-green-100 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <Image src="/taxnavo-logo.png" alt="taxnavo logo" width={40} height={40} className="rounded-lg" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">taxnavo</span>
        </div>
        <div className="hidden md:flex gap-8 text-blue-900/80 font-medium">
          <a href="#features" className="hover:text-blue-700 transition">Features</a>
          <a href="#pricing" className="hover:text-blue-700 transition">Pricing</a>
          <a href="#faq" className="hover:text-blue-700 transition">FAQ</a>
          <a href="#contact" className="hover:text-blue-700 transition">Contact</a>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/main/signin')} className="px-4 py-2 rounded font-semibold text-blue-700 border border-blue-600 bg-white hover:bg-blue-50 transition">Log In</button>
          <button onClick={() => router.push('/main/signup')} className="px-4 py-2 rounded font-semibold text-white bg-blue-700 hover:bg-blue-800 transition">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 drop-shadow-lg">File Your Taxes with Confidence</h1>
        <p className="text-lg md:text-2xl text-blue-900/80 mb-8 max-w-2xl mx-auto">Fast, secure, and easy tax preparation for individuals and families. Trusted by thousands. Get started in minutes and maximize your refund.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button onClick={() => router.push('/main/signup')} className="px-8 py-3 rounded-full bg-blue-700 text-white font-bold text-lg shadow-md hover:bg-blue-800 transition-all">Get Started Free</button>
          <button onClick={() => router.push('http://localhost:3001/main/2024')} className="px-8 py-3 rounded-full bg-white text-blue-700 font-bold text-lg shadow-md border border-blue-700 hover:bg-blue-50 transition-all">Continue as Guest</button>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-700 font-medium text-sm shadow">✓ Secure & Private</div>
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-700 font-medium text-sm shadow">✓ IRS Compliant</div>
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-700 font-medium text-sm shadow">✓ Max Refund Guarantee</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white/80 border-t border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Why Choose taxnavo?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">💡</span>
              <h3 className="font-bold text-lg mb-2">Simple & Guided</h3>
              <p className="text-blue-900/80">Step-by-step questions make tax filing easy, even for beginners.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">🔒</span>
              <h3 className="font-bold text-lg mb-2">Bank-Level Security</h3>
              <p className="text-blue-900/80">Your data is encrypted and protected with industry-leading security.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">⚡</span>
              <h3 className="font-bold text-lg mb-2">Fast Refunds</h3>
              <p className="text-blue-900/80">E-file and get your refund as quickly as possible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-green-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Trusted by thousands of taxpayers</h3>
          <div className="flex flex-wrap justify-center gap-6 text-blue-900/70 text-lg">
            <span>⭐⭐⭐⭐⭐</span>
            <span>"So easy to use!"</span>
            <span>"Saved me hours!"</span>
            <span>"Best tax app I've tried."</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white/90 border-t border-green-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Simple, Transparent Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 flex-1">
              <h3 className="font-bold text-xl mb-2">Free</h3>
              <p className="mb-4 text-blue-900/80">Basic federal tax filing</p>
              <div className="text-3xl font-bold text-blue-700 mb-4">$0</div>
              <button onClick={() => router.push('/main/signup')} className="px-6 py-2 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Start Free</button>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-8 flex-1 shadow-lg">
              <h3 className="font-bold text-xl mb-2">Plus</h3>
              <p className="mb-4 text-blue-900/80">State filing & advanced support</p>
              <div className="text-3xl font-bold text-blue-700 mb-4">$29</div>
              <button onClick={() => router.push('/main/signup')} className="px-6 py-2 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Upgrade</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white/80 border-t border-green-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-blue-700">Is taxnavo really free?</h4>
              <p className="text-blue-900/80">Yes! Federal filing is free for everyone. State filing and advanced support are available with Plus.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700">Is my data safe?</h4>
              <p className="text-blue-900/80">Absolutely. We use bank-level encryption and never share your data without your consent.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700">Can I switch tax years?</h4>
              <p className="text-blue-900/80">Yes, you can easily switch between 2022, 2023, 2024, and 2025 tax years in the app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-gradient-to-r from-green-50 to-green-100 border-t border-green-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Contact Us</h2>
          <p className="text-blue-900/80 mb-4">Have questions or need help? Email us at <a href="mailto:support@taxnavo.com" className="text-blue-700 underline">support@taxnavo.com</a></p>
        </div>
      </section>
    </div>
  );
}
