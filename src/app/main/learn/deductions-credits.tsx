"use client"; // <-- add this at the very top

import React, { useState } from "react";

const deductions = [
  {
    title: "Standard Deduction",
    desc: "A flat amount most people can subtract from their income. For 2025, it's $14,600 (single) or $29,200 (married).",
  },
  {
    title: "Itemized Deductions",
    desc: "Add up expenses like mortgage interest, property taxes, medical costs, and charity. Use if total is more than the standard deduction.",
  },
  {
    title: "Student Loan Interest",
    desc: "Deduct up to $2,500 of interest paid on qualified student loans.",
  },
  {
    title: "Medical Expenses",
    desc: "Deduct unreimbursed medical/dental costs that exceed 7.5% of your income (if you itemize).",
  },
  {
    title: "Charitable Donations",
    desc: "Deduct gifts to qualified charities if you itemize. Keep receipts!",
  },
];

const credits = [
  {
    title: "Child Tax Credit",
    desc: "Up to $2,000 per child under 17. Reduces your tax bill directly.",
  },
  {
    title: "Earned Income Tax Credit (EITC)",
    desc: "For low/moderate earners. Can be worth thousands—even if you owe no tax!",
  },
  {
    title: "Education Credits",
    desc: "American Opportunity & Lifetime Learning Credits help with college costs.",
  },
  {
    title: "Clean Vehicle Credit",
    desc: "Get up to $7,500 for buying a new electric vehicle (with restrictions).",
  },
];

const quizQuestions = [
  {
    q: "Which reduces your tax bill dollar-for-dollar?",
    options: ["Deductions", "Credits"],
    answer: "Credits",
  },
  {
    q: "Which can you claim for giving to charity?",
    options: ["Deduction", "Credit"],
    answer: "Deduction",
  },
  {
    q: "Which is the Child Tax Credit?",
    options: ["Deduction", "Credit"],
    answer: "Credit",
  },
  {
    q: "If your itemized deductions are less than the standard deduction, which should you take?",
    options: ["Standard Deduction", "Itemized Deductions"],
    answer: "Standard Deduction",
  },
];

export default function DeductionsCredits() {
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);

  const currentQuiz = quizQuestions[quizStep];

  function handleQuiz(option: string) {
    setSelected(option);
    if (option === currentQuiz.answer) {
      setCorrect(true);
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setSelected(null);
        setQuizStep((s) => (s + 1 < quizQuestions.length ? s + 1 : 0));
      }, 1200);
    } else {
      setCorrect(false);
      setShowResult(true);
      setTimeout(() => setShowResult(false), 1000);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg mt-8 mb-8">
      {/* Page Title & Intro */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#8000FF] mb-4 text-center">Deductions & Credits</h1>
      <div className="mb-8 text-lg text-gray-700 text-center">
        <p className="mb-2">Deductions reduce your taxable income, while credits reduce your tax bill directly. Both can save you money, but credits usually have a bigger impact dollar-for-dollar.</p>
      </div>

      {/* Section 1: Common Deductions */}
      <h2 className="text-2xl font-bold text-[#FFC107] mb-4">Common Deductions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {deductions.map((d) => (
          <div key={d.title} className="rounded-xl bg-[#F3E8FF] border border-[#8000FF]/10 shadow-lg p-5 flex flex-col hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-[#8000FF] mb-2">{d.title}</h3>
            <p className="text-gray-700 text-sm">{d.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2: Common Credits */}
      <h2 className="text-2xl font-bold text-[#FFC107] mb-4">Common Credits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {credits.map((c) => (
          <div key={c.title} className="rounded-xl bg-[#FFF8E1] border border-[#FFC107]/30 shadow-lg p-5 flex flex-col hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-[#FFC107] mb-2">{c.title}</h3>
            <p className="text-gray-700 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 3: Comparison Infographic */}
      <h2 className="text-2xl font-bold text-[#8000FF] mb-4">Deductions vs. Credits</h2>
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        <div className="flex-1 bg-[#F3E8FF] rounded-xl shadow-lg p-6 border border-[#8000FF]/10">
          <h3 className="text-lg font-bold text-[#8000FF] mb-2">Deductions</h3>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            <li>Reduce your taxable income</li>
            <li>Lower your tax bill indirectly</li>
            <li>Examples: Standard deduction, student loan interest</li>
          </ul>
        </div>
        <div className="flex-1 bg-[#FFF8E1] rounded-xl shadow-lg p-6 border border-[#FFC107]/30">
          <h3 className="text-lg font-bold text-[#FFC107] mb-2">Credits</h3>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            <li>Reduce your tax bill dollar-for-dollar</li>
            <li>Some are refundable (can increase your refund)</li>
            <li>Examples: Child Tax Credit, EITC, education credits</li>
          </ul>
        </div>
      </div>

      {/* Section 4: Interactive Quiz */}
      <h2 className="text-2xl font-bold text-[#8000FF] mb-4">Quick Quiz</h2>
      <div className="bg-[#F3E8FF] rounded-xl p-6 mb-8">
        <p className="mb-4 font-medium text-lg">{currentQuiz.q}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          {currentQuiz.options.map((option) => (
            <button
              key={option}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold border transition-colors duration-150 text-lg shadow
                ${selected === option && showResult
                  ? correct
                    ? 'bg-[#FFC107] text-[#8000FF] border-[#FFC107]'
                    : 'bg-[#8000FF] text-white border-[#8000FF]'
                  : 'bg-white text-[#8000FF] border-[#8000FF] hover:bg-[#FFC107] hover:text-[#8000FF]'}
              `}
              onClick={() => !showResult && handleQuiz(option)}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>
        {showResult && (
          <div className={`mt-4 text-lg font-bold ${correct ? 'text-[#FFC107]' : 'text-[#8000FF]'}`}>{correct ? 'Correct!' : 'Try again!'}</div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <a
          href="/main/learn/gig-work-taxes"
          className="px-6 py-3 rounded-lg bg-[#8000FF] text-white font-bold shadow hover:bg-[#6a00cc] transition-colors text-lg"
        >
          ← Back to Gig Work Taxes
        </a>
        <a
          href="/main/learn/first-time-filers"
          className="px-6 py-3 rounded-lg bg-[#FFC107] text-[#8000FF] font-bold shadow hover:bg-[#FFD54F] transition-colors text-lg"
        >
          Next: Filing Basics →
        </a>
      </div>
    </div>
  );
}
