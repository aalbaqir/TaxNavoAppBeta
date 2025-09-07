"use client";
import { useState } from "react";
import Link from "next/link";

const forms = [
  {
    name: "1099-NEC",
    desc: "Reports nonemployee compensation (most gig/freelance work).",
    example: "Uber driver, freelance designer, DoorDash courier."
  },
  {
    name: "1099-K",
    desc: "Reports payment card and third-party network transactions (if you earn $600+ via apps).",
    example: "Etsy seller, eBay, or payments via PayPal/Venmo."
  },
  {
    name: "1099-MISC",
    desc: "Reports miscellaneous income (prizes, rent, royalties, etc.).",
    example: "Contest winnings, rental income, or royalties."
  }
];

const deductions = [
  {
    icon: "🚗",
    title: "Mileage/Vehicle",
    desc: "Deduct miles driven for work or actual vehicle expenses."
  },
  {
    icon: "🏠",
    title: "Home Office",
    desc: "If you work from home, you may deduct a portion of rent, utilities, and more."
  },
  {
    icon: "🛒",
    title: "Supplies/Equipment",
    desc: "Deduct items you buy for your gig work, like tools or software."
  },
  {
    icon: "📱",
    title: "Phone/Internet",
    desc: "Deduct a portion of your phone and internet bills used for work."
  }
];

const quizQuestions = [
  {
    q: "True or False: Gig workers pay both the employer and employee share of Social Security and Medicare taxes.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    q: "Which form reports most gig/freelance income?",
    options: ["1099-NEC", "W-2", "1099-K"],
    answer: "1099-NEC",
  },
  {
    q: "When is the first quarterly estimated tax payment due?",
    options: ["April 15", "June 15", "January 15"],
    answer: "April 15",
  },
  {
    q: "True or False: You can deduct the full cost of your personal car if you use it for gig work.",
    options: ["True", "False"],
    answer: "False",
  },
];

export default function GigWorkTaxes() {
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuiz = quizQuestions[quizStep];

  function handleQuiz(option: string) {
    setSelected(option);
    if (option === currentQuiz.answer) {
      setFeedback("Correct!");
      setScore((s) => s + 1);
    } else {
      setFeedback("Try again");
    }
  }

  function handleNextQuiz() {
    setSelected(null);
    setFeedback(null);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  }

  function handleRestartQuiz() {
    setQuizStep(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setShowResults(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Page Title & Intro */}
      <h1 className="text-4xl font-extrabold text-[#8000FF] mb-2">Gig Work Taxes</h1>
      <p className="text-lg text-gray-700 mb-8">Gig work includes rideshare, delivery, freelancing, and more. Unlike W-2 jobs, gig income is usually reported on 1099 forms and you’re responsible for your own taxes—including self-employment tax.</p>

      {/* Section 1: 1099 Forms You Might Receive */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-4">1099 Forms You Might Receive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg transition-all group">
              <div className="font-bold text-lg text-[#8000FF] mb-1">{form.name}</div>
              <div className="text-gray-700 text-sm mb-2">{form.desc}</div>
              <div className="text-xs text-gray-500">Example: {form.example}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Self-Employment Taxes */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-2">Self-Employment Taxes</h2>
        <p className="mb-4 text-gray-700">When you’re self-employed, you pay both the employer and employee share of Social Security and Medicare taxes—totaling <span className="font-bold text-[#FFC107]">15.3%</span> of your net earnings.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="rounded-xl bg-[#FFC107] text-[#8000FF] font-bold px-6 py-4 shadow text-center text-lg w-full sm:w-auto">You pay both employer + employee portions<br /><span className="text-2xl">15.3%</span></div>
        </div>
      </section>

      {/* Section 3: Deductions for Gig Workers */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-4">Deductions for Gig Workers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {deductions.map((d) => (
            <div key={d.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg transition-all flex items-center gap-4">
              <span className="text-3xl">{d.icon}</span>
              <div>
                <div className="font-semibold text-[#8000FF] mb-1">{d.title}</div>
                <div className="text-gray-700 text-sm">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Quarterly Taxes */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-2">Quarterly Taxes</h2>
        <p className="mb-2 text-gray-700">If you expect to owe $1,000 or more in taxes for the year, you may need to make estimated tax payments each quarter. This helps you avoid penalties and interest.</p>
        <div className="bg-white rounded-xl border border-gray-200 shadow p-5 flex flex-col sm:flex-row gap-4 items-center justify-between max-w-xl mx-auto">
          <div className="font-semibold text-[#8000FF]">Estimated Tax Due Dates:</div>
          <ul className="flex flex-wrap gap-3 text-sm">
            <li className="bg-[#FFC107] text-[#8000FF] px-3 py-1 rounded-full font-bold">April 15</li>
            <li className="bg-[#FFC107] text-[#8000FF] px-3 py-1 rounded-full font-bold">June 15</li>
            <li className="bg-[#FFC107] text-[#8000FF] px-3 py-1 rounded-full font-bold">September 15</li>
            <li className="bg-[#FFC107] text-[#8000FF] px-3 py-1 rounded-full font-bold">January 15</li>
          </ul>
        </div>
      </section>

      {/* Section 5: Interactive Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-4">Quick Quiz: Gig Work Tax Basics</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6 max-w-xl mx-auto">
          {showResults ? (
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-[#8000FF] mb-2">Quiz Complete!</div>
              <div className="mb-4 text-lg">You got <span className="text-[#FFC107] font-bold">{score}</span> out of {quizQuestions.length} correct.</div>
              <button
                className="px-6 py-2 rounded bg-[#8000FF] text-white font-semibold hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors"
                onClick={handleRestartQuiz}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 font-medium text-lg">{currentQuiz.q}</div>
              <div className="flex flex-col gap-3 mb-4">
                {currentQuiz.options.map((opt) => (
                  <button
                    key={opt}
                    className={`px-4 py-2 rounded-xl border font-semibold transition-all text-left ${selected === opt ? (opt === currentQuiz.answer ? 'bg-[#FFC107] text-[#8000FF] border-[#FFC107]' : 'bg-[#8000FF] text-white border-[#8000FF]') : 'bg-gray-50 border-gray-200 hover:bg-[#FFC107] hover:text-[#8000FF] hover:border-[#FFC107]'}`}
                    onClick={() => !selected && handleQuiz(opt)}
                    disabled={!!selected}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div className={`mb-4 font-semibold ${feedback === 'Correct!' ? 'text-[#FFC107]' : 'text-[#8000FF]'}`}>{feedback}</div>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-400">Question {quizStep + 1} of {quizQuestions.length}</div>
                {selected && (
                  <button
                    className="px-4 py-2 rounded bg-[#8000FF] text-white font-semibold hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors"
                    onClick={handleNextQuiz}
                  >
                    {quizStep === quizQuestions.length - 1 ? "See Results" : "Next"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <Link href="/main/learn/w2-basics" className="px-6 py-2 rounded-xl bg-gray-100 text-[#8000FF] font-semibold border border-gray-200 hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors shadow">
          ← Back to W-2 Basics
        </Link>
        <Link href="/main/learn/first-time-filers" className="px-6 py-2 rounded-xl bg-[#8000FF] text-white font-semibold hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors shadow">
          Next: First-Time Filers →
        </Link>
      </div>
    </div>
  );
}
