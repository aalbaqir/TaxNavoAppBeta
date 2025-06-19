"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/main/signin");
      return;
    }
    if (status === "authenticated" && session?.user?.email) {
      // Fetch profile info from backend (stub: just email for now)
      fetch("/api/questionnaire?year=2024")
        .then((res) => res.json())
        .then((data) => {
          if (!data.questionnaire || !data.questionnaire.answers || Object.keys(data.questionnaire.answers).length === 0) {
            // No profile/questionnaire, redirect to questionnaire
            router.replace("/main/2024");
          } else {
            setProfile(data.questionnaire.answers);
            setLoading(false);
          }
        })
        .catch(() => {
          // On error, treat as no profile
          router.replace("/main/2024");
        });
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) return null;

  // Basic profile UI structure
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.name || session.user?.email}</h1>
        <div className="mb-6 text-blue-900">
          <div className="font-semibold mb-2">Profile Information</div>
          {profile ? (
            <pre className="bg-blue-50 rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap break-words max-w-full">{JSON.stringify(profile, null, 2)}</pre>
          ) : (
            <div className="text-gray-500">No profile data found.</div>
          )}
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2 text-blue-700">Access Tax Year Questionnaire</div>
          <div className="flex flex-col gap-2">
            {[2022, 2023, 2024, 2025].map(year => (
              <a
                key={year}
                href={`/main/${year}`}
                className="block px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-center"
              >
                {year} Questionnaire
              </a>
            ))}
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
          onClick={() => signOut({ callbackUrl: "/main/signin" })}
        >
          Sign Out
        </button>
        <button
          className="mt-4 w-full px-6 py-2 rounded bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 transition"
          onClick={() => router.back()}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
