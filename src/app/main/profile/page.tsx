"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [desktopMode, setDesktopMode] = useState(false);
  const [completedYears, setCompletedYears] = useState<number[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/main/signin");
      return;
    }
    if (status === "authenticated" && session?.user?.email) {
      // Try to fetch the most recent questionnaire for this user
      const years = [2025, 2024, 2023, 2022];
      Promise.all(
        years.map((year) =>
          fetch(`/api/questionnaire?year=${year}`)
            .then((res) => res.json())
            .then(
              (data) =>
                data.questionnaire &&
                data.questionnaire.answers &&
                Object.keys(data.questionnaire.answers).length > 0
                  ? year
                  : null
            )
        )
      ).then((results) => {
        setCompletedYears(results.filter(Boolean) as number[]);
      });
      // Try to fetch the most recent questionnaire for this user
      fetch("/api/questionnaire?year=2025")
        .then((res) => res.json())
        .then((data) => {
          if (data.questionnaire && data.questionnaire.answers) {
            setProfile(data.questionnaire.answers);
            setLoading(false);
          } else {
            // If no 2025 profile, try 2024, then 2023, then 2022
            return fetch("/api/questionnaire?year=2024").then((res) => res.json());
          }
        })
        .then((data) => {
          if (data && data.questionnaire && data.questionnaire.answers) {
            setProfile(data.questionnaire.answers);
            setLoading(false);
          } else {
            return fetch("/api/questionnaire?year=2023").then((res) => res.json());
          }
        })
        .then((data) => {
          if (data && data.questionnaire && data.questionnaire.answers) {
            setProfile(data.questionnaire.answers);
            setLoading(false);
          } else {
            return fetch("/api/questionnaire?year=2022").then((res) => res.json());
          }
        })
        .then((data) => {
          if (data && data.questionnaire && data.questionnaire.answers) {
            setProfile(data.questionnaire.answers);
            setLoading(false);
          } else {
            setProfile({});
            setLoading(false);
          }
        })
        .catch(() => {
          setProfile({});
          setLoading(false);
        });
    }
  }, [status, session, router]);

  // Add firstName and lastName to formData if not present
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        ...profile,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: 2024, answers: formData }),
      });
      setProfile(formData);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  // Helper: pretty label
  const prettyLabel = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\b(ssn|dob)\b/gi, (m) => m.toUpperCase())
      .replace(/\b([a-z])/g, (m) => m.toUpperCase());

  // Helper: field type
  const getFieldType = (key: string, value: any) => {
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("dob")) return "date";
    if (key.toLowerCase().includes("email")) return "email";
    if (key.toLowerCase().includes("ssn")) return "text";
    if (typeof value === "number") return "number";
    if (typeof value === "string" && value.length > 60) return "textarea";
    return "text";
  };

  if (status === "loading" || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) return null;

  // Basic profile UI structure
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        desktopMode ? "bg-gradient-to-br from-blue-50 to-blue-100" : "bg-blue-50"
      }`}
    >
      <div
        className={`relative w-full ${desktopMode ? "max-w-full" : "max-w-lg"} p-0 flex flex-col items-center`}
      >
        {/* Desktop/Mobile Toggle */}
        <button
          className="absolute top-6 right-8 p-3 rounded-full bg-blue-200 text-blue-800 font-semibold shadow hover:bg-blue-300 transition z-20 flex items-center justify-center"
          style={{ marginTop: 0, marginRight: 0 }}
          onClick={() => setDesktopMode((v) => !v)}
          aria-label={desktopMode ? "Switch to Mobile View" : "Switch to Desktop View"}
        >
          {desktopMode ? (
            // Desktop icon (monitor)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="12"
                rx="2"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
              />
              <path d="M8 20h8" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
            </svg>
          ) : (
            // Mobile icon (phone)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="7"
                y="2"
                width="10"
                height="20"
                rx="2"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
              />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
            </svg>
          )}
        </button>
        <div
          className={`bg-white ${
            desktopMode
              ? "p-12 rounded-none shadow-none border-0 w-full flex flex-row gap-12"
              : "p-8 rounded-xl shadow-lg w-full"
          } transition-all duration-300`}
        >
          <div className={`${desktopMode ? "w-1/2 pr-8 border-r border-blue-100" : ""}`}>
            <h1 className="text-3xl font-extrabold mb-4 text-blue-900 flex items-center gap-2">
              <span>👤</span> Profile
            </h1>
            <div className="mb-6 text-blue-900">
              <div className="font-semibold mb-2 text-lg">Personal Information</div>
              {editMode ? (
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1 capitalize text-blue-700">First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData?.firstName || ""}
                      onChange={handleChange}
                      className="p-2 border rounded focus:outline-blue-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1 capitalize text-blue-700">Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData?.lastName || ""}
                      onChange={handleChange}
                      className="p-2 border rounded focus:outline-blue-400"
                    />
                  </div>
                  {formData &&
                    Object.entries(formData)
                      .filter(([key]) => key !== "firstName" && key !== "lastName")
                      .map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <label className="text-sm font-medium mb-1 capitalize text-blue-700">
                            {prettyLabel(key)}
                          </label>
                          {getFieldType(key, value) === "textarea" ? (
                            <textarea
                              name={key}
                              value={typeof value === "string" || typeof value === "number" ? value : ""}
                              onChange={handleChange}
                              className="p-2 border rounded focus:outline-blue-400"
                              rows={3}
                            />
                          ) : (
                            <input
                              name={key}
                              type={getFieldType(key, value)}
                              value={typeof value === "string" || typeof value === "number" ? value : ""}
                              onChange={handleChange}
                              className="p-2 border rounded focus:outline-blue-400"
                            />
                          )}
                        </div>
                      ))}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-gray-300"
                      onClick={() => {
                        setEditMode(false);
                        setFormData(profile);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : profile ? (
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">First Name</span>
                    <span className="text-base text-blue-900 bg-blue-50 rounded px-2 py-1 break-words">
                      {profile.firstName || ""}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Last Name</span>
                    <span className="text-base text-blue-900 bg-blue-50 rounded px-2 py-1 break-words">
                      {profile.lastName || ""}
                    </span>
                  </div>
                  {Object.entries(profile)
                    .filter(([key]) => key !== "firstName" && key !== "lastName")
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">
                          {prettyLabel(key)}
                        </span>
                        <span className="text-base text-blue-900 bg-blue-50 rounded px-2 py-1 break-words">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">No profile data found.</div>
              )}
            </div>
          </div>
          <div className={`${desktopMode ? "w-1/2 pl-8 flex flex-col justify-between" : ""}`}>
            <div className="mb-6">
              <div className="font-semibold mb-2 text-blue-700">Access Tax Year Questionnaire</div>
              <div className="flex flex-col gap-2 mb-2">
                {[2022, 2023, 2024, 2025].map((year) => (
                  <a
                    key={year}
                    href={`/main/${year}`}
                    className="block px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-center"
                  >
                    {year} Questionnaire
                  </a>
                ))}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Completed:{" "}
                {completedYears.length > 0
                  ? completedYears.join(", ")
                  : "None"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 w-full"
                onClick={() => signOut({ callbackUrl: "/main/signin" })}
              >
                Sign Out
              </button>
              <button
                className="w-full px-6 py-2 rounded bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => router.push('/main')}
              >
                ← Back
              </button>
              <button
                className="w-full px-6 py-2 rounded bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition mt-2"
                onClick={() => router.push('/main/1040')}
              >
                View My 1040
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
