"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";

// Define types for questions and answers
interface Answers {
	[key: number]: string | number | undefined;
}
interface QuestionBase {
	id: number;
  question: string;
  showIf?: (a: Answers) => boolean;
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

// Efficient, comprehensive 1040 intake questions
const questions: Question[] = [
	// ...existing code...
];

export default function Tax2025Questionnaire() {
	const { data: session, status } = useSession();
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<Answers>({});
	const [showChecklist, setShowChecklist] = useState(false);
	const [uploaded, setUploaded] = useState<{ [doc: string]: boolean }>({});
	const [showQR, setShowQR] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (step > questions.length - 1) {
			setStep(questions.length - 1 >= 0 ? questions.length - 1 : 0);
		} else if (step < 0) {
			setStep(0);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [questions.length]);

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

	if (loading) return <div className="p-8">Loading your data...</div>;

	const current = questions[step];

	if (!current) return null;

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

	function handlePrev() {
		setStep((s) => (s > 0 ? s - 1 : 0));
	}

	if (step >= questions.length || showChecklist) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-blue-900">
				<h1 className="text-3xl font-bold mb-4">Upload Required Documents</h1>
				<p className="mb-6 text-lg">Based on your answers, please upload the following documents:</p>
				<ul className="mb-8 w-full max-w-md">
					{["W-2", "1099", "SSA-1099"].map((doc) => (
						<li key={doc} className="flex flex-col gap-1 mb-6">
							<div className="flex items-center gap-3">
								<input type="file" id={doc} className="hidden" onChange={(e) => handleUpload(doc, e)} />
								<label htmlFor={doc} className={`flex-1 cursor-pointer px-4 py-2 rounded border ${uploaded[doc] ? "bg-green-100 border-green-400" : "bg-white border-blue-200"} transition-colors`}>
									{doc}
								</label>
								{uploaded[doc] && <span className="text-green-600 font-bold">✓</span>}
							</div>
						</li>
					))}
				</ul>
				<button className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200" onClick={() => setShowChecklist(false)}>
					Back to Questionnaire
				</button>
				{/* Add a back button to return to profile or main page */}
				<button className="mt-4 px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition" onClick={() => window.location.href = '/main/profile'}>
					Back to Profile
				</button>
			</div>
		);
	}

	if (step === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-blue-900">
				<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
					<h1 className="text-2xl font-bold mb-6">2025 Tax Year Questionnaire</h1>
					<p className="mb-4">
						To begin, upload your primary income document (W-2, 1099, SSA-1099) or last year&apos;s tax return.
						<br />
						You can also take a photo with your phone.
					</p>
					<div className="flex flex-col gap-4 mb-4">
						<label className="block">
							<span className="block text-sm font-medium mb-1">Upload Document</span>
							<input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleUpload} />
						</label>
						<button className="w-full px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition" onClick={() => setShowQR((v) => !v)} type="button">
							{showQR ? "Hide QR Code" : "Show QR Code for Phone Upload"}
						</button>
						{showQR && (
							<div className="flex flex-col items-center gap-2 mt-2">
								<span className="text-sm mb-2">Scan this QR code with your phone to upload a document or take a photo:</span>
								<QRCodeCanvas value="" size={160} />
								<span className="text-xs text-gray-400 mt-2">Point your phone camera at this code to open the upload page.</span>
							</div>
						)}
					</div>
					{uploaded && Object.keys(uploaded).length > 0 && (
						<div className="flex flex-col items-center gap-2 mb-4">
							<span className="text-green-600 font-bold">✓ File uploaded</span>
							<button className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200" onClick={() => setStep(1)}>
								Continue
							</button>
						</div>
					)}
					<div className="mt-6 text-xs text-gray-400 text-center">
						Accepted formats: PDF, JPG, PNG. Max size: 5MB.<br />
						If you have trouble uploading, try a different browser or device.
					</div>
					{/* Add a back button to return to profile or main page */}
					<button className="mt-4 px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition" onClick={() => window.location.href = '/main/profile'}>
						Back to Profile
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-blue-900">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6">2025 Tax Year Questionnaire</h1>
				<div className="mb-8">
					<p className="text-lg font-medium mb-4">{current.question.replace(/'/g, "&apos;")}</p>
					{/* ...identical question UI as 2022... */}
				</div>
				<div className="flex justify-between">
					<button className="text-blue-500 hover:underline" onClick={handlePrev} disabled={step === 0}>
						Back
					</button>
					<span className="text-sm text-blue-400">Step {step + 1} of {questions.length}</span>
				</div>
				<button className="mt-6 px-8 py-3 rounded-full bg-blue-100 text-blue-700 font-semibold text-lg shadow hover:bg-blue-200 transition-all duration-200" onClick={() => setShowChecklist(true)}>
					View Upload Checklist
				</button>
				{/* Add a back button to return to profile or main page */}
				<button className="mt-4 px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition" onClick={() => window.location.href = '/main/profile'}>
					Back to Profile
				</button>
			</div>
		</div>
	);
}
