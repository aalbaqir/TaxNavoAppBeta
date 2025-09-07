/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const fields = [
	{ label: "First Name and Initial", key: "firstName" },
	{ label: "Last Name", key: "lastName" },
	{ label: "Social Security Number", key: "ssn" },
	{ label: "Address", key: "address" },
	{ label: "Filing Status", key: "filingStatus" },
	{ label: "Total Income", key: "totalIncome" },
	{ label: "Taxable Income", key: "taxableIncome" },
	{ label: "Tax Owed", key: "taxOwed" },
	{ label: "Refund", key: "refund" },
];

const taxYears = [2025, 2024, 2023, 2022];

// TODO: Replace with real data fetching from user's profile/intake
const getPrefilledData = () => ({
	firstName: "John",
	lastName: "Doe",
	ssn: "123-45-6789",
	address: "123 Main St, City, ST 12345",
	filingStatus: "Single",
	totalIncome: "55000",
	taxableIncome: "50000",
	taxOwed: "2000",
	refund: "500",
});

export default function Fillable1040Page() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [selectedYear, setSelectedYear] = useState<number>(2024);
	const [form, setForm] = useState<any>({});
	const [completedYears, setCompletedYears] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
			// Find all years with completed questionnaires
			Promise.all(
				taxYears.map(year =>
					fetch(`/api/questionnaire?year=${year}`)
						.then(res => res.json())
						.then(data =>
							data.questionnaire &&
							data.questionnaire.answers &&
							Object.keys(data.questionnaire.answers).length > 0
								? year
								: null
						)
				)
			).then(results => {
				const years = results.filter(Boolean) as number[];
				setCompletedYears(years);
				// Default to most recent completed year
				if (years.length > 0) setSelectedYear(years[0]);
				setLoading(false);
			});
		}
	}, [status, session]);

	useEffect(() => {
		if (selectedYear && status === "authenticated" && session?.user?.email) {
			setLoading(true);
			fetch(`/api/questionnaire?year=${selectedYear}`)
				.then(res => res.json())
				.then(data => {
					setForm(data?.questionnaire?.answers || {});
					setLoading(false);
				});
		}
	}, [selectedYear, status, session]);

	type FormKey = keyof typeof form;

	const handleChange = (key: FormKey, value: string) => {
		setForm((f: any) => ({ ...f, [key]: value }));
	};

	if (loading) return <div className="p-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-green-gradient flex flex-col items-center justify-center text-brand-black dark:text-brand-white">
			<div className="card max-w-2xl mx-auto w-full">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
					<h1 className="text-2xl font-bold text-brand-green">
						IRS Form 1040 (Preview)
					</h1>
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold">Year:</span>
						<select
							className="input border px-2 py-1 rounded text-brand-black bg-white"
							value={selectedYear}
							onChange={e => setSelectedYear(Number(e.target.value))}
						>
							{completedYears.map(year => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
				</div>
				<form className="space-y-4 bg-brand-green-light rounded-xl p-6 shadow-card">
					{fields.map(field => (
						<div key={field.key} className="flex flex-col gap-1">
							<label className="label">{field.label}</label>
							<input
								className="input text-brand-inputText"
								value={form[field.key as FormKey] || ""}
								onChange={e =>
									handleChange(field.key as FormKey, e.target.value)
								}
								name={field.key}
								autoComplete="off"
							/>
						</div>
					))}
				</form>
				<div className="mt-8 text-xs text-brand-black/60 dark:text-brand-white/60">
					This is a preview. Your data is automatically filled from your intake
					for the selected year. Please review and update as needed before
					submission.
				</div>
			</div>
			<button
				className="btn btn-primary mt-4 w-full max-w-xs bg-brand-green hover:bg-brand-teal text-white font-bold"
				onClick={() => router.back()}
			>
				← Back
			</button>
		</div>
	);
}
