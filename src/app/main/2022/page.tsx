"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Efficient, comprehensive 1040 intake questions
const questions = [
	// Personal Info
	{
		id: 1,
		question: "Full legal name",
		type: "text",
		placeholder: "Full name",
	},
	{
		id: 2,
		question: "Social Security Number",
		type: "text",
		placeholder: "XXX-XX-XXXX",
	},
	{
		id: 3,
		question: "Date of birth",
		type: "date",
	},
	{
		id: 4,
		question: "Phone number",
		type: "text",
		placeholder: "(XXX) XXX-XXXX",
	},
	{
		id: 5,
		question: "Email address",
		type: "email",
		placeholder: "you@email.com",
	},
	{
		id: 6,
		question: "Current address",
		type: "text",
		placeholder: "Street, City, State, ZIP",
	},
	{
		id: 7,
		question: "Did you live at this address all year?",
		options: ["Yes", "No"],
	},
	{
		id: 8,
		question: "Are you a U.S. citizen?",
		options: ["Yes", "No"],
	},
	// Filing Status
	{
		id: 9,
		question: "Filing status",
		options: [
			"Single",
			"Married Filing Jointly",
			"Married Filing Separately",
			"Head of Household",
			"Qualifying Widow(er)",
		],
	},
	// Spouse Info
	{
		id: 10,
		question: "Do you have a spouse?",
		options: ["Yes", "No"],
	},
	{
		id: 11,
		question: "Spouse's full legal name",
		type: "text",
		placeholder: "Spouse's name",
		showIf: (a: Answers) => a[10] === "Yes",
	},
	{
		id: 12,
		question: "Spouse's SSN",
		type: "text",
		placeholder: "Spouse's SSN",
		showIf: (a: Answers) => a[10] === "Yes",
	},
	{
		id: 13,
		question: "Spouse's date of birth",
		type: "date",
		showIf: (a: Answers) => a[10] === "Yes",
	},
	// Dependents
	{
		id: 14,
		question: "Any dependents?",
		options: ["Yes", "No"],
	},
	{
		id: 15,
		question: "Number of dependents",
		type: "number",
		placeholder: "Number",
		showIf: (a: Answers) => a[14] === "Yes",
	},
	{
		id: 16,
		question:
			"List each dependent's name, SSN, DOB, relationship (one per line)",
		type: "textarea",
		placeholder: "Name, SSN, DOB, Relationship",
		showIf: (a: Answers) => a[14] === "Yes",
	},
	// Income
	{
		id: 17,
		question: "Did you or your spouse have W-2 income? (We will extract wage info from your uploaded W-2)",
		options: ["Yes", "No"],
	},
	{
		id: 19,
		question: "Any 1099 income (self-employment, contract, gig, etc.)? (We will extract 1099 income from your uploaded 1099)",
		options: ["Yes", "No"],
	},
	{
		id: 21,
		question: "Any unemployment income?",
		options: ["Yes", "No"],
	},
	{
		id: 22,
		question: "Total unemployment income (USD)",
		type: "number",
		placeholder: "Unemployment income",
		showIf: (a: Answers) => a[21] === "Yes",
	},
	{
		id: 23,
		question: "Any Social Security benefits?",
		options: ["Yes", "No"],
	},
	{
		id: 24,
		question: "Total Social Security benefits (USD)",
		type: "number",
		placeholder: "SS benefits",
		showIf: (a: Answers) => a[23] === "Yes",
	},
	{
		id: 25,
		question: "Any retirement/pension/IRA distributions?",
		options: ["Yes", "No"],
	},
	{
		id: 26,
		question: "Total retirement/pension/IRA distributions (USD)",
		type: "number",
		placeholder: "Retirement income",
		showIf: (a: Answers) => a[25] === "Yes",
	},
	{
		id: 27,
		question: "Any interest, dividends, or capital gains?",
		options: ["Yes", "No"],
	},
	{
		id: 28,
		question: "Total investment income (USD)",
		type: "number",
		placeholder: "Investment income",
		showIf: (a: Answers) => a[27] === "Yes",
	},
	{
		id: 29,
		question: "Any other income (alimony, gambling, etc.)?",
		options: ["Yes", "No"],
	},
	{
		id: 30,
		question: "Describe other income",
		type: "textarea",
		placeholder: "Type and amount",
		showIf: (a: Answers) => a[29] === "Yes",
	},
	// Deductions/Credits
	{
		id: 31,
		question: "Did you own a home in 2022?",
		options: ["Yes", "No"],
	},
	{
		id: 32,
		question: "Did you pay mortgage interest?",
		options: ["Yes", "No"],
		showIf: (a: Answers) => a[31] === "Yes",
	},
	{
		id: 33,
		question: "Total mortgage interest paid (USD)",
		type: "number",
		placeholder: "Mortgage interest",
		showIf: (a: Answers) => a[32] === "Yes",
	},
	{
		id: 34,
		question: "Did you pay property taxes?",
		options: ["Yes", "No"],
		showIf: (a: Answers) => a[31] === "Yes",
	},
	{
		id: 35,
		question: "Total property taxes paid (USD)",
		type: "number",
		placeholder: "Property taxes",
		showIf: (a: Answers) => a[34] === "Yes",
	},
	{
		id: 36,
		question: "Did you make charitable contributions?",
		options: ["Yes", "No"],
	},
	{
		id: 37,
		question: "Total charitable contributions (USD)",
		type: "number",
		placeholder: "Charitable contributions",
		showIf: (a: Answers) => a[36] === "Yes",
	},
	{
		id: 38,
		question: "Did you pay for child/dependent care?",
		options: ["Yes", "No"],
	},
	{
		id: 39,
		question: "Total child/dependent care expenses (USD)",
		type: "number",
		placeholder: "Care expenses",
		showIf: (a: Answers) => a[38] === "Yes",
	},
	{
		id: 40,
		question: "Did you pay student loan interest?",
		options: ["Yes", "No"],
	},
	{
		id: 41,
		question: "Total student loan interest paid (USD)",
		type: "number",
		placeholder: "Student loan interest",
		showIf: (a: Answers) => a[40] === "Yes",
	},
	{
		id: 42,
		question: "Did you pay tuition or education expenses?",
		options: ["Yes", "No"],
	},
	{
		id: 43,
		question: "Total tuition/education expenses (USD)",
		type: "number",
		placeholder: "Education expenses",
		showIf: (a: Answers) => a[42] === "Yes",
	},
	// Health
	{
		id: 44,
		question: "Did you have health insurance all year?",
		options: ["Yes", "No"],
	},
	{
		id: 45,
		question: "Did you have Marketplace/Obamacare coverage?",
		options: ["Yes", "No"],
		showIf: (a: Answers) => a[44] === "No",
	},
	{
		id: 46,
		question: "Did you receive a 1095-A form?",
		options: ["Yes", "No"],
		showIf: (a: Answers) => a[45] === "Yes",
	},
	// Life Events
	{
		id: 47,
		question: "Any major life changes in 2022 (marriage, divorce, new job, move, etc.)?",
		options: ["Yes", "No"],
	},
	{
		id: 48,
		question: "Describe major life changes",
		type: "textarea",
		placeholder: "Describe changes",
		showIf: (a: Answers) => a[47] === "Yes",
	},
	// Add more as needed for a full return
];

function getRequiredDocuments(answers: Answers) {
	// Always required
	const docs = [
		"Government-issued photo ID",
		"Social Security card(s)",
		"Last year's tax return (if available)",
		"Proof of address",
	];
	// Income
	if (answers[17] === "Yes") docs.push("W-2(s)");
	if (answers[19] === "Yes") docs.push("1099(s)");
	if (answers[21] === "Yes") docs.push("Unemployment 1099-G");
	if (answers[23] === "Yes") docs.push("SSA-1099 (Social Security)");
	if (answers[25] === "Yes") docs.push("1099-R (Retirement)");
	if (answers[27] === "Yes") docs.push("1099-INT/1099-DIV/1099-B (Investments)");
	// Deductions
	if (answers[32] === "Yes")
		docs.push("Mortgage interest statement (Form 1098)");
	if (answers[34] === "Yes") docs.push("Property tax statement");
	if (answers[36] === "Yes") docs.push("Charity donation receipts");
	if (answers[38] === "Yes") docs.push("Child/dependent care receipts");
	if (answers[40] === "Yes")
		docs.push("Student loan interest statement (Form 1098-E)");
	if (answers[42] === "Yes") docs.push("Tuition statement (Form 1098-T)");
	// Health
	if (answers[46] === "Yes") docs.push("1095-A (Marketplace health coverage)");
	return Array.from(new Set(docs));
}

// Simulate AI document parsing (replace with real API call in production)
async function parseDocumentAI(file: File, docType: string): Promise<Record<string, unknown>> {
	await new Promise((r) => setTimeout(r, 1200));
	const type = docType.toLowerCase();
	if (type.includes("w-2")) {
		return {
			docType: "W-2",
			name: "John Doe",
			wages: 50000,
			employer: "Acme Corp",
			withheld: 5000,
		};
	} else if (type.includes("1099")) {
		return {
			docType: "1099-NEC",
			name: "Jane Doe",
			payer: "Freelance LLC",
			amount: 12000,
		};
	} else if (type.includes("ssa")) {
		return {
			docType: "SSA-1099",
			name: "Jane Doe",
			benefits: 9000,
		};
	} else if (type.includes("photo id") || type.includes("government-issued")) {
		return {
			docType: "Photo ID",
			name: "Jane Doe",
			idNumber: "A1234567",
			issuer: "DMV",
		};
	} else if (type.includes("social security")) {
		return {
			docType: "Social Security Card",
			name: "Jane Doe",
			ssn: "123-45-6789",
		};
	} else if (type.includes("tax return")) {
		return {
			docType: "Prior Year Tax Return",
			year: 2021,
			refund: 1200,
		};
	} else if (type.includes("proof of address")) {
		return {
			docType: "Proof of Address",
			address: "123 Main St, Anytown, NY 12345",
		};
	} else if (type.includes("mortgage")) {
		return {
			docType: "Form 1098 (Mortgage Interest)",
			interestPaid: 8000,
		};
	} else if (type.includes("property tax")) {
		return {
			docType: "Property Tax Statement",
			amount: 3500,
		};
	} else if (type.includes("charity")) {
		return {
			docType: "Charity Donation Receipts",
			amount: 500,
		};
	} else if (type.includes("child/dependent care")) {
		return {
			docType: "Child/Dependent Care Receipts",
			amount: 2000,
		};
	} else if (type.includes("student loan")) {
		return {
			docType: "Form 1098-E (Student Loan Interest)",
			interestPaid: 1200,
		};
	} else if (type.includes("tuition")) {
		return {
			docType: "Form 1098-T (Tuition)",
			amount: 6000,
		};
	} else if (type.includes("1095-a") || type.includes("marketplace")) {
		return {
			docType: "Form 1095-A (Marketplace Health Coverage)",
			coverage: true,
		};
	}
	return { docType: "Unknown", message: "Could not extract data." };
}

// Add a type for answers to avoid implicit any
interface Answers {
	[key: number]: string | number | undefined;
}

// Map AI fields to question IDs for autofill
const fieldToQuestionId: { [key: string]: number } = {
  name: 1,
  ssn: 2,
  'spouse name': 11,
  'spouse ssn': 12,
  address: 6,
};

function autofillAnswers(aiData: Record<string, unknown>, prevAnswers: Answers): Answers {
  const updated: Answers = { ...prevAnswers };
  for (const [field, value] of Object.entries(aiData)) {
    const key = field.toLowerCase();
    if (fieldToQuestionId[key]) {
      updated[fieldToQuestionId[key]] = value as string;
    }
  }
  return updated;
}

export default function Tax2022Questionnaire() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<Answers>({});
	const [showChecklist, setShowChecklist] = useState(false);
	const [uploaded, setUploaded] = useState<{ [doc: string]: boolean }>({});
	const [showQR, setShowQR] = useState(false);
	const [parsedData, setParsedData] = useState<{ [doc: string]: Record<string, unknown> }>({});
	const [loading, setLoading] = useState(false);
	const uploadUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/main/2022/phone-upload`
			: "";

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

	// Update handleFileUpload to autofill answers
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
						const aiData = await parseDocumentAI(file, file.name);
						setParsedData((prev) => ({ ...prev, [file.name]: aiData }));
						setAnswers((prev: Answers) => autofillAnswers(aiData, prev));
					} else {
						const data = await res.json();
						alert("Upload failed: " + (data.error || "Unknown error"));
					}
				})
				.catch(() => {
					alert(
						"Upload failed. Please try again. Make sure your file is under 5MB and in PDF, JPG, or PNG format."
					);
				});
		}
	}

	// Update handleUpload for checklist step to autofill answers
	function handleUpload(doc: string, e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const formData = new FormData();
			formData.append("file", file);
			formData.append("docType", doc);
			fetch("/api/upload", {
				method: "POST",
				body: formData,
			})
				.then(async (res) => {
					if (res.ok) {
						setUploaded((prev) => ({ ...prev, [doc]: true }));
						const aiData = await parseDocumentAI(file, doc);
						setParsedData((prev) => ({ ...prev, [doc]: aiData }));
						setAnswers((prev: Answers) => autofillAnswers(aiData, prev));
					} else {
						const data = await res.json();
						alert("Upload failed: " + (data.error || "Unknown error"));
					}
				})
				.catch(() => {
					alert(
						"Upload failed. Please try again. Make sure your file is under 5MB and in PDF, JPG, or PNG format."
					);
				});
		}
	}

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

	if (step >= visibleQuestions.length || showChecklist) {
		const docs = Array.isArray(getRequiredDocuments(answers)) ? getRequiredDocuments(answers) : [];
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-900">
				<div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-blue-100 backdrop-blur-md">
					<h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight drop-shadow-sm">Upload Required Documents</h1>
					<p className="mb-6 text-lg text-center">
						Based on your answers, please upload the following documents:
					</p>
					<ul className="mb-8 w-full max-w-md">
						{docs.map((doc) => (
							<li key={doc} className="flex flex-col gap-1 mb-6">
								<div className="flex items-center gap-3">
									<input
										type="file"
										id={doc}
										className="hidden"
										onChange={(e) => handleUpload(doc, e)}
									/>
									<label
										htmlFor={doc}
										className={`flex-1 cursor-pointer px-4 py-2 rounded-lg border ${uploaded[doc] ? "bg-green-100 border-green-400" : "bg-white border-blue-200"} transition-colors`}
									>
										{doc}
									</label>
									{uploaded[doc] && (
										<span className="text-green-600 font-bold">✓</span>
									)}
								</div>
								{/* Show parsed data for this doc if available */}
								{uploaded[doc] && parsedData[doc] && (parsedData[doc] as { docType?: string }).docType && (
									<div className="w-full bg-blue-50 border border-blue-200 rounded p-3 text-left text-xs text-blue-900 mt-2">
										<div className="font-semibold mb-1">Extracted info:</div>
										<pre className="whitespace-pre-wrap break-words">{JSON.stringify(parsedData[doc], null, 2)}</pre>
									</div>
								)}
							</li>
						))}
					</ul>
					<button
						className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
						onClick={() => setShowChecklist(false)}
					>
						Back to Questionnaire
					</button>
				</div>
			</div>
		);
	}

	if (step === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-900">
				<div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-blue-100 backdrop-blur-md">
					<h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight drop-shadow-sm">2022 Tax Year Questionnaire</h1>
					<p className="mb-6 text-lg text-center leading-relaxed">
	To begin, upload your primary income document (W-2, 1099, SSA-1099) or
	last year&apos;s tax return.
	<br />
	You can also take a photo with your phone.
</p>
					<div className="flex flex-col gap-4 mb-4">
						<label className="block">
							<span className="block text-sm font-medium mb-1">
								Upload Document
							</span>
							<input
								type="file"
								accept=".pdf,.jpg,.jpeg,.png"
								className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
								onChange={handleFileUpload}
							/>
						</label>
						<button
							className="w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
							onClick={() => setShowQR((v) => !v)}
							type="button"
						>
							{showQR
								? "Hide QR Code"
								: "Show QR Code for Phone Upload"}
						</button>
						{showQR && (
							<div className="flex flex-col items-center gap-2 mt-2">
								<span className="text-sm mb-2">
									Scan this QR code with your phone to upload a document or take a
									photo:
								</span>
								<QRCodeCanvas value={uploadUrl} size={160} />
								<span className="text-xs text-gray-400 mt-2">
									Point your phone camera at this code to open the upload page.
								</span>
							</div>
						)}
					</div>
					{uploaded && Object.keys(uploaded).length > 0 && (
						<div className="flex flex-col items-center gap-2 mb-4">
							<span className="text-green-600 font-bold">✓ File uploaded</span>
							{Object.keys(parsedData).length > 0 && (
								<div className="w-full bg-blue-50 border border-blue-200 rounded p-4 text-left text-xs text-blue-900 mb-2">
									<div className="font-semibold mb-1">Information extracted from your document:</div>
									<pre className="whitespace-pre-wrap break-words">{JSON.stringify(parsedData[Object.keys(parsedData)[0]], null, 2)}</pre>
								</div>
							)}
							<button
								className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
								onClick={() => setStep(1)}
							>
								Continue
							</button>
						</div>
					)}
					<div className="mt-6 text-xs text-gray-400 text-center">
						Accepted formats: PDF, JPG, PNG. Max size: 5MB.
						<br />
						If you have trouble uploading, try a different browser or device.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-900">
			<div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-blue-100 backdrop-blur-md">
				<h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight drop-shadow-sm">2022 Tax Year Questionnaire</h1>
				<div className="mb-10">
					<p className="text-lg font-medium mb-6 text-center leading-relaxed">{current.question.replace(/'/g, "&apos;")}</p>
					{current.options && (
						<div className="flex flex-col gap-4">
							{current.options.map((option) => (
								<button
									key={option}
									className="px-8 py-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-200 hover:to-blue-300 text-blue-900 font-semibold shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
									onClick={() => handleOption(option)}
								>
									{option}
								</button>
							))}
						</div>
					)}
					{current.type === "date" && (
						<div className="flex flex-col gap-4">
							<input
								type="date"
								className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={answers[current.id] || ""}
								onChange={handleInput}
							/>
							<button
								className="mt-2 px-8 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
								onClick={handleNext}
								disabled={!answers[current.id]}
							>
								Next
							</button>
						</div>
					)}
					{current.type === "number" && (
						<div className="flex flex-col gap-4">
							<input
								type="number"
								className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder={current.placeholder}
								value={answers[current.id] || ""}
								onChange={handleInput}
							/>
							<button
								className="mt-2 px-8 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
								onClick={handleNext}
								disabled={!answers[current.id]}
							>
								Next
							</button>
						</div>
					)}
					{current.type === "text" && (
						<div className="flex flex-col gap-4">
							<input
								type="text"
								className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder={current.placeholder}
								value={answers[current.id] || ""}
								onChange={handleInput}
							/>
							<button
								className="mt-2 px-8 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
								onClick={handleNext}
								disabled={!answers[current.id]}
							>
								Next
							</button>
						</div>
					)}
					{current.type === "email" && (
						<div className="flex flex-col gap-4">
							<input
								type="email"
								className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder={current.placeholder}
								value={answers[current.id] || ""}
								onChange={handleInput}
							/>
							<button
								className="mt-2 px-8 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
								onClick={handleNext}
								disabled={!answers[current.id]}
							>
								Next
							</button>
						</div>
					)}
					{current.type === "textarea" && (
						<div className="flex flex-col gap-4">
							<textarea
								className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder={current.placeholder}
								value={answers[current.id] || ""}
								onChange={handleInput}
								rows={4}
							/>
							<button
								className="mt-2 px-8 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
								onClick={handleNext}
								disabled={!answers[current.id]}
							>
								Next
							</button>
						</div>
					)}
				</div>
				<div className="flex justify-between mt-8">
					<button
						className="text-blue-500 hover:underline font-medium"
						onClick={handlePrev}
						disabled={step === 0}
					>
						Back
					</button>
					<span className="text-sm text-blue-400 font-mono">
						Step {step + 1} of {visibleQuestions.length}
					</span>
				</div>
				<button
					className="mt-8 w-full px-8 py-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-300 text-blue-700 font-bold text-lg shadow-lg hover:from-blue-200 hover:to-blue-400 transition-all duration-200"
					onClick={() => setShowChecklist(true)}
				>
					View Upload Checklist
				</button>
				{/* After question UI, show extracted income info for verification if available */}
				{(parsedData &&
					Object.values(parsedData).some((d) => (d as { wages?: number; amount?: number }).wages || (d as { wages?: number; amount?: number }).amount)) && (
					<div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-inner">
						<div className="font-semibold mb-2 text-blue-800">Income Information Extracted from Your Documents:</div>
						{Object.entries(parsedData).map(([doc, data]) => {
							const d = data as { docType?: string; wages?: number; amount?: number; withheld?: number; employer?: string; payer?: string };
							if (d.wages || d.amount) {
								return (
									<div key={doc} className="mb-2">
										<div className="font-medium">{d.docType} <span className="text-xs text-blue-400">({doc})</span>:</div>
										{d.wages && <div>Wages: <span className="font-mono">${d.wages}</span></div>}
										{d.amount && <div>Amount: <span className="font-mono">${d.amount}</span></div>}
										{d.withheld && <div>Withheld: <span className="font-mono">${d.withheld}</span></div>}
										{d.employer && <div>Employer: <span className="font-mono">{d.employer}</span></div>}
										{d.payer && <div>Payer: <span className="font-mono">{d.payer}</span></div>}
										<div className="mt-1 text-xs text-blue-700">Please verify this information is correct. If not, upload a clearer document or contact support.</div>
									</div>
								);
							}
							return null;
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export function Page2022() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-blue-100 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight drop-shadow-sm">2022 Tax Year Questionnaire</h1>
        <p className="mb-6 text-lg text-center leading-relaxed">
          Welcome to the 2022 Tax Year Questionnaire. Please have your documents ready.
        </p>
        <button
          className="mt-4 w-full max-w-xs px-6 py-2 rounded bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 transition"
          onClick={() => router.back()}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
