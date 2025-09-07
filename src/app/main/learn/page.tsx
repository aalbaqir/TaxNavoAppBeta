"use client";
import { useRouter } from "next/navigation";
import TabsHeader from "@/components/TabsHeader";
import { useState } from "react";

const modules = [
  {
    title: "W-2 Basics",
    description:
      "Understand your W-2, what each box means, and how to use it for your tax return.",
    progress: 40,
    route: "/main/learn/w2-basics",
  },
  {
    title: "Gig Work Taxes",
    description:
      "Learn how to handle taxes for Uber, DoorDash, freelancing, and other gig jobs.",
    progress: 20,
    route: "/main/learn/gig-work-taxes",
  },
  {
    title: "First-Time Filers",
    description:
      "Step-by-step guidance for those filing taxes for the first time. No experience needed!",
    progress: 60,
    route: "/main/learn/first-time-filers",
  },
  {
    title: "Deductions & Credits",
    description:
      "Discover common deductions and credits to help you maximize your refund.",
    progress: 10,
    route: "/main/learn/deductions-credits", // fixed typo here
  },
];

export default function LearnPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'learn' | 'taxprep'>("learn");
  const [device, setDevice] = useState<'mobile' | 'desktop'>("desktop");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1] text-gray-900">
      <TabsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showDeviceSwitch={true}
        device={device}
        setDevice={setDevice}
      />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-14 flex flex-col">
        {/* Hero Section */}
        <section className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#8000FF] mb-5 drop-shadow-sm tracking-tight">
            Learn Taxes with Confidence
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            TaxNavo teaches first-time filers, W-2 workers, and gig workers how to master their taxes and maximize their refund.
          </p>
        </section>
        {/* Learning Modules Grid */}
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {modules.map((mod) => (
              <article
                key={mod.title}
                className="rounded-2xl bg-white shadow-xl hover:shadow-2xl border border-[#8000FF]/10 p-8 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-[#FFC107] group"
              >
                <div className="flex-1 mb-6">
                  <h2 className="text-2xl font-bold text-[#8000FF] mb-3 group-hover:text-[#FFC107] transition-colors">
                    {mod.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{mod.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#FFC107]">{mod.progress}% Complete</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-[#FFC107] transition-all"
                        style={{ width: `${mod.progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    className="ml-2 px-6 py-2 rounded-lg bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
                    onClick={() => mod.route !== "#" && router.push(mod.route)}
                    disabled={mod.route === "#"}
                  >
                    Start Learning
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* CTA Banner */}
        <section className="mt-20">
          <div className="rounded-2xl bg-[#FFC107] text-[#8000FF] flex flex-col md:flex-row items-center justify-between px-12 py-10 shadow-xl gap-4">
            <div className="text-2xl font-bold mb-2 md:mb-0">Ready to file your taxes?</div>
            <button
              className="px-8 py-3 rounded-lg bg-[#8000FF] text-white font-bold shadow hover:bg-[#6a00cc] transition-colors text-lg"
              onClick={() => router.push("/main/2024")}
            >
              Start Tax Preparation
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
