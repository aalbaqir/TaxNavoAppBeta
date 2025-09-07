"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- Types for story-style questionnaire ---
interface QuestionBase {
  id: number;
  question: string;
  showIf?: (a: Record<number, string | number | undefined>) => boolean;
  placeholder?: string;
}
interface OptionQuestion extends QuestionBase {
  options: string[];
}
interface InputQuestion extends QuestionBase {
  type: "text" | "number" | "date" | "textarea" | "email";
}
type Question = OptionQuestion | InputQuestion;
type Answers = Record<number, string | number | undefined>;
interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

// --- 2025 Questionnaire Data (update wording for 2025) ---
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
    question: "What was your marital status on December 31, 2025?",
    options: ["Single", "Married", "Head of Household", "Qualifying Widow(er)"]
  },
  {
    id: 5,
    question: "Did you support any dependents in 2025?",
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
    question: "Did you live at your current address for the entire year of 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 12,
    question: "Did you have any other addresses in 2025?",
    options: ["Yes", "No"],
    showIf: (a: Answers) => a[11] === "No",
  },
  {
    id: 13,
    question: "Please provide any other addresses you had in 2025, along with the dates you lived at each address.",
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
    question: "What was your total income for 2025?",
    type: "number",
    placeholder: "Total income",
  },
  {
    id: 18,
    question: "Did you have any other sources of income in 2025?",
    options: ["Yes", "No"],
  },
  {
    id: 19,
    question: "Please describe any other sources of income you had in 2025.",
    type: "textarea",
    placeholder: "Other income sources",
    showIf: (a: Answers) => a[18] === "Yes",
  },
  {
    id: 20,
    question: "Did you pay for health insurance in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 21,
    question: "What was the total amount you paid for health insurance in 2025?",
    type: "number",
    placeholder: "Health insurance costs",
    showIf: (a: Answers) => a[20] === "Yes",
  },
  {
    id: 22,
    question: "Did you have any long-term care insurance in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 23,
    question: "What was the total amount you paid for long-term care insurance in 2025?",
    type: "number",
    placeholder: "Long-term care insurance costs",
    showIf: (a: Answers) => a[22] === "Yes",
  },
  {
    id: 24,
    question: "Did you make any contributions to a Health Savings Account (HSA) in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 25,
    question: "What was the total amount you contributed to your HSA in 2025?",
    type: "number",
    placeholder: "HSA contributions",
    showIf: (a: Answers) => a[24] === "Yes",
  },
  {
    id: 26,
    question: "Did you withdraw any funds from your HSA in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 27,
    question: "What was the total amount you withdrew from your HSA in 2025?",
    type: "number",
    placeholder: "HSA withdrawals",
    showIf: (a: Answers) => a[26] === "Yes",
  },
  {
    id: 28,
    question: "Did you have any other health-related expenses in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 29,
    question: "Please describe any other health-related expenses you had in 2025.",
    type: "textarea",
    placeholder: "Other health expenses",
    showIf: (a: Answers) => a[28] === "Yes",
  },
  {
    id: 30,
    question: "Did you pay any state or local taxes in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 31,
    question: "What was the total amount you paid in state and local taxes in 2025?",
    type: "number",
    placeholder: "State and local taxes",
    showIf: (a: Answers) => a[30] === "Yes",
  },
  {
    id: 32,
    question: "Did you receive a refund for any state or local taxes in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 33,
    question: "What was the total amount of your state and local tax refund in 2025?",
    type: "number",
    placeholder: "Tax refund amount",
    showIf: (a: Answers) => a[32] === "Yes",
  },
  {
    id: 34,
    question: "Did you have any foreign income or pay any foreign taxes in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 35,
    question: "Please describe any foreign income or taxes you had in 2025.",
    type: "textarea",
    placeholder: "Foreign income/taxes",
    showIf: (a: Answers) => a[34] === "Yes",
  },
  {
    id: 36,
    question: "Did you receive any unemployment benefits in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 37,
    question: "What was the total amount of unemployment benefits you received in 2025?",
    type: "number",
    placeholder: "Unemployment benefits",
    showIf: (a: Answers) => a[36] === "Yes",
  },
  {
    id: 38,
    question: "Did you receive any Social Security benefits in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 39,
    question: "What was the total amount of Social Security benefits you received in 2025?",
    type: "number",
    placeholder: "Social Security benefits",
    showIf: (a: Answers) => a[38] === "Yes",
  },
  {
    id: 40,
    question: "Did you receive any pension or retirement account distributions in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 41,
    question: "What was the total amount of pension or retirement account distributions you received in 2025?",
    type: "number",
    placeholder: "Pension/retirement distributions",
    showIf: (a: Answers) => a[40] === "Yes",
  },
  {
    id: 42,
    question: "Did you have any other income in 2025 that hasn't been reported yet?",
    options: ["Yes", "No"]
  },
  {
    id: 43,
    question: "Please describe any other income you had in 2025.",
    type: "textarea",
    placeholder: "Other income",
    showIf: (a: Answers) => a[42] === "Yes",
  },
  {
    id: 44,
    question: "Did you have any adjustments to your income in 2025 (e.g., student loan interest, IRA contributions)?",
    options: ["Yes", "No"]
  },
  {
    id: 45,
    question: "What was the total amount of your adjustments in 2025?",
    type: "number",
    placeholder: "Adjustments to income",
    showIf: (a: Answers) => a[44] === "Yes",
  },
  {
    id: 46,
    question: "Did you take the standard deduction or itemize your deductions in 2025?",
    options: ["Standard Deduction", "Itemized Deductions"]
  },
  {
    id: 47,
    question: "If you itemized your deductions, what was the total amount of your itemized deductions in 2025?",
    type: "number",
    placeholder: "Itemized deductions",
    showIf: (a: Answers) => a[46] === "Itemized Deductions",
  },
  {
    id: 48,
    question: "Did you have any tax credits in 2025 (e.g., education credits, child tax credit)?",
    options: ["Yes", "No"]
  },
  {
    id: 49,
    question: "What was the total amount of your tax credits in 2025?",
    type: "number",
    placeholder: "Tax credits",
    showIf: (a: Answers) => a[48] === "Yes",
  },
  {
    id: 50,
    question: "Did you owe any additional taxes in 2025 (e.g., self-employment tax, alternative minimum tax)?",
    options: ["Yes", "No"]
  },
  {
    id: 51,
    question: "What was the total amount of additional taxes you owed in 2025?",
    type: "number",
    placeholder: "Additional taxes",
    showIf: (a: Answers) => a[50] === "Yes",
  },
  {
    id: 52,
    question: "Did you make any estimated tax payments in 2025?",
    options: ["Yes", "No"]
  },
  {
    id: 53,
    question: "What was the total amount of your estimated tax payments in 2025?",
    type: "number",
    placeholder: "Estimated tax payments",
    showIf: (a: Answers) => a[52] === "Yes",
  },
  {
    id: 54,
    question: "Did you receive a refund or owe taxes when you filed your 2025 tax return?",
    options: ["Refund", "Owe Taxes", "Neither"]
  },
  {
    id: 55,
    question: "What was the amount of your refund or the amount you owed in taxes for your 2025 tax return?",
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
    type: "text",
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
    question: "Thank you for completing the TaxNavo Journey questionnaire! You're all set for your 2025 tax situation.",
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

export default function Tax2025Questionnaire() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const current = questions[step];
  const [activeTab, setActiveTab] = useState<'profile' | 'learn' | 'taxprep'>('taxprep');
  const [taxPrepTab, setTaxPrepTab] = useState<'questionnaire' | 'documents'>('questionnaire');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [activeYear, setActiveYear] = useState(2025);

  // --- Data fetching logic for 2025 ---
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setLoading(true);
      fetch(`/api/questionnaire?year=2025`)
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
        body: JSON.stringify({ year: 2025, answers }),
      });
    }
  }, [answers, status, session]);

  function handleOption(option: string) {
    setAnswers((prev: Answers) => ({ ...prev, [current.id]: option }));
    setStep((s) => s + 1);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setAnswers((prev: Answers) => ({ ...prev, [current.id]: e.target.value }));
  }

  function handleNext() {
    setStep((s) => s + 1);
  }

  function handlePrev() {
    setStep((s) => (s > 0 ? s - 1 : 0));
  }

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Simulate assistant response
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

  // --- Progress Bar Animation ---
  const progress = Math.round(((step + 1) / questions.length) * 100);

  // --- Main Content with Framer Motion ---
  const renderQuestionnaire = () => (
    <motion.div
      key={activeYear + "-" + step}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <motion.div
          className="h-3 rounded-full bg-[#F3E8FF] overflow-hidden mb-4"
          initial={false}
        >
          <motion.div
            className="h-3 rounded-full bg-[#FFC107]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#8000FF] font-semibold">Step {step + 1} of {questions.length}</span>
          <span className="text-sm text-[#FFC107] font-bold">{progress}% Complete</span>
        </div>
      </div>
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-[#8000FF] mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {current?.question}
      </motion.h2>
      {current && isOptionQuestion(current) && (
        <div className="flex flex-col gap-4">
          {current.options.map((option) => (
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
      {current && isInputQuestion(current) && (
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
        <span className="text-xs text-gray-400">Need help? <span className="underline cursor-pointer" onClick={() => setChatOpen(true)}>Chat with support</span></span>
      </div>
    </motion.div>
  );

  // --- Animated Year Content Switcher ---
  const renderYearContent = () => (
    <AnimatePresence mode="wait">
      {activeYear === 2025 && taxPrepTab === "questionnaire" && (
        <motion.div key="2025" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
          {renderQuestionnaire()}
        </motion.div>
      )}
      {/* Optionally, import and render other years' components here */}
    </AnimatePresence>
  );

  // --- Responsive Layout & Background ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1]">
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 py-8 flex flex-col items-center">
        {/* Sub-tabs for Tax Preparation */}
        {activeTab === "taxprep" && (
          <motion.div
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          />
        )}
        {/* Main Content Switcher */}
        <div className="w-full">
          {activeTab === "taxprep" && taxPrepTab === "questionnaire" && renderYearContent()}
          {activeTab === "taxprep" && taxPrepTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4 text-[#8000FF]">Documents</h2>
              <p className="mb-4 text-gray-700">Upload and manage your tax documents here.</p>
              <button
                className="px-6 py-3 rounded-xl bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
                onClick={() => router.push("/main/documents")}
              >
                Go to Documents
              </button>
            </motion.div>
          )}
          {activeTab !== "taxprep" && (
            <motion.div
              key="other-tabs"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-[#8000FF] capitalize">{activeTab}</h2>
              <p className="mb-4 text-gray-700">
                {activeTab === "profile"
                  ? "View and update your profile information."
                  : "Access your personalized tax learning courses."}
              </p>
              <button
                className="px-6 py-3 rounded-xl bg-[#8000FF] text-white font-semibold shadow hover:bg-[#FFC107] hover:text-[#8000FF] transition-colors duration-150"
                onClick={() => router.push(activeTab === "profile" ? "/main/profile" : "/main/learn")}
              >
                {activeTab === "profile" ? "Go to Profile" : "Go to Courses"}
              </button>
            </motion.div>
          )}
        </div>
      </main>
      {/* Chat Floating Button and Chat Window */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-[#8000FF] text-white rounded-full shadow-lg px-5 py-3 font-bold hover:bg-[#FFC107] hover:text-[#8000FF] transition-all"
        onClick={() => setChatOpen((v) => !v)}
        aria-label="Open chat"
      >
        {chatOpen ? "Close Chat" : "Chat"}
      </button>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-xl shadow-2xl border border-[#8000FF] flex flex-col"
          >
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
              <div ref={chatEndRef} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
