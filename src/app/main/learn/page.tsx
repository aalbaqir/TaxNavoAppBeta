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
    route: "/main/learn/deductions-credits",
  },
];

export default function LearnPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'learn' | 'taxprep' | 'resources' | 'support'>("learn");
  const [device, setDevice] = useState<'mobile' | 'desktop'>("desktop");

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1] text-gray-900">
      <TabsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showDeviceSwitch={true}
        device={device}
        setDevice={setDevice}
      />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#8000FF] mb-4 drop-shadow-sm tracking-tight">
            Learn Taxes with Confidence
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            TaxNavo teaches first-time filers, W-2 workers, and gig workers how to master their taxes and maximize their refund.
          </p>
        </section>

        {/* Learning Modules Grid */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {modules.map((mod) => (
                <article
                  key={mod.title}
                  className="rounded-2xl bg-white shadow-lg hover:shadow-2xl border border-[#8000FF]/10 p-6 lg:p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-[#FFC107] group cursor-pointer"
                  onClick={() => router.push(mod.route)}
                >
                  <div className="flex-1 mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-[#8000FF] mb-3 group-hover:text-[#FFC107] transition-colors">
                      {mod.title}
                    </h2>
                    <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#FFC107]">
                          Progress
                        </span>
                        <span className="text-sm font-semibold text-[#8000FF]">
                          {mod.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#FFC107] to-[#8000FF] transition-all duration-500"
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-[#8000FF] text-white font-semibold shadow-lg hover:bg-[#FFC107] hover:text-[#8000FF] transition-all duration-200 transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(mod.route);
                      }}
                    >
                      {mod.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#8000FF] p-8 lg:p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                  Ready to file your taxes?
                </h3>
                <p className="text-lg opacity-90">
                  Put your knowledge to practice with our guided tax preparation.
                </p>
              </div>
              <button
                className="px-8 py-4 rounded-xl bg-[#8000FF] text-white font-bold shadow-lg hover:bg-[#6a00cc] transition-all duration-200 text-lg transform hover:scale-105 whitespace-nowrap"
                onClick={() => router.push("/main/2024")}
              >
                Start Tax Preparation
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
