/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

// Add a type for answers to avoid implicit any
interface Answers {
	[key: number]: string | number | undefined;
}

// Chat message type
interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export default function ModernQuestionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | undefined>>({});
  const current = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }));
  }

  function handleNext() {
    setStep((s) => s + 1);
  }

  function handlePrev() {
    setStep((s) => (s > 0 ? s - 1 : 0));
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Sub-tabs */}
      {/* <div className="flex justify-center gap-4 mb-8">
        <button className="px-5 py-2 rounded-full font-semibold text-base bg-[#8000FF] text-white shadow">
          Questionnaire
        </button>
        <button className="px-5 py-2 rounded-full font-semibold text-base bg-white text-[#8000FF] border border-[#8000FF]/20 hover:bg-[#F3E8FF] hover:border-[#8000FF]">
          Documents
        </button>
      </div> */}
      {/* Animated Card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl mx-auto"
      >
        {/* Progress Bar */}
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
              Step {step + 1} of {questions.length}
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
        <div className="flex flex-col gap-4">
          <input
            className="px-4 py-3 rounded-xl border border-[#8000FF]/20 focus:ring-2 focus:ring-[#FFC107] text-lg"
            placeholder={current.placeholder}
            type="text"
            value={answers[current.id] || ""}
            onChange={handleInput}
          />
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
    </div>
  );
}
