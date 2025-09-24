"use client";

import { HiCollection, HiBookOpen, HiDocumentText, HiSupport } from "react-icons/hi";
import Link from "next/link";
import { useState } from "react";
import TabsHeader from "@/components/TabsHeader";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "learn" | "taxprep" | "resources" | "support">("resources");
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
            <HiCollection className="inline-block text-4xl mb-1" />
            Resources
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Explore helpful guides, forms, and links to make your tax journey easier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard
              icon={<HiBookOpen className="text-3xl text-[#8000FF]" />}
              title="Tax Guides"
              description="Step-by-step guides for common tax topics and situations."
              href="https://www.irs.gov/help/ita"
            />
            <ResourceCard
              icon={<HiDocumentText className="text-3xl text-[#8000FF]" />}
              title="IRS Forms"
              description="Quick access to the most-used IRS forms and instructions."
              href="https://www.irs.gov/forms-instructions"
            />
            <ResourceCard
              icon={<HiSupport className="text-3xl text-[#8000FF]" />}
              title="Support Center"
              description="Get answers to frequently asked questions or contact support."
              href="/main/support"
              internal
            />
            <ResourceCard
              icon={<HiCollection className="text-3xl text-[#8000FF]" />}
              title="Useful Links"
              description="Curated links to trusted tax resources and calculators."
              href="https://www.irs.gov/"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

type ResourceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  internal?: boolean;
};

function ResourceCard({ icon, title, description, href, internal }: ResourceCardProps) {
  return (
    <div className="flex flex-col items-center bg-[#F3E8FF] rounded-xl p-6 shadow hover:shadow-xl transition-shadow duration-200 h-full">
      <div className="mb-3">{icon}</div>
      <h2 className="font-bold text-lg text-[#8000FF] mb-1">{title}</h2>
      <p className="text-gray-700 text-center mb-4">{description}</p>
      {internal ? (
        <Link
          href={href}
          className="px-4 py-2 rounded-full bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
        >
          Learn More
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
        >
          Visit
        </a>
      )}
    </div>
  );
}