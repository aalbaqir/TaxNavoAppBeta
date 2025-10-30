"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// --- Types for story-style questionnaire ---
interface QuestionBase {
  id: number;
  question: string;
  showIf?: (a: Answers) => boolean;
  placeholder?: string;
}
interface OptionQuestion extends QuestionBase {
  options: string[];
}
interface InputQuestion extends QuestionBase {
  type: "text" | "number" | "date" | "textarea" | "email";
}
type Question = OptionQuestion | InputQuestion;
interface Answers {
  [key: number]: string | number | undefined;
}
interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

// --- Questions ---
const questions: Question[] = [
  {
    id: 1,
    question: "What is your full legal name as it appears on your Social Security card?",
    type: "text",
    placeholder: "Full legal name"
  },
  {
    id: 2,
    question: "What is your Social Security Number?",
    type: "text",
    placeholder: "SSN (e.g. 123-45-6789)"
  },
  {
    id: 3,
    question: "What is your current mailing address?",
    type: "text",
    placeholder: "Mailing address"
  },
  {
    id: 4,
    question: "What was your marital status on December 31, 2024?",
    options: ["Single", "Married", "Head of Household", "Qualifying Widow(er)"]
  },
  {
    id: 5,
    question: "Did you support any dependents in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 6,
    question: "How many dependents did you support?",
    type: "number",
    placeholder: "Number of dependents",
    showIf: (a: Answers) => a[5] === "Yes",
  },
  {
    id: 7,
    question: "Please provide the name, SSN, and relationship for each dependent you supported.",
    type: "textarea",
    placeholder: "Dependent details",
    showIf: (a: Answers) => a[5] === "Yes",
  },
  {
    id: 8,
    question: "What is your email address?",
    type: "email",
    placeholder: "Email address"
  },
  {
    id: 9,
    question: "What is your phone number?",
    type: "text",
    placeholder: "Phone number"
  },
  {
    id: 10,
    question: "What is your preferred contact method?",
    options: ["Email", "Phone"]
  },
  {
    id: 11,
    question: "Did you live at your current address for the entire year of 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 12,
    question: "Did you have any other addresses in 2024?",
    options: ["Yes", "No"],
    showIf: (a: Answers) => a[11] === "No",
  },
  {
    id: 13,
    question: "Please provide any other addresses you had in 2024, along with the dates you lived at each address.",
    type: "textarea",
    placeholder: "Other addresses",
    showIf: (a: Answers) => a[12] === "Yes",
  },
  {
    id: 14,
    question: "Are you a U.S. citizen?",
    options: ["Yes", "No"]
  },
  {
    id: 15,
    question: "If you are not a U.S. citizen, what is your country of citizenship?",
    type: "text",
    placeholder: "Country of citizenship",
    showIf: (a: Answers) => a[14] === "No",
  },
  {
    id: 16,
    question: "What is your occupation?",
    type: "text",
    placeholder: "Occupation"
  },
  {
    id: 17,
    question: "What was your total income for 2024?",
    type: "number",
    placeholder: "Total income",
  },
  {
    id: 18,
    question: "Did you have any other sources of income in 2024?",
    options: ["Yes", "No"],
  },
  {
    id: 19,
    question: "Please describe any other sources of income you had in 2024.",
    type: "textarea",
    placeholder: "Other income sources",
    showIf: (a: Answers) => a[18] === "Yes",
  },
  {
    id: 20,
    question: "Did you pay for health insurance in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 21,
    question: "What was the total amount you paid for health insurance in 2024?",
    type: "number",
    placeholder: "Health insurance costs",
    showIf: (a: Answers) => a[20] === "Yes",
  },
  {
    id: 22,
    question: "Did you have any long-term care insurance in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 23,
    question: "What was the total amount you paid for long-term care insurance in 2024?",
    type: "number",
    placeholder: "Long-term care insurance costs",
    showIf: (a: Answers) => a[22] === "Yes",
  },
  {
    id: 24,
    question: "Did you make any contributions to a Health Savings Account (HSA) in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 25,
    question: "What was the total amount you contributed to your HSA in 2024?",
    type: "number",
    placeholder: "HSA contributions",
    showIf: (a: Answers) => a[24] === "Yes",
  },
  {
    id: 26,
    question: "Did you withdraw any funds from your HSA in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 27,
    question: "What was the total amount you withdrew from your HSA in 2024?",
    type: "number",
    placeholder: "HSA withdrawals",
    showIf: (a: Answers) => a[26] === "Yes",
  },
  {
    id: 28,
    question: "Did you have any other health-related expenses in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 29,
    question: "Please describe any other health-related expenses you had in 2024.",
    type: "textarea",
    placeholder: "Other health expenses",
    showIf: (a: Answers) => a[28] === "Yes",
  },
  {
    id: 30,
    question: "Did you pay any state or local taxes in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 31,
    question: "What was the total amount you paid in state and local taxes in 2024?",
    type: "number",
    placeholder: "State and local taxes",
    showIf: (a: Answers) => a[30] === "Yes",
  },
  {
    id: 32,
    question: "Did you receive a refund for any state or local taxes in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 33,
    question: "What was the total amount of your state and local tax refund in 2024?",
    type: "number",
    placeholder: "Tax refund amount",
    showIf: (a: Answers) => a[32] === "Yes",
  },
  {
    id: 34,
    question: "Did you have any foreign income or pay any foreign taxes in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 35,
    question: "Please describe any foreign income or taxes you had in 2024.",
    type: "textarea",
    placeholder: "Foreign income/taxes",
    showIf: (a: Answers) => a[34] === "Yes",
  },
  {
    id: 36,
    question: "Did you receive any unemployment benefits in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 37,
    question: "What was the total amount of unemployment benefits you received in 2024?",
    type: "number",
    placeholder: "Unemployment benefits",
    showIf: (a: Answers) => a[36] === "Yes",
  },
  {
    id: 38,
    question: "Did you receive any Social Security benefits in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 39,
    question: "What was the total amount of Social Security benefits you received in 2024?",
    type: "number",
    placeholder: "Social Security benefits",
    showIf: (a: Answers) => a[38] === "Yes",
  },
  {
    id: 40,
    question: "Did you receive any pension or retirement account distributions in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 41,
    question: "What was the total amount of pension or retirement account distributions you received in 2024?",
    type: "number",
    placeholder: "Pension/retirement distributions",
    showIf: (a: Answers) => a[40] === "Yes",
  },
  {
    id: 42,
    question: "Did you have any other income in 2024 that hasn't been reported yet?",
    options: ["Yes", "No"]
  },
  {
    id: 43,
    question: "Please describe any other income you had in 2024.",
    type: "textarea",
    placeholder: "Other income",
    showIf: (a: Answers) => a[42] === "Yes",
  },
  {
    id: 44,
    question: "Did you have any adjustments to your income in 2024 (e.g., student loan interest, IRA contributions)?",
    options: ["Yes", "No"]
  },
  {
    id: 45,
    question: "What was the total amount of your adjustments in 2024?",
    type: "number",
    placeholder: "Adjustments to income",
    showIf: (a: Answers) => a[44] === "Yes",
  },
  {
    id: 46,
    question: "Did you take the standard deduction or itemize your deductions in 2024?",
    options: ["Standard Deduction", "Itemized Deductions"]
  },
  {
    id: 47,
    question: "If you itemized your deductions, what was the total amount of your itemized deductions in 2024?",
    type: "number",
    placeholder: "Itemized deductions",
    showIf: (a: Answers) => a[46] === "Itemized Deductions",
  },
  {
    id: 48,
    question: "Did you have any tax credits in 2024 (e.g., education credits, child tax credit)?",
    options: ["Yes", "No"]
  },
  {
    id: 49,
    question: "What was the total amount of your tax credits in 2024?",
    type: "number",
    placeholder: "Tax credits",
    showIf: (a: Answers) => a[48] === "Yes",
  },
  {
    id: 50,
    question: "Did you owe any additional taxes in 2024 (e.g., self-employment tax, alternative minimum tax)?",
    options: ["Yes", "No"]
  },
  {
    id: 51,
    question: "What was the total amount of additional taxes you owed in 2024?",
    type: "number",
    placeholder: "Additional taxes",
    showIf: (a: Answers) => a[50] === "Yes",
  },
  {
    id: 52,
    question: "Did you make any estimated tax payments in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 53,
    question: "What was the total amount of your estimated tax payments in 2024?",
    type: "number",
    placeholder: "Estimated tax payments",
    showIf: (a: Answers) => a[52] === "Yes",
  },
  {
    id: 54,
    question: "Did you receive a refund or owe taxes when you filed your 2024 tax return?",
    options: ["Refund", "Owe Taxes", "Neither"]
  },
  {
    id: 55,
    question: "What was the amount of your refund or the amount you owed in taxes for your 2024 tax return?",
    type: "number",
    placeholder: "Refund or taxes owed",
    showIf: (a: Answers) => a[54] === "Refund" || a[54] === "Owe Taxes",
  },
  {
    id: 56,
    question: "How would you like to receive your refund (if applicable)?",
    options: ["Direct Deposit", "Check by Mail"],
    showIf: (a: Answers) => a[54] === "Refund",
  },
  {
    id: 57,
    question: "If you owe taxes, how would you like to pay them?",
    options: ["Bank Transfer", "Check by Mail", "Credit/Debit Card"],
    showIf: (a: Answers) => a[54] === "Owe Taxes",
  },
  {
    id: 58,
    question: "Do you have any comments or questions about your tax return?",
    type: "textarea",
    placeholder: "Comments or questions",
  },
  {
    id: 59,
    question: "Would you like to schedule a review of your tax return with a TaxNavo expert?",
    options: ["Yes", "No"]
  },
  {
    id: 60,
    question: "What date and time would you prefer for the review?",
    type: "text", // fallback to text input
    placeholder: "Preferred date and time",
    showIf: (a: Answers) => a[59] === "Yes",
  },
  {
    id: 61,
    question: "Please provide your availability for a follow-up appointment.",
    type: "textarea",
    placeholder: "Availability details",
    showIf: (a: Answers) => a[59] === "Yes",
  },
  {
    id: 62,
    question: "Thank you for completing the TaxNavo Journey questionnaire! You&apos;re all set.",
    type: "text",
    placeholder: "Confirmation",
  },
];

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

export default function Tax2022Questionnaire() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'learn' | 'taxprep'>('taxprep');
  const [taxPrepTab, setTaxPrepTab] = useState<'questionnaire' | 'documents'>('questionnaire');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

  const progressPercent = Math.round(((step + 1) / visibleQuestions.length) * 100);

  // Filter questions based on showIf
  const visibleQuestions = questions.filter(
    (q) => !q.showIf || q.showIf(answers)
  );
  const current = visibleQuestions[step];

  // Clamp step to valid range if visibleQuestions changes
  useEffect(() => {
    if (step > visibleQuestions.length - 1) {
      setStep(visibleQuestions.length - 1 >= 0 ? visibleQuestions.length - 1 : 0);
    } else if (step < 0) {
      setStep(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleQuestions.length]);

  // Load saved answers for this user/year
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setLoading(true);
      fetch(`/api/questionnaire?year=2022`)
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

  // Save answers on change (debounced for real app)
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: 2022, answers }),
      });
    }
  }, [answers, status, session]);

  if (loading) return <div className="p-8">Loading your data...</div>;

  // Handle option button click
  function handleOption(option: string) {
    setAnswers((prev: Answers) => ({ ...prev, [current.id]: option }));
    setStep((s) => s + 1);
  }

  // Handle input change for text, number, date, textarea, email
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setAnswers((prev: Answers) => ({ ...prev, [current.id]: e.target.value }));
  }

  // Go to next question
  function handleNext() {
    setStep((s) => s + 1);
  }

  // Go to previous question
  function handlePrev() {
    setStep((s) => (s > 0 ? s - 1 : 0));
  }

  function handleSendChat() {
    if (!chatInput.trim()) return;
    setChatMessages((msgs) => [...msgs, { sender: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: "Thanks for your message! We'll get back to you soon." }
      ]);
    }, 800);
  }

  const renderTaxPrepTabs = () => (
    <div className="flex justify-center gap-4 mb-6">
      <button
        className={`px-3 py-1 rounded font-medium ${taxPrepTab === 'questionnaire' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        onClick={() => setTaxPrepTab('questionnaire')}
      >
        Questionnaire
      </button>
      <button
        className={`px-3 py-1 rounded font-medium ${taxPrepTab === 'documents' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        onClick={() => setTaxPrepTab('documents')}
      >
        Documents
      </button>
    </div>
  );

  let mainContent;
  if (activeTab === 'profile') {
    mainContent = (
      <div className={`${device === 'desktop' ? 'w-full h-full' : 'w-full max-w-md mx-auto'} bg-white rounded-xl shadow-lg p-8 flex flex-col items-center`}>
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-4">View and update your profile information.</p>
        <button
          className="px-6 py-2 rounded bg-[#8000FF] text-white font-semibold hover:bg-[#6a00cc]"
          onClick={() => router.push('/main/profile')}
        >
          Go to Profile
        </button>
      </div>
    );
  } else if (activeTab === 'learn') {
    mainContent = (
      <div className={`${device === 'desktop' ? 'w-full h-full' : 'w-full max-w-md mx-auto'} bg-white rounded-xl shadow-lg p-8 flex flex-col items-center`}>
        <h2 className="text-2xl font-bold mb-4">Learn</h2>
        <p className="mb-4">Access your personalized tax learning courses.</p>
        <button
          className="px-6 py-2 rounded bg-[#8000FF] text-white font-semibold hover:bg-[#6a00cc]"
          onClick={() => router.push('/main/learn')}
        >
          Go to Courses
        </button>
      </div>
    );
  } else if (activeTab === 'taxprep') {
    mainContent = (
      <div className={`${device === 'desktop' ? 'w-full h-full' : 'w-full max-w-md mx-auto'}`}>
        {renderTaxPrepTabs()}
        {taxPrepTab === 'questionnaire' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="h-3 rounded-full bg-[#F3E8FF] overflow-hidden mb-4">
                <div
                  className="h-3 rounded-full bg-[#FFC107]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#8000FF] mb-6">
              {current?.question.replace(/'/g, "&apos;")}
            </h2>
            <div className="flex flex-col gap-4">
              {current && isOptionQuestion(current) && (
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
              {current && isInputQuestion(current) && (
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
        )}
        {taxPrepTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Documents</h2>
            <p className="mb-4">Upload and manage your tax documents here.</p>
            <button
              className="px-6 py-2 rounded bg-[#8000FF] text-white font-semibold hover:bg-[#6a00cc]"
              onClick={() => router.push('/main/documents')}
            >
              Go to Documents
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step >= visibleQuestions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1] text-[#8000FF]">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
          <p className="mb-8 text-lg">Your responses have been received.</p>
          <pre className="bg-white p-4 rounded shadow text-left w-full max-w-md overflow-x-auto text-xs">{JSON.stringify(answers, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1]">
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 py-8 flex flex-col items-center">
        {mainContent}
      </main>
      <button
        className="fixed bottom-8 right-8 z-50 bg-[#8000FF] text-white rounded-full shadow-lg px-5 py-3 font-bold hover:bg-[#FFC107] hover:text-[#8000FF] transition-all"
        aria-label="Open chat"
        onClick={() => setChatOpen((v) => !v)}
      >
        {chatOpen ? "Close Chat" : "Chat"}
      </button>
      {chatOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-xl shadow-2xl border border-[#8000FF] flex flex-col">
          <div className="p-4 border-b border-[#8000FF] bg-[#8000FF] text-white rounded-t-xl font-bold">Support Chat</div>
          <div className="flex-1 p-4 overflow-y-auto max-h-64">
            {chatMessages.length === 0 && (
              <div className="text-gray-400 text-sm">No messages yet. Ask us anything!</div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[70%] ${msg.sender === "user" ? "bg-[#8000FF] text-white" : "bg-gray-100 text-gray-800"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#8000FF] flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8000FF]"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
            />
            <button
              className="px-4 py-2 rounded bg-[#8000FF] text-white font-semibold hover:bg-[#FFC107] hover:text-[#8000FF] transition-all"
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
