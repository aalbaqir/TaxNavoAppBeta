"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// --- Types ---
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
type Question = OptionQuestion | InputQuestion;

// --- Questions ---
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

export default function Tax2023Questionnaire() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | undefined>>({});
  const [loading, setLoading] = useState(false);

  // Only show questions that pass their showIf condition
  const visibleQuestions = followUpQuestions.filter(
    (q) => !q.showIf || q.showIf(answers)
  );
  const current = visibleQuestions[step];
  const progressPercent = Math.round(((step + 1) / visibleQuestions.length) * 100);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1] text-[#8000FF]">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="mb-8 text-lg">Your responses have been received.</p>
        <pre className="bg-white p-4 rounded shadow text-left w-full max-w-md overflow-x-auto text-xs">{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 py-8 flex flex-col items-center">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="h-3 rounded-full bg-[#F3E8FF] overflow-hidden mb-4">
              <div className="h-3 rounded-full bg-[#FFC107]" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#8000FF] font-semibold">
                Step {step + 1} of {visibleQuestions.length}
              </span>
              <span className="text-sm text-[#FFC107] font-bold">
                {progressPercent}% Complete
              </span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#8000FF] mb-6">{current.question}</h2>
          <div className="flex flex-col gap-4">
            {isOptionQuestion(current) && (
              <div className="flex flex-col gap-3">
                {current.options.map((option: string) => (
                  <button
                    key={option}
                    className="px-6 py-3 rounded-xl border border-[#8000FF]/20 bg-[#F3E8FF] hover:bg-[#FFC107] hover:text-[#8000FF] text-lg font-semibold transition-colors duration-150"
                    onClick={() => handleOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            {isInputQuestion(current) && (
              <>
                {current.type === "date" && (
                  <input
                    type="date"
                    className="px-4 py-3 rounded-xl border border-[#8000FF]/20 focus:ring-2 focus:ring-[#FFC107] text-lg"
                    value={answers[current.id] || ""}
                    onChange={handleInput}
                  />
                )}
                {(current.type === "number" || current.type === "text" || current.type === "email") && (
                  <input
                    type={current.type}
                    className="px-4 py-3 rounded-xl border border-[#8000FF]/20 focus:ring-2 focus:ring-[#FFC107] text-lg"
                    placeholder={current.placeholder}
                    value={answers[current.id] || ""}
                    onChange={handleInput}
                  />
                )}
                {current.type === "textarea" && (
                  <textarea
                    className="px-4 py-3 rounded-xl border border-[#8000FF]/20 focus:ring-2 focus:ring-[#FFC107] text-lg"
                    placeholder={current.placeholder}
                    value={answers[current.id] || ""}
                    onChange={handleInput}
                    rows={4}
                  />
                )}
                <button
                  className="mt-2 px-6 py-3 rounded-xl bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
                  onClick={handleNext}
                  disabled={!answers[current.id]}
                >
                  Next
                </button>
              </>
            )}
          </div>
          <div className="flex justify-between mt-8">
            <button
              className="text-[#8000FF] font-semibold hover:underline transition-all"
              onClick={handlePrev}
              disabled={step === 0}
            >
              Back
            </button>
            <span className="text-xs text-gray-400">
              Need help? <span className="underline cursor-pointer">Chat with support</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
