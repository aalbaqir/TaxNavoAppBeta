"use client";

import React, { useState } from "react";

interface Question {
  id: number;
  text: string;
  options: string[];
  nextStep?: { [key: string]: number }; // branching: answer → next question id
}

// Define the questions for first-time W-2 filers
const questions: Question[] = [
  {
    id: 1,
    text: "Are you filing as an individual or jointly with a spouse?",
    options: ["Individual", "Joint"],
    nextStep: { Individual: 2, Joint: 2 },
  },
  {
    id: 2,
    text: "Did you receive a W-2 from an employer in 2025?",
    options: ["Yes", "No"],
    nextStep: { Yes: 3, No: 4 },
  },
  {
    id: 3,
    text: "Do you have any other income like tips, side jobs, or interest?",
    options: ["Yes", "No"],
    nextStep: { Yes: 4, No: 4 },
  },
  {
    id: 4,
    text: "Will you take the standard deduction or itemize?",
    options: ["Standard", "Itemize"],
    nextStep: { Standard: 5, Itemize: 5 },
  },
  {
    id: 5,
    text: "Are you eligible for any tax credits like Child Tax Credit, Education Credit, or EITC?",
    options: ["Yes", "No"],
    nextStep: { Yes: 6, No: 6 },
  },
  {
    id: 6,
    text: "Any additional tax payments or credits to report?",
    options: ["Yes", "No"],
    nextStep: { Yes: 7, No: -1 }, // -1 means end
  },
  {
    id: 7,
    text: "Please enter details for additional payments/credits (placeholder).",
    options: ["Done"],
    nextStep: { Done: -1 },
  },
];

export default function FirstTimeFilers() {
  const [currentId, setCurrentId] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const currentQuestion = questions.find((q) => q.id === currentId);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: answer });
    const nextId = currentQuestion.nextStep?.[answer] ?? -1;
    if (nextId === -1) return setCurrentId(-1); // end of questionnaire
    setCurrentId(nextId);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg mt-8 mb-8">
      {/* Back to Learn Page Button */}
      <div className="mb-6">
        <a
          href="/main/learn"
          className="inline-block px-4 py-2 rounded-lg bg-[#8000FF] text-white font-semibold shadow hover:bg-[#6a00cc] transition-colors text-base"
        >
          ← Back to All Modules
        </a>
      </div>
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#8000FF] mb-2">First-Time Tax Filing Made Simple</h1>
        <p className="text-lg text-gray-700 mb-2">Filing your first tax return can feel overwhelming, but TaxNavo breaks it down step by step. You don’t need to be a tax expert—just follow along and you’ll be done in no time!</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200
              ${answers[q.id] ? 'bg-[#FFC107] text-[#8000FF] border-[#FFC107]' : (currentQuestion?.id === q.id ? 'bg-[#8000FF] text-white border-[#8000FF]' : 'bg-gray-200 text-gray-500 border-gray-300')}`}>{idx + 1}</div>
            {idx < questions.length - 1 && <div className="w-4 h-1 bg-gray-200 mx-1 rounded" />}
          </div>
        ))}
      </div>

      {/* Question Card */}
      {currentId !== -1 && currentQuestion && (
        <div className="bg-[#F3E8FF] shadow-lg rounded-xl p-6 mb-6 border border-[#8000FF]/10">
          <p className="text-xl font-semibold mb-4 text-[#8000FF]">{currentQuestion.text}</p>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`px-6 py-3 rounded-lg font-semibold text-lg shadow border transition-colors duration-150
                  ${answers[currentQuestion.id] === option ? 'bg-[#8000FF] text-white border-[#8000FF]' : 'bg-white text-[#8000FF] border-[#8000FF] hover:bg-[#FFC107] hover:text-[#8000FF]'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary Card */}
      {currentId === -1 && (
        <div className="mt-6 p-8 bg-[#F3E8FF] rounded-xl shadow-lg border border-[#8000FF]/10">
          <h2 className="text-2xl font-bold text-[#8000FF] mb-4 text-center">Summary of Your Answers</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-800">
            {Object.entries(answers).map(([qId, answer]) => {
              const questionText = questions.find((q) => q.id === Number(qId))?.text;
              return (
                <li key={qId} className="bg-white rounded-lg px-4 py-2 shadow border border-[#FFC107]/30">
                  <span className="font-semibold text-[#8000FF]">{questionText}</span>: <span className="text-gray-900">{answer}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 font-semibold text-center text-[#FFC107] text-lg">
            You’re ready to file! You can e-file, mail your return, or continue learning with TaxNavo.
          </p>
        </div>
      )}
    </div>
  );
}
