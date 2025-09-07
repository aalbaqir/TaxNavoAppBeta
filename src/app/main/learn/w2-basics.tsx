"use client";
import { useState } from "react";
import Link from "next/link";

const w2Boxes = [
  { box: "Box 1", label: "Wages, tips, other compensation", desc: "Total taxable wages you earned from this employer.", example: "$45,000" },
  { box: "Box 2", label: "Federal income tax withheld", desc: "Total federal tax withheld from your paychecks.", example: "$3,200" },
  { box: "Box 3", label: "Social Security wages", desc: "Wages subject to Social Security tax.", example: "$45,000" },
  { box: "Box 4", label: "Social Security tax withheld", desc: "Social Security tax withheld.", example: "$2,790" },
  { box: "Box 5", label: "Medicare wages and tips", desc: "Wages subject to Medicare tax.", example: "$45,000" },
  { box: "Box 6", label: "Medicare tax withheld", desc: "Medicare tax withheld.", example: "$652.50" },
  { box: "Box 12", label: "Other compensation or benefits", desc: "Various codes for benefits like 401(k) contributions.", example: "D: $2,000" },
  { box: "Box 17", label: "State income tax", desc: "State tax withheld from your pay.", example: "$1,200" },
];

const quizQuestions = [
  {
    q: "True or False: Your W-2 shows how much federal tax was withheld from your pay.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    q: "Which box on the W-2 shows your total taxable wages?",
    options: ["Box 1", "Box 2", "Box 12"],
    answer: "Box 1",
  },
  {
    q: "When should you expect to receive your W-2 from your employer?",
    options: ["By January 31", "By April 15", "By December 31"],
    answer: "By January 31",
  },
  {
    q: "True or False: You can file your taxes without a W-2 if you had a job.",
    options: ["True", "False"],
    answer: "False",
  },
];

export default function W2Basics() {
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
      <h1 className="text-4xl font-extrabold text-[#8000FF] mb-2">W-2 Basics</h1>
      <p className="text-lg text-gray-700 mb-8">The W-2 form reports your annual wages and the amount of taxes withheld from your paycheck. It’s essential for filing your tax return and making sure you get the refund you deserve.</p>

      {/* Section 1: What is a W-2? */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-2">What is a W-2?</h2>
        <p className="mb-4 text-gray-700">A W-2 is a tax form your employer sends you and the IRS every year. It shows how much you earned and how much tax was taken out of your paychecks. You’ll use it to file your federal and state tax returns.</p>
        <div className="flex justify-center">
          <div className="w-64 h-40 bg-gray-100 border-2 border-dashed border-[#FFC107] rounded-xl flex items-center justify-center text-gray-400 font-semibold text-lg shadow-inner">
            Sample W-2
          </div>
        </div>
      </section>

      {/* Section 2: Key Boxes on the W-2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-4">Key Boxes on the W-2</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {w2Boxes.map((box) => (
            <div key={box.box} className="rounded-xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-[#FFC107] text-[#8000FF] font-bold px-3 py-1 rounded-full text-sm group-hover:bg-[#8000FF] group-hover:text-[#FFC107] transition-colors">{box.box}</span>
                <span className="font-semibold text-gray-800">{box.label}</span>
              </div>
              <div className="text-gray-600 text-sm mb-1">{box.desc}</div>
              <div className="text-xs text-gray-500">Example: <span className="font-mono">{box.example}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Why Your W-2 is Important */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-2">Why Your W-2 is Important</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Needed to file your federal and state tax returns.</li>
          <li>Shows how much tax was withheld—affects your refund or amount owed.</li>
          <li>Employers must send it by <span className="font-semibold text-[#FFC107]">January 31</span> each year.</li>
          <li>Common mistakes: missing boxes, incorrect SSN, or wrong address.</li>
          <li>Contact your employer if you don’t receive it on time.</li>
        </ul>
      </section>

      {/* Section 4: Interactive Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#8000FF] mb-4">Quick Quiz: Test Your W-2 Knowledge</h2>
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
                    className={`px-4 py-2 rounded-xl border font-semibold transition-all text-left ${selected === opt ? (opt === currentQuiz.answer ? 'bg-[#8000FF] text-white border-[#8000FF]' : 'bg-red-100 border-red-300 text-red-700') : 'bg-gray-50 border-gray-200 hover:bg-[#FFC107] hover:text-[#8000FF] hover:border-[#FFC107]'}`}
                    onClick={() => !selected && handleQuiz(opt)}
                    disabled={!!selected}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div className={`mb-4 font-semibold ${feedback === 'Correct!' ? 'text-[#8000FF]' : 'text-red-600'}`}>{feedback}</div>
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
        <Link href="/main/learn" className="px-6 py-2 rounded-xl bg-gray-100 text-[#8000FF] font-semibold border border-gray-200 hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors shadow">
          ← Back to Learn
        </Link>
        <Link href="/main/learn/gig-work-taxes" className="px-6 py-2 rounded-xl bg-[#8000FF] text-white font-semibold hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors shadow">
          Next: Gig Work Taxes →
        </Link>
      </div>
    </div>
  );
}
