"use client";

import { HiSupport, HiMail, HiPhone, HiChatAlt, HiQuestionMarkCircle } from "react-icons/hi";
import Link from "next/link";
import { useState } from "react";
import TabsHeader from "@/components/TabsHeader";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "learn" | "taxprep" | "resources" | "support">("support");
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1]">
      <TabsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        device={device}
        setDevice={setDevice}
      />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <section className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-5xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#8000FF] mb-4 text-center flex items-center justify-center gap-2">
            <HiSupport className="inline-block text-4xl mb-1" />
            Support Center
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Get help with your tax preparation. We're here to assist you every step of the way.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SupportCard
              icon={<HiQuestionMarkCircle className="text-3xl text-[#8000FF]" />}
              title="FAQ"
              description="Find answers to frequently asked questions about tax filing."
              action="Browse FAQ"
              onClick={() => window.open("https://www.irs.gov/help/ita", "_blank")}
            />
            <SupportCard
              icon={<HiChatAlt className="text-3xl text-[#8000FF]" />}
              title="Live Chat"
              description="Chat with our tax experts in real-time for immediate assistance."
              action="Start Chat"
              onClick={() => alert("Live chat feature coming soon!")}
            />
            <SupportCard
              icon={<HiMail className="text-3xl text-[#8000FF]" />}
              title="Email Support"
              description="Send us an email and we'll get back to you within 24 hours."
              action="Send Email"
              onClick={() => window.open("mailto:support@taxnavo.com", "_blank")}
            />
            <SupportCard
              icon={<HiPhone className="text-3xl text-[#8000FF]" />}
              title="Phone Support"
              description="Call our support line during business hours for personalized help."
              action="Call Now"
              onClick={() => window.open("tel:+1-800-TAX-NAVO", "_blank")}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#8000FF] mb-4 text-center">Quick Help</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#F3E8FF] rounded-lg p-4">
              <h3 className="font-semibold text-[#8000FF] mb-2">Getting Started</h3>
              <p className="text-gray-700 text-sm">
                New to TaxNavo? Start with our{" "}
                <Link href="/main/learn" className="text-[#8000FF] underline hover:text-[#FFC107]">
                  Learn section
                </Link>{" "}
                to understand the basics of tax filing.
              </p>
            </div>
            <div className="bg-[#F3E8FF] rounded-lg p-4">
              <h3 className="font-semibold text-[#8000FF] mb-2">Technical Issues</h3>
              <p className="text-gray-700 text-sm">
                Experiencing technical problems? Try refreshing the page or clearing your browser cache.
                If issues persist, contact our support team.
              </p>
            </div>
            <div className="bg-[#F3E8FF] rounded-lg p-4">
              <h3 className="font-semibold text-[#8000FF] mb-2">Tax Questions</h3>
              <p className="text-gray-700 text-sm">
                Have specific tax questions? Our certified tax professionals are available via chat
                and email to provide personalized guidance.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

type SupportCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
};

function SupportCard({ icon, title, description, action, onClick }: SupportCardProps) {
  return (
    <div className="flex flex-col items-center bg-[#F3E8FF] rounded-xl p-6 shadow hover:shadow-xl transition-shadow duration-200 h-full">
      <div className="mb-3">{icon}</div>
      <h2 className="font-bold text-lg text-[#8000FF] mb-1">{title}</h2>
      <p className="text-gray-700 text-center mb-4">{description}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-full bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
      >
        {action}
      </button>
    </div>
  );
}