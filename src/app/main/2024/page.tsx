"use client";
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TabsHeader from "@/components/TabsHeader";
import Tax2023Questionnaire from "../2023/page";
import Tax2022Questionnaire from "../2022/page";
import Tax2025Questionnaire from "../2025/page";
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

// --- Questionnaire Data (truncated for brevity, keep your full list) ---
const questions: Question[] = [
  {
    id: 1,
    question: "What is your full legal name as it appears on your Social Security card?",
    type: "text",
    placeholder: "Full legal name"
  },
  // ...rest of your questions...
  {
    id: 85,
    question: "Do you have any additional information or comments about your 2024 tax situation?",
    type: "textarea",
    placeholder: "Additional information"
  }
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

const yearTabs = [
  { year: 2022, label: "2022" },
  { year: 2023, label: "2023" },
  { year: 2024, label: "2024" },
  { year: 2025, label: "2025" },
];

export default function Tax2024Questionnaire() {
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
  const [activeYear, setActiveYear] = useState(2024);

  // --- Data fetching logic (unchanged) ---
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setLoading(true);
      fetch(`/api/questionnaire?year=2024`)
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
        body: JSON.stringify({ year: 2024, answers }),
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

  // --- Modern Header ---
  const renderModernHeader = () => (
    <header className="w-full bg-gradient-to-r from-[#8000FF] via-[#6a00cc] to-[#FFC107] shadow-lg py-4 px-2 md:px-8 flex flex-col md:flex-row items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-white font-extrabold text-2xl tracking-tight drop-shadow-lg">TaxNavo</Link>
        <nav className="flex gap-2 md:gap-4 ml-4">
          {["Profile", "Learn", "Tax Preparation"].map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full font-semibold text-lg transition-all duration-200
                ${activeTab === tab.toLowerCase().replace(" ", "") ? "bg-white text-[#8000FF] shadow" : "bg-white/20 text-white hover:bg-white/40"}
              `}
              onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "") as typeof activeTab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <button
          className={`px-4 py-1 rounded-full font-semibold shadow transition-all duration-150 border bg-white/80 text-[#8000FF] border-[#8000FF] hover:bg-[#FFC107] hover:text-[#8000FF]`}
          onClick={() => setDevice("mobile")}
          aria-label="Switch to mobile view"
        >
          <span className="inline-block align-middle mr-1">📱</span>Mobile
        </button>
        <button
          className={`px-4 py-1 rounded-full font-semibold shadow transition-all duration-150 border bg-[#8000FF] text-white border-[#8000FF] scale-105`}
          onClick={() => setDevice("desktop")}
          aria-label="Switch to desktop view"
        >
          <span className="inline-block align-middle mr-1">🖥️</span>Desktop
        </button>
      </div>
    </header>
  );

  // --- Uniform Year Tabs ---
  const renderYearTabs = () => (
    <div className="flex justify-center gap-3 mb-8">
      {yearTabs.map(({ year, label }) => (
        <motion.button
          key={year}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          className={`px-6 py-2 rounded-full font-semibold text-lg border transition-all duration-200 shadow-sm
            ${activeYear === year
              ? "bg-[#FFC107] text-[#8000FF] border-[#FFC107] shadow-lg"
              : "bg-white text-[#8000FF] border-[#8000FF]/20 hover:bg-[#F3E8FF] hover:border-[#8000FF]"}
          `}
          onClick={() => setActiveYear(year)}
        >
          {label}
        </motion.button>
      ))}
    </div>
  );

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
      {activeYear === 2024 && taxPrepTab === "questionnaire" && (
        <motion.div key="2024" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
          {renderQuestionnaire()}
        </motion.div>
      )}
      {activeYear === 2023 && (
        <motion.div key="2023" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
          <Tax2023Questionnaire />
        </motion.div>
      )}
      {activeYear === 2022 && (
        <motion.div key="2022" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
          <Tax2022Questionnaire />
        </motion.div>
      )}
      {activeYear === 2025 && (
        <motion.div key="2025" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
          <Tax2025Questionnaire />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --- Responsive Layout & Background ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1]">
      {renderModernHeader()}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 py-8 flex flex-col items-center">
        {/* Uniform Year Tabs */}
        {activeTab === "taxprep" && renderYearTabs()}
        {/* Sub-tabs for Tax Preparation */}
        {activeTab === "taxprep" && (
          <motion.div
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              className={`px-5 py-2 rounded-full font-semibold text-base transition-all duration-200
                ${taxPrepTab === "questionnaire"
                  ? "bg-[#8000FF] text-white shadow"
                  : "bg-white text-[#8000FF] border border-[#8000FF]/20 hover:bg-[#F3E8FF] hover:border-[#8000FF]"}
              `}
              onClick={() => setTaxPrepTab("questionnaire")}
            >
              Questionnaire
            </button>
            <button
              className={`px-5 py-2 rounded-full font-semibold text-base transition-all duration-200
                ${taxPrepTab === "documents"
                  ? "bg-[#8000FF] text-white shadow"
                  : "bg-white text-[#8000FF] border border-[#8000FF]/20 hover:bg-[#F3E8FF] hover:border-[#8000FF]"}
              `}
              onClick={() => setTaxPrepTab("documents")}
            >
              Documents
            </button>
          </motion.div>
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
