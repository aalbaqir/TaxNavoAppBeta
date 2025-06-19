// MultiStepForm.tsx
import React, { useState } from "react";
import StepForm from "@/components/StepForm";
import Input from "@/components/Input";
import Select from "@/components/Select";
import CheckboxGroup from "@/components/CheckboxGroup";
import FileUpload from "@/components/FileUpload";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// TODO: Import zod or yup for validation if desired

// Types for form data
interface Dependent {
  name: string;
  ssn: string;
  dob: string;
  relationship: string;
  livedWithYouMonths: string;
  earnedIncome: string;
  isStudent: boolean;
  isDisabled: boolean;
}

interface Income {
  type: string;
  employerName?: string;
  businessName?: string;
  ein?: string;
  income?: string;
  expenses?: string;
  propertyAddress?: string;
  file?: File | null;
}

interface Deductions {
  [key: string]: string;
}

interface Credits {
  childcareExpenses?: string;
  attendedCollege?: string;
  evOrEnergy?: string;
  acaMarketplace?: string;
  acaForm?: File | null;
}

interface FilingInfo {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  efileConsent: string;
  commConsent: string;
}

export default function MultiStepForm() {
  const router = useRouter();
  const { status } = useSession();

  // Step state
  const [step, setStep] = useState(0);

  // Form data state
  const [personal, setPersonal] = useState({
    fullName: "",
    ssn: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    maritalStatus: "",
    spouseName: "",
    spouseSSN: "",
    spouseDOB: "",
    citizenshipStatus: "",
  });
  const [hasDependents, setHasDependents] = useState("");
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [incomeTypes, setIncomeTypes] = useState<string[]>([]);
  const [incomeDetails, setIncomeDetails] = useState<Record<string, Income>>({});
  const [wantsDeductions, setWantsDeductions] = useState("");
  const [deductions, setDeductions] = useState<Deductions>({});
  const [credits, setCredits] = useState<Credits>({});
  const [filing, setFiling] = useState<FilingInfo>({
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    efileConsent: "",
    commConsent: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Navigation
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => (s > 0 ? s - 1 : 0));

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Step 1: Personal Info
  if (step === 0) {
    return (
      <StepForm title="Personal Information" onNext={next} showBack={false}>
        {/* Bypass button */}
        <button
          className="mb-6 px-4 py-2 rounded-full bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 transition w-full"
          type="button"
          onClick={() => setStep(6)}
        >
          Skip Questionnaire &rarr;
        </button>
        <Input label="Full Name" value={personal.fullName} onChange={e => setPersonal({ ...personal, fullName: e.target.value })} required />
        <Input label="SSN" value={personal.ssn} onChange={e => setPersonal({ ...personal, ssn: e.target.value })} required />
        <Input label="Date of Birth" type="date" value={personal.dob} onChange={e => setPersonal({ ...personal, dob: e.target.value })} required />
        <Input label="Phone" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} required />
        <Input label="Email" type="email" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} required />
        <Input label="Address" value={personal.address} onChange={e => setPersonal({ ...personal, address: e.target.value })} required />
        <Select label="Marital Status" value={personal.maritalStatus} onChange={e => setPersonal({ ...personal, maritalStatus: e.target.value })} options={[
          { value: "", label: "Select..." },
          { value: "Single", label: "Single" },
          { value: "Married", label: "Married" },
          { value: "Divorced", label: "Divorced" },
          { value: "Widowed", label: "Widowed" },
        ]} required />
        {personal.maritalStatus === "Married" && (
          <>
            <Input label="Spouse Name" value={personal.spouseName} onChange={e => setPersonal({ ...personal, spouseName: e.target.value })} required />
            <Input label="Spouse SSN" value={personal.spouseSSN} onChange={e => setPersonal({ ...personal, spouseSSN: e.target.value })} required />
            <Input label="Spouse DOB" type="date" value={personal.spouseDOB} onChange={e => setPersonal({ ...personal, spouseDOB: e.target.value })} required />
          </>
        )}
        <Select label="Are you a U.S. citizen?" value={personal.citizenshipStatus} onChange={e => setPersonal({ ...personal, citizenshipStatus: e.target.value })} options={[
          { value: "", label: "Select..." },
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]} required />
      </StepForm>
    );
  }

  // Step 2: Dependents
  if (step === 1) {
    // Only one answer per question, and Yes/No leads to different UI
    if (hasDependents === '') {
      return (
        <StepForm title="Dependents" onNext={next} onBack={back}>
          <div className="mb-4">
            <span className="block font-medium mb-2">Do you have any dependents?</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full border bg-white text-blue-600 border-blue-600 font-semibold transition`}
                onClick={() => setHasDependents('Yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full border bg-white text-blue-600 border-blue-600 font-semibold transition`}
                onClick={() => { setHasDependents('No'); setDependents([]); }}
              >
                No
              </button>
            </div>
          </div>
        </StepForm>
      );
    }
    if (hasDependents === 'Yes') {
      return (
        <StepForm title="Dependents" onNext={next} onBack={back}>
          {dependents.length === 0 && (
            <button type="button" className="mb-4 px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition" onClick={() => setDependents([{ name: '', ssn: '', dob: '', relationship: '', livedWithYouMonths: '', earnedIncome: '', isStudent: false, isDisabled: false }])}>
              Add Dependent
            </button>
          )}
          {dependents.map((dep, idx) => (
            <div key={idx} className="bg-blue-50 rounded-xl p-4 mb-4">
              <Input label="Name" value={dep.name} onChange={e => {
                const d = [...dependents];
                d[idx].name = e.target.value;
                setDependents(d);
              }} />
              <Input label="SSN" value={dep.ssn} onChange={e => {
                const d = [...dependents];
                d[idx].ssn = e.target.value;
                setDependents(d);
              }} />
              <Input label="Date of Birth" type="date" value={dep.dob} onChange={e => {
                const d = [...dependents];
                d[idx].dob = e.target.value;
                setDependents(d);
              }} />
              <Input label="Relationship" value={dep.relationship} onChange={e => {
                const d = [...dependents];
                d[idx].relationship = e.target.value;
                setDependents(d);
              }} />
              <Input label="Months Lived With You" type="number" value={dep.livedWithYouMonths} onChange={e => {
                const d = [...dependents];
                d[idx].livedWithYouMonths = e.target.value;
                setDependents(d);
              }} />
              <Select label="Did this dependent earn income?" value={dep.earnedIncome} onChange={e => {
                const d = [...dependents];
                d[idx].earnedIncome = e.target.value;
                setDependents(d);
              }} options={[
                { value: '', label: 'Select...' },
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]} />
              <Select label="Is this dependent a student?" value={dep.isStudent ? 'Yes' : 'No'} onChange={e => {
                const d = [...dependents];
                d[idx].isStudent = e.target.value === 'Yes';
                setDependents(d);
              }} options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]} />
              <Select label="Is this dependent disabled?" value={dep.isDisabled ? 'Yes' : 'No'} onChange={e => {
                const d = [...dependents];
                d[idx].isDisabled = e.target.value === 'Yes';
                setDependents(d);
              }} options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]} />
              <button type="button" className="mt-2 text-red-500 hover:underline text-xs" onClick={() => setDependents(dependents.filter((_, i) => i !== idx))}>Remove</button>
            </div>
          ))}
        </StepForm>
      );
    }
    if (hasDependents === 'No') {
      return (
        <StepForm title="Dependents" onNext={next} onBack={back}>
          <div className="mb-4 text-blue-700 font-semibold">You indicated you do not have any dependents.</div>
        </StepForm>
      );
    }
  }

  // Step 3: Income Sources
  if (step === 2) {
    const incomeOptions = [
      { value: "W-2", label: "W-2" },
      { value: "1099", label: "1099" },
      { value: "Self-employed", label: "Self-employed" },
      { value: "Rental", label: "Rental" },
      { value: "Stocks/Crypto", label: "Stocks/Crypto" },
      { value: "Social Security", label: "Social Security" },
      { value: "Pension", label: "Pension" },
      { value: "Unemployment", label: "Unemployment" },
      { value: "Other", label: "Other" },
    ];
    // If user unselects an income type, clear its details
    const handleIncomeTypesChange = (vals: string[]) => {
      setIncomeTypes(vals);
      // Remove details for unselected types
      setIncomeDetails(prev => {
        const updated: Record<string, Income> = {};
        vals.forEach(type => {
          if (prev[type]) updated[type] = prev[type];
        });
        return updated;
      });
    };
    return (
      <StepForm title="Income Sources" onNext={next} onBack={back}>
        <CheckboxGroup
          label="Which types of income did you have?"
          options={incomeOptions}
          values={incomeTypes}
          onChange={handleIncomeTypesChange}
        />
        {/* Conditional fields for each selected income type */}
        {incomeTypes.includes("W-2") && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <Input label="Employer Name" value={incomeDetails["W-2"]?.employerName || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["W-2"]: { ...incomeDetails["W-2"], employerName: e.target.value } })} />
            <FileUpload label="Upload W-2" onChange={file => setIncomeDetails({ ...incomeDetails, ["W-2"]: { ...incomeDetails["W-2"], file } })} />
          </div>
        )}
        {incomeTypes.some(t => t === "1099" || t === "Self-employed") && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <Input label="Business Name" value={incomeDetails["1099"]?.businessName || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["1099"]: { ...incomeDetails["1099"], businessName: e.target.value } })} />
            <Input label="EIN" value={incomeDetails["1099"]?.ein || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["1099"]: { ...incomeDetails["1099"], ein: e.target.value } })} />
            <Input label="Income" type="number" value={incomeDetails["1099"]?.income || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["1099"]: { ...incomeDetails["1099"], income: e.target.value } })} />
            <Input label="Expenses" type="number" value={incomeDetails["1099"]?.expenses || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["1099"]: { ...incomeDetails["1099"], expenses: e.target.value } })} />
          </div>
        )}
        {incomeTypes.includes("Stocks/Crypto") && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <FileUpload label="Upload 1099-B or CSV" onChange={file => setIncomeDetails({ ...incomeDetails, ["Stocks/Crypto"]: { ...incomeDetails["Stocks/Crypto"], file } })} />
          </div>
        )}
        {incomeTypes.includes("Rental") && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <Input label="Property Address" value={incomeDetails["Rental"]?.propertyAddress || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["Rental"]: { ...incomeDetails["Rental"], propertyAddress: e.target.value } })} />
            <Input label="Rental Income" type="number" value={incomeDetails["Rental"]?.income || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["Rental"]: { ...incomeDetails["Rental"], income: e.target.value } })} />
            <Input label="Rental Expenses" type="number" value={incomeDetails["Rental"]?.expenses || ""} onChange={e => setIncomeDetails({ ...incomeDetails, ["Rental"]: { ...incomeDetails["Rental"], expenses: e.target.value } })} />
          </div>
        )}
        {incomeTypes.some(t => t === "Social Security" || t === "Pension" || t === "Unemployment") && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <FileUpload label="Upload relevant form(s)" onChange={file => setIncomeDetails({ ...incomeDetails, ["Retirement"]: { ...incomeDetails["Retirement"], file } })} />
          </div>
        )}
      </StepForm>
    );
  }

  // Step 4: Deductions
  if (step === 3) {
    // Only one answer per question, no conditional follow-ups in the same question
    const deductionOptions = [
      { value: "Student Loan Interest", label: "Student Loan Interest" },
      { value: "Educator Expenses", label: "Educator Expenses" },
      { value: "HSA Contributions", label: "HSA Contributions" },
      { value: "Retirement Contributions", label: "Retirement Contributions" },
      { value: "Alimony Paid", label: "Alimony Paid" },
      { value: "Charity Donations", label: "Charity Donations" },
      { value: "Mortgage Interest", label: "Mortgage Interest" },
      { value: "Property Taxes", label: "Property Taxes" },
      { value: "Medical Expenses", label: "Medical Expenses" },
    ];
    const handleDeductionsChange = (vals: string[]) => {
      setDeductions(prev => {
        const updated: Deductions = {};
        vals.forEach(key => {
          updated[key] = prev[key] || '';
        });
        return updated;
      });
    };
    if (wantsDeductions === '') {
      return (
        <StepForm title="Deductions" onNext={next} onBack={back}>
          <div className="mb-4">
            <span className="block font-medium mb-2">Would you like to explore deductions?</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full border bg-white text-blue-600 border-blue-600 font-semibold transition`}
                onClick={() => setWantsDeductions('Yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full border bg-white text-blue-600 border-blue-600 font-semibold transition`}
                onClick={() => { setWantsDeductions('No'); setDeductions({}); }}
              >
                No
              </button>
            </div>
          </div>
        </StepForm>
      );
    }
    if (wantsDeductions === 'Yes') {
      return (
        <StepForm title="Deductions" onNext={next} onBack={back}>
          <CheckboxGroup
            label="Select deductions you want to claim:"
            options={deductionOptions}
            values={Object.keys(deductions)}
            onChange={handleDeductionsChange}
          />
          {Object.keys(deductions).map((ded) => (
            <Input
              key={ded}
              label={`Amount for ${ded}`}
              type="number"
              value={deductions[ded] || ''}
              onChange={e => setDeductions({ ...deductions, [ded]: e.target.value })}
            />
          ))}
        </StepForm>
      );
    }
    if (wantsDeductions === 'No') {
      return (
        <StepForm title="Deductions" onNext={next} onBack={back}>
          <div className="mb-4 text-blue-700 font-semibold">You indicated you do not want to explore deductions.</div>
        </StepForm>
      );
    }
  }

  // Step 5: Credits
  if (step === 4) {
    // Only one answer per question, no conditional follow-ups in the same question
    if (credits.childcareExpenses === undefined) {
      return (
        <StepForm title="Credits" onNext={next} onBack={back}>
          <div className="mb-4">
            <span className="block font-medium mb-2">Do you have children or dependents?</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full border bg-white text-blue-600 border-blue-600 font-semibold transition`}
                onClick={() => setCredits({ ...credits, childcareExpenses: '' })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full border bg-white text-blue-600 border-blue-600 font-semibold transition`}
                onClick={() => setCredits({ ...credits, childcareExpenses: undefined })}
              >
                No
              </button>
            </div>
          </div>
        </StepForm>
      );
    }
    if (credits.childcareExpenses !== undefined) {
      return (
        <StepForm title="Credits" onNext={next} onBack={back}>
          <Input
            label="Childcare Expenses (USD)"
            type="number"
            value={credits.childcareExpenses || ''}
            onChange={e => setCredits({ ...credits, childcareExpenses: e.target.value })}
          />
          <Select
            label="Did you attend college?"
            value={credits.attendedCollege || ''}
            onChange={e => setCredits({ ...credits, attendedCollege: e.target.value })}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
            ]}
          />
          <Select
            label="Did you buy an electric vehicle or make energy upgrades?"
            value={credits.evOrEnergy || ''}
            onChange={e => setCredits({ ...credits, evOrEnergy: e.target.value })}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
            ]}
          />
          <Select
            label="Did you receive ACA health insurance via Marketplace?"
            value={credits.acaMarketplace || ''}
            onChange={e => setCredits({ ...credits, acaMarketplace: e.target.value })}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
            ]}
          />
          {credits.acaMarketplace === 'Yes' && (
            <FileUpload label="Upload Form 1095-A" onChange={file => setCredits({ ...credits, acaForm: file })} />
          )}
        </StepForm>
      );
    }
  }

  // Step 6: Filing Info
  if (step === 5) {
    return (
      <StepForm title="Filing Information" onNext={next} onBack={back}>
        <Input label="Bank Name" value={filing.bankName} onChange={e => setFiling({ ...filing, bankName: e.target.value })} required />
        <Input label="Routing Number" value={filing.routingNumber} onChange={e => setFiling({ ...filing, routingNumber: e.target.value })} required />
        <Input label="Account Number" value={filing.accountNumber} onChange={e => setFiling({ ...filing, accountNumber: e.target.value })} required />
        <Select
          label="Do you authorize us to e-file your return?"
          value={filing.efileConsent}
          onChange={e => setFiling({ ...filing, efileConsent: e.target.value })}
          options={[
            { value: '', label: 'Select...' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          required
        />
        <Select
          label="Do you agree to electronic communication (email/SMS)?"
          value={filing.commConsent}
          onChange={e => setFiling({ ...filing, commConsent: e.target.value })}
          options={[
            { value: '', label: 'Select...' },
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          required
        />
      </StepForm>
    );
  }

  // Step 7: Review & Submit (with QR and upload at the end)
  if (step === 6) {
    return (
      <StepForm title="Review & Submit" onBack={back} showNext={false}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
          <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto mb-2 whitespace-pre-wrap break-words max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">{JSON.stringify(personal, null, 2)}</pre>
          <button className="text-blue-600 hover:underline text-xs mb-2" onClick={() => setStep(0)}>Edit</button>
          <h3 className="text-lg font-semibold mb-2">Dependents</h3>
          <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto mb-2 whitespace-pre-wrap break-words max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">{JSON.stringify(dependents, null, 2)}</pre>
          <button className="text-blue-600 hover:underline text-xs mb-2" onClick={() => setStep(1)}>Edit</button>
          <h3 className="text-lg font-semibold mb-2">Income</h3>
          <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto mb-2 whitespace-pre-wrap break-words max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">{JSON.stringify({ incomeTypes, incomeDetails }, null, 2)}</pre>
          <button className="text-blue-600 hover:underline text-xs mb-2" onClick={() => setStep(2)}>Edit</button>
          <h3 className="text-lg font-semibold mb-2">Deductions</h3>
          <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto mb-2 whitespace-pre-wrap break-words max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">{JSON.stringify(deductions, null, 2)}</pre>
          <button className="text-blue-600 hover:underline text-xs mb-2" onClick={() => setStep(3)}>Edit</button>
          <h3 className="text-lg font-semibold mb-2">Credits</h3>
          <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto mb-2 whitespace-pre-wrap break-words max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">{JSON.stringify(credits, null, 2)}</pre>
          <button className="text-blue-600 hover:underline text-xs mb-2" onClick={() => setStep(4)}>Edit</button>
          <h3 className="text-lg font-semibold mb-2">Filing Info</h3>
          <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto mb-2 whitespace-pre-wrap break-words max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">{JSON.stringify(filing, null, 2)}</pre>
          <button className="text-blue-600 hover:underline text-xs mb-2" onClick={() => setStep(5)}>Edit</button>
        </div>
        {/* QR code and upload at the end */}
        <div className="my-8 flex flex-col items-center gap-4 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-2 sm:px-4 md:px-8 relative">
          <span className="font-semibold text-blue-700 text-center text-base sm:text-lg">Upload your supporting documents</span>
          {/* QR code for phone upload */}
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-sm mb-2 text-center">Scan this QR code with your phone to upload documents or take a photo:</span>
            <div className="flex justify-center w-full">
              <Image src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://taxnavo.com/upload" alt="QR Code for upload" width={160} height={160} className="w-32 h-32 sm:w-40 sm:h-40" />
            </div>
            <span className="text-xs text-gray-400 mt-2 text-center">Point your phone camera at this code to open the upload page.</span>
          </div>
          {/* Fallback file upload */}
          <div className="w-full">
            <FileUpload label="Or upload from this device" onChange={() => {}} />
          </div>
          {/* Mobile icon bottom right */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10">
            <Image src="/file.svg" alt="Mobile Upload Icon" width={36} height={36} className="block sm:hidden drop-shadow-lg" />
          </div>
        </div>
        <button
          className="w-full px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-base sm:text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
          onClick={() => { setSubmitted(true); }}
        >
          Submit
        </button>
        {submitted && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold shadow text-sm sm:text-base">
            ✅ Your information has been submitted! Thank you.<br />
            <a href="/main/documents" className="text-blue-700 underline block mt-2">View or manage your uploaded documents</a>
            <a href="/main/1040" className="text-blue-700 underline block mt-1">Preview your fillable 1040</a>
          </div>
        )}
      </StepForm>
    );
  }

  return null;
}
