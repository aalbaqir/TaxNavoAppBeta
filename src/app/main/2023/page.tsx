"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- Shared Layout & Year Selector ---
const yearTabs = [
  { year: 2022, label: "2022" },
  { year: 2023, label: "2023" },
  { year: 2024, label: "2024" },
  { year: 2025, label: "2025" },
];

// --- Type Definitions ---
interface QuestionBase {
  id: number;
  question: string;
  showIf?: (a: Record<string, unknown>) => boolean;
}
interface OptionQuestion extends QuestionBase {
  options: string[];
}
interface InputQuestion extends QuestionBase {
  type: "text" | "number" | "date" | "textarea" | "email";
  placeholder?: string;
}
interface FileQuestion extends QuestionBase {
  type: "file";
  docTypes: string[];
}
type Question = OptionQuestion | InputQuestion | FileQuestion;

// --- 2023 Questionnaire Data ---
const followUpQuestions: Question[] = [
  {
    id: 3,
    question: "Did you have any additional income not reported on the uploaded document(s)?",
    options: ["Yes", "No"],
  },
  {
    id: 4,
    question: "If yes, please describe the source and amount:",
    type: "textarea",
    placeholder: "Source and amount",
    showIf: (a: Record<string, unknown>) => a[3] === "Yes",
  },
  {
    id: 5,
    question: "Did you have any dependents in 2023?",
    options: ["Yes", "No"],
  },
  {
    id: 6,
    question: "If yes, please list each dependent's name, SSN, DOB, and relationship:",
    type: "textarea",
    placeholder: "Name, SSN, DOB, Relationship",
    showIf: (a: Record<string, unknown>) => a[5] === "Yes",
  },
  {
    id: 7,
    question: "Did you pay for child/dependent care in 2023?",
    options: ["Yes", "No"],
  },
  {
    id: 8,
    question: "Total child/dependent care expenses (USD)",
    type: "number",
    placeholder: "Care expenses",
    showIf: (a: Record<string, unknown>) => a[7] === "Yes",
  },
  {
    id: 9,
    question: "Did you pay student loan interest in 2023?",
    options: ["Yes", "No"],
  },
  {
    id: 10,
    question: "Total student loan interest paid (USD)",
    type: "number",
    placeholder: "Student loan interest",
    showIf: (a: Record<string, unknown>) => a[9] === "Yes",
  },
  {
    id: 11,
    question: "Did you pay tuition or education expenses in 2023?",
    options: ["Yes", "No"],
  },
  {
    id: 12,
    question: "Total tuition/education expenses (USD)",
    type: "number",
    placeholder: "Education expenses",
    showIf: (a: Record<string, unknown>) => a[11] === "Yes",
  },
  {
    id: 13,
    question: "Did you make charitable contributions in 2023?",
    options: ["Yes", "No"],
  },
  {
    id: 14,
    question: "Total charitable contributions (USD)",
    type: "number",
    placeholder: "Charitable contributions",
    showIf: (a: Record<string, unknown>) => a[13] === "Yes",
  },
  {
    id: 15,
    question: "Did you have health insurance all year in 2023?",
    options: ["Yes", "No"],
  },
  {
    id: 16,
    question: "Did you receive a 1095-A for Marketplace coverage?",
    options: ["Yes", "No"],
    showIf: (a: Record<string, unknown>) => a[15] === "No",
  },
  {
    id: 17,
    question: "Did you have any major life changes in 2023 (marriage, divorce, new job, move, etc.)?",
    options: ["Yes", "No"],
  },
  {
    id: 18,
    question: "Please describe your major life changes:",
    type: "textarea",
    placeholder: "Describe changes",
    showIf: (a: Record<string, unknown>) => a[17] === "Yes",
  },
];

// --- Type Guards ---
function isOptionQuestion(q: Question): q is OptionQuestion {
  return (q as OptionQuestion).options !== undefined;
}
function isInputQuestion(q: Question): q is InputQuestion {
  return (
    (q as InputQuestion).type === "text" ||
    (q as InputQuestion).type === "number" ||
    (q as InputQuestion).type === "date" ||
    (q as InputQuestion).type === "textarea" ||
    (q as InputQuestion).type === "email"
  );
}

// --- 2023 Questionnaire Content Component ---
function Questionnaire2023() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | undefined>>({});
  const [loading, setLoading] = useState(false);

  const current = followUpQuestions[step];
  const progress = Math.round(((step + 1) / followUpQuestions.length) * 100);

  function handleOption(option: string) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    setStep((s) => s + 1);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }));
  }

  function handleNext() {
    setStep((s) => s + 1);
  }

  function handlePrev() {
    setStep((s) => (s > 0 ? s - 1 : 0));
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setLoading(true);
      fetch(`/api/questionnaire?year=2023`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.questionnaire?.answers) {
              setAnswers(data.questionnaire.answers);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: 2023, answers }),
      });
    }
  }, [answers, status, session]);

  if (loading) return <div className="p-8">Loading your data...</div>;

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="mb-8 text-lg">Your responses have been received.</p>
        <pre className="bg-white p-4 rounded shadow text-left w-full max-w-md overflow-x-auto text-xs">{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto"
    >
      {/* Progress Bar and Step Info */}
      <div className="mb-6">
        <motion.div className="h-3 rounded-full bg-[#F3E8FF] overflow-hidden mb-4" initial={false}>
          <motion.div
            className="h-3 rounded-full bg-[#FFC107]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#8000FF] font-semibold">
            Step {step + 1} of {followUpQuestions.length}
          </span>
          <span className="text-sm text-[#FFC107] font-bold">{progress}% Complete</span>
        </div>
      </div>
      {/* Question */}
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-[#8000FF] mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {current.question}
      </motion.h2>
      {/* Answer UI */}
      {isOptionQuestion(current) && (
        <div className="flex flex-col gap-4">
          {current.options.map((option: string) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.04, backgroundColor: "#FFC107", color: "#8000FF" }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-3 rounded-xl font-semibold text-lg shadow border transition-colors duration-150
                ${answers[current.id] === option
                  ? "bg-[#8000FF] text-white border-[#8000FF]"
                  : "bg-white text-[#8000FF] border-[#8000FF] hover:bg-[#FFC107] hover:text-[#8000FF]"}
              `}
              onClick={() => handleOption(option)}
            >
              {option}
            </motion.button>
          ))}
        </div>
      )}
      {isInputQuestion(current) && (
        <div className="flex flex-col gap-4">
          {current.type === "textarea" ? (
            <textarea
              className="px-4 py-3 rounded-xl border border-[#8000FF]/20 focus:ring-2 focus:ring-[#FFC107] text-lg"
              placeholder={current.placeholder}
              value={answers[current.id] || ""}
              onChange={handleInput}
              rows={4}
            />
          ) : (
            <input
              type={current.type}
              className="px-4 py-3 rounded-xl border border-[#8000FF]/20 focus:ring-2 focus:ring-[#FFC107] text-lg"
              placeholder={current.placeholder}
              value={answers[current.id] || ""}
              onChange={handleInput}
            />
          )}
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: "#FFC107", color: "#8000FF" }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 px-6 py-3 rounded-xl bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
            onClick={handleNext}
            disabled={!answers[current.id]}
          >
            Next
          </motion.button>
        </div>
      )}
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="text-[#8000FF] font-semibold hover:underline transition-all"
          onClick={handlePrev}
          disabled={step === 0}
        >
          Back
        </motion.button>
        <span className="text-xs text-gray-400">
          Need help? <span className="underline cursor-pointer">Chat with support</span>
        </span>
      </div>
    </motion.div>
  );
}

// --- Placeholder Components for Other Years ---
function Questionnaire2022() {
  return (
    <motion.div
      key="2022"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="card w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
    >
      <h1 className="text-2xl font-bold mb-4 text-[#8000FF]">2022 Tax Year Questionnaire</h1>
      <p className="text-gray-600">2022 content goes here.</p>
    </motion.div>
  );
}
function Questionnaire2024() {
  return (
    <motion.div
      key="2024"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="card w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
    >
      <h1 className="text-2xl font-bold mb-4 text-[#8000FF]">2024 Tax Year Questionnaire</h1>
      <p className="text-gray-600">2024 content goes here.</p>
    </motion.div>
  );
}
function Questionnaire2025() {
  return (
    <motion.div
      key="2025"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="card w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
    >
      <h1 className="text-2xl font-bold mb-4 text-[#8000FF]">2025 Tax Year Questionnaire</h1>
      <p className="text-gray-600">2025 content goes here.</p>
    </motion.div>
  );
}

// --- Shared Layout with Modern Header, Year Selector, and Animated Content Switcher ---
export default function TaxQuestionnairePage() {
  const [activeYear, setActiveYear] = useState(2023);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1]">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
        
        {/* <div className="flex justify-center gap-4 mb-8"> */}
          {/* "Questionnaire" button removed as requested */}
        {/* </div> */}
        <AnimatePresence mode="wait">
          {activeYear === 2022 && <Questionnaire2022 key="2022" />}
          {activeYear === 2023 && <Questionnaire2023 key="2023" />}
          {activeYear === 2024 && <Questionnaire2024 key="2024" />}
          {activeYear === 2025 && <Questionnaire2025 key="2025" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
