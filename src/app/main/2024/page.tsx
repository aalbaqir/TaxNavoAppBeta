"use client";
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import TabsHeader from '../../../components/TabsHeader';
import Tax2023Questionnaire from '../2023/page';
import Tax2022Questionnaire from '../2022/page';
import Tax2025Questionnaire from '../2025/page';

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

// ---
// 🎮 TaxNavo Journey: Story-Style, Contingent IRS 1040 Questionnaire
// ---
// Chapter 1: Identity & Filing Status
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
    question: "If yes, please provide the name and SSN of each dependent:",
    type: "textarea",
    placeholder: "Name and SSN",
    showIf: (a: Answers) => a[5] === "Yes",
  },
  {
    id: 7,
    question: "Did you live in the same residence for all of 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 8,
    question: "If no, please provide your previous address:",
    type: "text",
    placeholder: "Previous address",
    showIf: (a: Answers) => a[7] === "No",
  },
  {
    id: 9,
    question: "What is your preferred language for communication?",
    options: ["English", "Spanish", "Other"]
  },
  {
    id: 10,
    question: "If other, please specify:",
    type: "text",
    placeholder: "Preferred language",
    showIf: (a: Answers) => a[9] === "Other",
  },
  {
    id: 11,
    question: "What is your email address?",
    type: "email",
    placeholder: "Email address"
  },
  {
    id: 12,
    question: "What is your phone number?",
    type: "text",
    placeholder: "Phone number"
  },
  {
    id: 13,
    question: "How would you like to receive updates about your tax return?",
    options: ["Email", "SMS", "Mail"]
  },
  {
    id: 14,
    question: "If by mail, please provide your mailing address:",
    type: "text",
    placeholder: "Mailing address",
    showIf: (a: Answers) => a[13] === "Mail",
  },
  {
    id: 15,
    question: "Have you filed a tax return before?",
    options: ["Yes", "No"]
  },
  {
    id: 16,
    question: "If yes, what method did you use to file?",
    options: ["Online", "Paper", "Tax Professional"],
    showIf: (a: Answers) => a[15] === "Yes",
  }
  ,
  {
    id: 17,
    question: "Did you receive a refund or owe taxes last year?",
    options: ["Refund", "Owe", "Neither"],
    showIf: (a: Answers) => a[15] === "Yes",
  },
  {
    id: 18,
    question: "What was the amount of your refund or tax owed?",
    type: "number",
    placeholder: "Amount",
    showIf: (a: Answers) => a[17] === "Refund" || a[17] === "Owe",
  },
  {
    id: 19,
    question: "Are you or your spouse a member of the military?",
    options: ["Yes", "No"]
  },
  {
    id: 20,
    question: "Did you receive any unemployment benefits in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 21,
    question: "Did you have health insurance coverage for all of 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 22,
    question: "Did you receive a 1095-A, B, or C form for health coverage?",
    options: ["Yes", "No"],
    showIf: (a: Answers) => a[21] === "No",
  },
  {
    id: 23,
    question: "Did you have any other income in 2024 not reported on a W-2 or 1099?",
    options: ["Yes", "No"]
  },
  {
    id: 24,
    question: "If yes, please describe the source and amount:",
    type: "textarea",
    placeholder: "Source and amount",
    showIf: (a: Answers) => a[23] === "Yes",
  },
  {
    id: 25,
    question: "Did you make any estimated tax payments in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 26,
    question: "If yes, please provide the dates and amounts:",
    type: "textarea",
    placeholder: "Dates and amounts",
    showIf: (a: Answers) => a[25] === "Yes",
  },
  {
    id: 27,
    question: "Did you receive any notices from the IRS or state tax agency in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 28,
    question: "If yes, please describe the notice and your response:",
    type: "textarea",
    placeholder: "Notice and response",
    showIf: (a: Answers) => a[27] === "Yes",
  },
  {
    id: 29,
    question: "Are you currently under audit or investigation by the IRS or state tax agency?",
    options: ["Yes", "No"]
  },
  {
    id: 30,
    question: "If yes, please provide details:",
    type: "textarea",
    placeholder: "Details",
    showIf: (a: Answers) => a[29] === "Yes",
  },
  {
    id: 31,
    question: "Have you ever filed an extension for your tax return?",
    options: ["Yes", "No"]
  },
  {
    id: 32,
    question: "If yes, for which years did you file an extension?",
    type: "textarea",
    placeholder: "Years",
    showIf: (a: Answers) => a[31] === "Yes",
  },
  {
    id: 33,
    question: "Did you or your spouse change jobs in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 34,
    question: "If yes, please provide the name of the employer and dates of employment:",
    type: "textarea",
    placeholder: "Employer and dates",
    showIf: (a: Answers) => a[33] === "Yes",
  },
  {
    id: 35,
    question: "Did you take any distributions from retirement accounts in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 36,
    question: "If yes, please provide the type of account and amount:",
    type: "textarea",
    placeholder: "Account type and amount",
    showIf: (a: Answers) => a[35] === "Yes",
  },
  {
    id: 37,
    question: "Did you contribute to a retirement account in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 38,
    question: "If yes, please provide the type of account and amount:",
    type: "textarea",
    placeholder: "Account type and amount",
    showIf: (a: Answers) => a[37] === "Yes",
  },
  {
    id: 39,
    question: "Did you have any foreign bank accounts or assets in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 40,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    showIf: (a: Answers) => a[39] === "Yes",
  },
  {
    id: 41,
    question: "Did you receive any income from foreign sources in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 42,
    question: "If yes, please describe the source and amount:",
    type: "textarea",
    placeholder: "Source and amount",
    showIf: (a: Answers) => a[41] === "Yes",
  },
  {
    id: 43,
    question: "Did you pay any foreign taxes in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 44,
    question: "If yes, please provide the amount and type of tax:",
    type: "textarea",
    placeholder: "Amount and type",
    showIf: (a: Answers) => a[43] === "Yes",
  },
  {
    id: 45,
    question: "Did you have any virtual currency transactions in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 46,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    showIf: (a: Answers) => a[45] === "Yes",
  },
  {
    id: 47,
    question: "Did you receive any gifts or inheritances in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 48,
    question: "If yes, please describe the gift or inheritance and its value:",
    type: "textarea",
    placeholder: "Description and value",
    showIf: (a: Answers) => a[47] === "Yes",
  },
  {
    id: 49,
    question: "Did you make any large purchases or sales in 2024 (e.g., real estate, vehicles)?",
    options: ["Yes", "No"]
  },
  {
    id: 50,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    showIf: (a: Answers) => a[49] === "Yes",
  },
  {
    id: 51,
    question: "Did you have any other significant financial events in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 52,
    question: "If yes, please describe the event and its impact on your finances:",
    type: "textarea",
    placeholder: "Event and impact",
    showIf: (a: Answers) => a[51] === "Yes",
  },
  {
    id: 53,
    question: "Are you married filing jointly or separately?",
    options: ["Jointly", "Separately"],
    // showIf: (a: Answers) => a[4] === "Married",
  },
  {
    id: 54,
    question: "Did you or your spouse receive any income in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 55,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    // showIf: (a: Answers) => a[54] === "Yes",
  },
  {
    id: 56,
    question: "Did you or your spouse contribute to an IRA or other retirement account in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 57,
    question: "If yes, please provide the type of account and amount:",
    type: "textarea",
    placeholder: "Account type and amount",
    // showIf: (a: Answers) => a[56] === "Yes",
  },
  {
    id: 58,
    question: "Did you or your spouse withdraw funds from an IRA or other retirement account in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 59,
    question: "If yes, please provide the type of account and amount:",
    type: "textarea",
    placeholder: "Account type and amount",
    // showIf: (a: Answers) => a[58] === "Yes",
  },
  {
    id: 60,
    question: "Did you or your spouse have any foreign bank accounts or assets in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 61,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    // showIf: (a: Answers) => a[60] === "Yes",
  },
  {
    id: 62,
    question: "Did you or your spouse receive any income from foreign sources in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 63,
    question: "If yes, please describe the source and amount:",
    type: "textarea",
    placeholder: "Source and amount",
    // showIf: (a: Answers) => a[62] === "Yes",
  },
  {
    id: 64,
    question: "Did you or your spouse pay any foreign taxes in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 65,
    question: "If yes, please provide the amount and type of tax:",
    type: "textarea",
    placeholder: "Amount and type",
    // showIf: (a: Answers) => a[64] === "Yes",
  },
  {
    id: 66,
    question: "Did you or your spouse have any virtual currency transactions in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 67,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    // showIf: (a: Answers) => a[66] === "Yes",
  },
  {
    id: 68,
    question: "Did you or your spouse receive any gifts or inheritances in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 69,
    question: "If yes, please describe the gift or inheritance and its value:",
    type: "textarea",
    placeholder: "Description and value",
    // showIf: (a: Answers) => a[68] === "Yes",
  },
  {
    id: 70,
    question: "Did you or your spouse make any large purchases or sales in 2024 (e.g., real estate, vehicles)?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 71,
    question: "If yes, please provide the details:",
    type: "textarea",
    placeholder: "Details",
    // showIf: (a: Answers) => a[70] === "Yes",
  },
  {
    id: 72,
    question: "Did you or your spouse have any other significant financial events in 2024?",
    options: ["Yes", "No"],
    // showIf: (a: Answers) => a[53].includes("Jointly") || a[53].includes("Separately"),
  },
  {
    id: 73,
    question: "If yes, please describe the event and its impact on your finances:",
    type: "textarea",
    placeholder: "Event and impact",
    // showIf: (a: Answers) => a[72] === "Yes",
  },
  {
    id: 74,
    question: "What was your total income in 2024?",
    type: "number",
    placeholder: "Total income"
  },
  {
    id: 75,
    question: "What was your total tax withheld in 2024?",
    type: "number",
    placeholder: "Total tax withheld"
  },
  {
    id: 76,
    question: "Did you have any tax credits or deductions in 2024?",
    options: ["Yes", "No"]
  },
  {
    id: 77,
    question: "If yes, please describe the credits or deductions:",
    type: "textarea",
    placeholder: "Credits or deductions",
    showIf: (a: Answers) => a[76] === "Yes",
  },
  {
    id: 78,
    question: "What was your total tax liability for 2024?",
    type: "number",
    placeholder: "Total tax liability"
  },
  {
    id: 79,
    question: "Did you receive a refund or owe taxes when you filed your return?",
    options: ["Refund", "Owe", "Neither"]
  },
  {
    id: 80,
    question: "If you owed taxes, did you pay them in full?",
    options: ["Yes", "No"],
    showIf: (a: Answers) => a[79] === "Owe",
  },
  {
    id: 81,
    question: "Did you apply for an extension to file your tax return?",
    options: ["Yes", "No"]
  },
  {
    id: 82,
    question: "If yes, was your extension granted?",
    options: ["Yes", "No"],
    showIf: (a: Answers) => a[81] === "Yes",
  },
  {
    id: 83,
    question: "Did you file your tax return on time?",
    options: ["Yes", "No"]
  },
  {
    id: 84,
    question: "If no, please explain why:",
    type: "textarea",
    placeholder: "Explanation",
    showIf: (a: Answers) => a[83] === "No",
  },
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

// Add Answers type for useState and showIf

type Answers = Record<number, string | number | undefined>;

// Chat message type
interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

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

  // Tax Preparation sub-tabs
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

  // Main tab content
  let mainContent;
  if (activeTab === 'profile') {
    mainContent = (
      <div className={`${device === 'desktop' ? 'w-full h-full' : 'w-full max-w-md mx-auto'} bg-white rounded-xl shadow-lg p-8 flex flex-col items-center`}>
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-4">View and update your profile information.</p>
        <button
          className="px-6 py-2 rounded bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
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
          className="px-6 py-2 rounded bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
          onClick={() => router.push('/main/learn')}
        >
          Go to Courses
        </button>
      </div>
    );
  } else if (activeTab === 'taxprep') {
    mainContent = (
      <div className={`${device === 'desktop' ? 'w-full h-full' : 'w-full max-w-md mx-auto'}`}>
        {/* Always show year selector when in taxprep tab */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg mb-1">Choose Tax Year:</label>
            <div className="flex gap-2 flex-wrap">
              {[2022, 2023, 2024, 2025].map((year) => (
                <button
                  key={year}
                  className={`px-4 py-2 rounded-lg font-medium border transition-colors duration-150 ${activeYear === year ? 'bg-yellow-400 text-yellow-900 border-yellow-500' : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
        {taxPrepTab === 'questionnaire' && (
          <div>
            {activeYear === 2024 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6">2024 Tax Year Intake</h1>
                <div className="mb-8">
                  <p className="text-lg font-medium mb-4">{current?.question.replace(/'/g, "&apos;")}</p>
                  {current && isOptionQuestion(current) && (
                    <div className="flex flex-col gap-3">
                      {current.options.map((option: string) => (
                        <button
                          key={option}
                          className="px-6 py-3 rounded-lg border border-purple-200 bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold transition-colors duration-150"
                          onClick={() => handleOption(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {current && isInputQuestion(current) && current.type === "date" && (
                    <div className="flex flex-col gap-3">
                      <input
                        type="date"
                        className="px-4 py-2 rounded border border-purple-200"
                        value={answers[current.id] || ""}
                        onChange={handleInput}
                      />
                      <button
                        className="mt-2 px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
                        onClick={handleNext}
                        disabled={!answers[current.id]}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  {current && isInputQuestion(current) && current.type === "number" && (
                    <div className="flex flex-col gap-3">
                      <input
                        type="number"
                        className="px-4 py-2 rounded border border-purple-200"
                        placeholder={current.placeholder}
                        value={answers[current.id] || ""}
                        onChange={handleInput}
                      />
                      <button
                        className="mt-2 px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
                        onClick={handleNext}
                        disabled={!answers[current.id]}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  {current && isInputQuestion(current) && (current.type === "text" || current.type === "email") && (
                    <div className="flex flex-col gap-3">
                      <input
                        type={current.type}
                        className="px-4 py-2 rounded border border-purple-200"
                        placeholder={current.placeholder}
                        value={answers[current.id] || ""}
                        onChange={handleInput}
                      />
                      <button
                        className="mt-2 px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
                        onClick={handleNext}
                        disabled={!answers[current.id]}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  {current && isInputQuestion(current) && current.type === "textarea" && (
                    <div className="flex flex-col gap-3">
                      <textarea
                        className="px-4 py-2 rounded border border-purple-200"
                        placeholder={current.placeholder}
                        value={answers[current.id] || ""}
                        onChange={handleInput}
                        rows={4}
                      />
                      <button
                        className="mt-2 px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
                        onClick={handleNext}
                        disabled={!answers[current.id]}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <button
                    className="text-purple-500 hover:underline"
                    onClick={handlePrev}
                    disabled={step === 0}
                  >
                    Back
                  </button>
                  <span className="text-sm text-purple-400">Step {step + 1} of {questions.length}</span>
                </div>
              </div>
            )}
            {activeYear === 2023 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <Tax2023Questionnaire />
              </div>
            )}
            {activeYear === 2022 && (
              <Tax2022Questionnaire />
            )}
            {activeYear === 2025 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <Tax2025Questionnaire />
              </div>
            )}
          </div>
        )}
        {taxPrepTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Documents</h2>
            <p className="mb-4">Upload and manage your tax documents here.</p>
            <button
              className="px-6 py-2 rounded bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
              onClick={() => router.push('/main/documents')}
            >
              Go to Documents
            </button>
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="p-8">Loading your data...</div>;
  if (step >= questions.length && activeTab === 'taxprep' && taxPrepTab === 'questionnaire') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-900">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
          <p className="mb-8 text-lg">Your responses have been received.</p>
          <pre className="bg-white p-4 rounded shadow text-left w-full max-w-md overflow-x-auto text-xs">{JSON.stringify(answers, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-purple-50 text-purple-900">
      {/* Only render TabsHeader once at the very top of the page */}
      <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} showDeviceSwitch device={device} setDevice={setDevice} />
      <div className="flex-1 flex flex-col items-center justify-center">
        {mainContent}
        {/* Chat Floating Button and Chat Window (unchanged) */}
        <button
          className="fixed bottom-8 right-8 z-50 bg-brand-blue text-white rounded-full shadow-lg px-5 py-3 font-bold hover:bg-brand-teal transition-all"
          onClick={() => setChatOpen((v) => !v)}
          aria-label="Open chat"
        >
          {chatOpen ? "Close Chat" : "Chat"}
        </button>
        {chatOpen && (
          <div className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-xl shadow-2xl border border-brand-blue flex flex-col">
            <div className="p-4 border-b border-brand-blue bg-brand-blue text-white rounded-t-xl font-bold">Support Chat</div>
            <div className="flex-1 p-4 overflow-y-auto max-h-64">
              {chatMessages.length === 0 && (
                <div className="text-gray-400 text-sm">No messages yet. Ask us anything!</div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm max-w-[70%] ${msg.sender === "user" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-800"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-brand-blue flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
              />
              <button
                className="px-4 py-2 rounded bg-brand-blue text-white font-semibold hover:bg-brand-teal transition-all"
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
