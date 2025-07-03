"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

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
  },
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

export default function Tax2024Questionnaire() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [uploaded, setUploaded] = useState<{ [doc: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const uploadUrl = typeof window !== "undefined" ? `${window.location.origin}/main/2024/phone-upload` : "";

  const current = questions[step];

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

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", "Primary Income");
      fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          if (res.ok) {
            setUploaded((prev) => ({ ...prev, [file.name]: true }));
            // Simulate scraping: in real app, call a /api/scrape endpoint
            const fakeScraped = { name: "John Doe", ssn: "123-45-6789", wages: 50000 };
            setAnswers((prev: Answers) => ({ ...prev, 100: JSON.stringify(fakeScraped) }));
            setStep(2); // Move to next question after upload
          } else {
            const data = await res.json();
            alert("Upload failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(() => {
          alert("Upload failed. Please try again. Make sure your file is under 5MB and in PDF, JPG, or PNG format.");
        });
    }
  }

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

  if (loading) return <div className="p-8">Loading your data...</div>;

  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-gradient text-brand-black dark:text-brand-white">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">2024 Tax Year Questionnaire</h1>
          <p className="mb-4">
            To begin, upload your primary income document (W-2, 1099, SSA-1099) or last year&apos;s tax return.<br />You can also take a photo with your phone.
          </p>
          <div className="mb-4 p-4 rounded-lg bg-yellow-100 border-l-4 border-yellow-400 text-yellow-900 font-semibold shadow">
            <span className="block mb-1">Required: Upload your primary income document (W-2, 1099, SSA-1099) or last year&apos;s tax return to begin.</span>
            <span className="block text-sm font-normal">Accepted formats: PDF, JPG, PNG. Max size: 5MB. If you have trouble uploading, try a different browser or device.</span>
          </div>
          {/* Upload Document Button (2024) - fixed structure */}
          <div className="flex flex-col gap-4 mb-4">
            <label htmlFor="file-upload-2024" className="w-full cursor-pointer">
              <input
                id="file-upload-2024"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />
              <span className="w-full flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-brand-blue to-brand-teal text-white font-extrabold text-lg shadow-lg border-2 border-brand-blue hover:from-brand-teal hover:to-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 transition-all duration-200 animate-pulse">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                Upload or Choose File
              </span>
            </label>
          </div>
          <button
            className="w-full py-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-green text-white font-bold shadow-button hover:from-brand-green hover:to-brand-teal transition-all duration-200 text-lg"
            onClick={() => setShowQR((v) => !v)}
            type="button"
          >
            {showQR ? "Hide QR Code" : "Show QR Code for Phone Upload"}
          </button>
          {showQR && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-sm mb-2">Scan this QR code with your phone to upload a document or take a photo:</span>
              <QRCodeCanvas value={uploadUrl} size={160} />
              <span className="text-xs text-gray-400 mt-2">Point your phone camera at this code to open the upload page.</span>
            </div>
          )}
          {uploaded && Object.keys(uploaded).length > 0 && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-brand-green font-bold">✓ File uploaded</span>
            </div>
          )}
          <div className="flex justify-center items-center mt-4 mb-2 min-h-[64px]">
            <button
              className="w-1/2 py-3 rounded-full bg-gradient-to-r from-brand-green to-brand-teal text-white font-extrabold shadow-button hover:from-brand-teal hover:to-brand-green transition-all duration-200 text-lg border-2 border-brand-green"
              onClick={() => setStep(1)}
            >
              Continue
            </button>
          </div>
          <button
            className="w-full py-2 rounded-full bg-brand-blue text-white font-bold shadow-button hover:bg-brand-blue-dark transition-all duration-200 text-lg mt-4"
            onClick={() => router.push('/main/profile')}
          >
            Skip Upload & Go to Profile
          </button>
          <div className="mt-6 text-xs text-gray-400 text-center">
            Accepted formats: PDF, JPG, PNG. Max size: 5MB.<br />
            If you have trouble uploading, try a different browser or device.
          </div>
        </div>
      </div>
    );
  }

  if (step > questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-900">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="mb-8 text-lg">Your responses and documents have been received.</p>
        <pre className="bg-white p-4 rounded shadow text-left w-full max-w-md overflow-x-auto text-xs">{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-900">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-end mb-4">
          <Link href="/main/profile">
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-brand-blue text-brand-white font-semibold shadow-button hover:bg-brand-blue-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2"
              aria-label="Return to Profile"
            >
              Return to Profile
            </button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">2024 Tax Year Intake</h1>
        <div className="mb-8">
          <p className="text-lg font-medium mb-4">{current.question.replace(/'/g, "&apos;")}</p>
          {isOptionQuestion(current) && (
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
          {isInputQuestion(current) && current.type === "date" && (
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
          {isInputQuestion(current) && current.type === "number" && (
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
          {isInputQuestion(current) && (current.type === "text" || current.type === "email") && (
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
          {isInputQuestion(current) && current.type === "textarea" && (
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
          <span className="text-sm text-purple-400">Step {step} of {questions.length}</span>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="w-1/2 py-2 rounded-full bg-brand-blue text-white font-bold shadow-button hover:bg-brand-blue-dark transition-all duration-200 text-lg"
          onClick={() => router.push('/main/profile')}
        >
          Return to Profile
        </button>
      </div>
    </div>
  );
}
